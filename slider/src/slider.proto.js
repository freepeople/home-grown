// This is orginally lean-slider
// but converted to vanilla js
// and built on top with browserify help :)
'use strict';

var extend = require('utils/extend');
var addListener = require('utils/addListener');
var forEach = require('utils/forEach');
var pubsub = require('utils/pubsub');
var Swiper = require('utils/swipe');
var classes = require('utils/classes');
var query = document.querySelector.bind(document);
var _removeAllClasses = function() {
    classes('removeClass', query('.current'), 'current');
    classes('removeClass', query('.hide-previous'), 'hide-previous');
    classes('removeClass', query('.show-previous'), 'show-previous');
    classes('removeClass', query('.show-next'), 'show-next');
    classes('removeClass', query('.hide-next'), 'hide-next');
};
var _updatePagination = function(index) {
    var pagination = query('#slider-control-nav');
    classes('removeClass', query('.active-pager'), 'active-pager');
    classes('addClass', pagination.children[index], 'active-pager');
};
var Slider = function(selector, options) {
    this.options = {
        pauseTime: 4000,
        pauseOnHover: true,
        startSlide: 0,
        directionNav: '',
        directionNavPrevBuilder: '',
        directionNavNextBuilder: '',
        controlNav: '',
        controlNavBuilder: ''
    };
    this.currentSlide = 0;
    this.timer = 0;
    this.selector = selector;
    this.$selector = query(this.selector);
    this.options = extend(this.options, options);
    this.slides = [];
    for (var i = this.$selector.children.length; i--;) {
        // Skip comment nodes on IE8
        if (this.$selector.children[i].nodeType !== 8) {
            this.slides.unshift(this.$selector.children[i]);
        }
    }
    var swipe = new Swiper();
    swipe.init();
    this.init();
    this.autoLoop();
};
var SliderProto = Slider.prototype;

SliderProto.init = function() {
    var $nextNav;
    var $prevNav;
    var bullets;
    var $directionNav = query(this.options.directionNav);
    var $controlNav = query(this.options.controlNav);

    classes('addClass', this.$selector, 'homemade-slider');
    forEach(this.slides, function(slide, i) {
        classes('addClass', slide, 'homemade-slider-slide');
        slide.setAttribute('data-index', i);
    });

    this.currentSlide = this.options.startSlide;
    if (this.options.startSlide < 0 || this.options.startSlide >= this.slides.length) {
        this.currentSlide = 0;
    }
    classes('addClass', this.slides[this.currentSlide], 'current');

    if ($directionNav) {
        $nextNav = query('.homemade-slider-next');
        $prevNav = query('.homemade-slider-prev');

        addListener($prevNav, 'click', function(e) {
            e.preventDefault();
            this.prev();
        }.bind(this));

        addListener($nextNav, 'click', function(e) {
            e.preventDefault();
            this.next();
        }.bind(this));
    }
    if ($controlNav) {
        for (var i = 0; i < this.slides.length; i++) {
            bullets = '<a href="#" data-index="' + i + '" class="homemade-slider-control-nav">' + (i + 1) + '</a>';
            $controlNav.innerHTML += bullets;
        }
        addListener($controlNav, 'click', function(e) {
            e.preventDefault();
            var i = e.target.getAttribute('data-index');
            this.showSlide(i);
        }.bind(this));
    }

    if (this.options.pauseOnHover) {
        addListener(this.$selector, 'mouseenter', function() {
            pubsub.publish('hovered');
            clearTimeout(this.timer);
        }.bind(this));
        addListener(this.$selector, 'mouseout', function() {
            this.autoLoop();
        }.bind(this));
    }
    _updatePagination(this.currentSlide);

    pubsub.subscribe('swipe', function(direction) {
        if (direction === 'left') this.next();
        if (direction === 'right') this.prev();
    }.bind(this));
};


SliderProto.autoLoop = function() {
    if (this.options.pauseTime && this.options.pauseTime > 0) {
        clearTimeout(this.timer);
        this.timer = setTimeout(function() {
            this.next();
            this.autoLoop();
        }.bind(this), this.options.pauseTime);
    }
};


SliderProto.prev = function() {
    var slides = this.slides;
    pubsub.publish('beforeChange', this.currentSlide);

    _removeAllClasses();

    this.currentSlide--;

    if (this.currentSlide < 0) this.currentSlide = slides.length - 1;

    classes('addClass', slides[this.currentSlide], 'current');
    classes('addClass', slides[this.currentSlide], 'show-previous');
    classes('addClass', slides[this.currentSlide === slides.length - 1 ? 0 : this.currentSlide + 1], 'hide-next');
    _updatePagination(this.currentSlide);

    pubsub.publish('afterChange', this.currentSlide);
};

SliderProto.next = function() {
    var slides = this.slides;
    pubsub.publish('beforeChange', this.currentSlide);

    _removeAllClasses();

    this.currentSlide++;

    if (this.currentSlide >= slides.length) this.currentSlide = 0;

    classes('addClass', slides[this.currentSlide], 'current');
    classes('addClass', slides[this.currentSlide], 'show-next');
    classes('addClass', slides[this.currentSlide === 0 ? slides.length - 1 : this.currentSlide - 1], 'hide-previous');
    _updatePagination(this.currentSlide);

    pubsub.publish('afterChange', this.currentSlide);
};

SliderProto.showSlide = function(index) {
    var slides = this.slides;
    var oldIndex = query('.current').getAttribute('data-index');
    if (!index || oldIndex === index) return;
    this.currentSlide = index;
    _removeAllClasses();

    if (this.currentSlide < 0) this.currentSlide = this.slides.length - 1;
    if (this.currentSlide >= this.slides.length) this.currentSlide = 0;

    if (this.currentSlide > oldIndex) {
        classes('addClass', slides[oldIndex], 'hide-previous');
        classes('addClass', slides[this.currentSlide], 'show-next');
    } else {
        classes('addClass', slides[oldIndex], 'hide-next');
        classes('addClass', slides[this.currentSlide], 'show-previous');
    }

    classes('addClass', slides[this.currentSlide], 'current');
    _updatePagination(index);
};

module.exports = Slider;