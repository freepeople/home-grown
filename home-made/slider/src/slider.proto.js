// This is orginally lean-slider
// but converted to vanilla js
// and built on top with browserify help :)
'use strict';
var extend = require('./utils/extend');
var addListener = require('./utils/addListener');
var addClass = require('./utils/addClass');
var removeClass = require('./utils/removeClass');
var hasClass = require('./utils/hasClass');
var forEach = require('./utils/forEach');
var siblings = require('./utils/siblings');
var pubsub = require('./utils/pubsub');

var query = document.querySelector.bind(document);
var removeAllClasses = function() {
    removeClass(query('.current'), 'current');
    removeClass(query('.hide-previous'), 'hide-previous');
    removeClass(query('.show-previous'), 'show-previous');
    removeClass(query('.show-next'), 'show-next');
    removeClass(query('.hide-next'), 'hide-next');
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
    this.$selector = document.querySelector(this.selector);
    this.options = extend(this.options, options);
    this.slides = [];
    for (var i = this.$selector.children.length; i--;) {
        // Skip comment nodes on IE8
        if (this.$selector.children[i].nodeType !== 8) {
            this.slides.unshift(this.$selector.children[i]);
        }
    }
    this.init();
    this.autoLoop();

};

var SliderProto = Slider.prototype;

SliderProto.init = function() {
    var $nextNav;
    var $prevNav;
    var self = this;
    var bullets;
    var $directionNav = document.querySelector(this.options.directionNav);
    var $controlNav = document.querySelector(this.options.controlNav);

    addClass(this.$selector, 'homemade-slider');
    forEach(this.slides, function(slide, i) {
        addClass(slide, 'homemade-slider-slide');
        slide.setAttribute('data-index', i);
    });
    this.currentSlide = this.options.startSlide;
    if (this.options.startSlide < 0 || this.options.startSlide >= this.slides.length) {
        this.currentSlide = 0;
    }
    addClass(this.slides[this.currentSlide], 'current');

    if ($directionNav) {
        $nextNav = document.querySelector('.homemade-slider-next');
        $prevNav = document.querySelector('.homemade-slider-prev');

        addListener($prevNav, 'click', function(e) {
            e.preventDefault();
            self.prev();
        });

        addListener($nextNav, 'click', function(e) {
            e.preventDefault();
            self.next();
        });
    }
    if ($controlNav) {
        for (var i = 0; i < this.slides.length; i++) {
            bullets = '<a href="#" data-index="' + i + '" class="homemade-slider-control-nav">' + (i + 1) + '</a>';
            $controlNav.innerHTML += bullets;
        }
        addListener($controlNav, 'click', function(e) {
            e.preventDefault();
            var i = e.target.getAttribute('data-index');
            self.showSlide(i);
        });
    }

    if (this.options.pauseOnHover) {
        addListener(this.$selector, 'mouseenter', function() {
            pubsub.publish('hovered');
            clearTimeout(self.timer);
        });
        addListener(this.$selector, 'mouseout', function() {
            self.autoLoop();
        });
    }

};


SliderProto.autoLoop = function() {
    var self = this;
    if (this.options.pauseTime && this.options.pauseTime > 0) {
        clearTimeout(this.timer);
        this.timer = setTimeout(function() {
            self.next();
            self.autoLoop();
        }, this.options.pauseTime);
    }
};


SliderProto.prev = function() {
    var slides = this.slides;
    pubsub.publish('beforeChange', this.currentSlide);

    removeAllClasses();

    this.currentSlide--;

    if (this.currentSlide < 0) {
        this.currentSlide = slides.length - 1;
    }

    addClass(slides[this.currentSlide], 'current');
    addClass(slides[this.currentSlide], 'show-previous');
    addClass(slides[this.currentSlide === slides.length - 1 ? 0 : this.currentSlide + 1], 'hide-next');

    pubsub.publish('afterChange', this.currentSlide);
};

SliderProto.next = function() {
    var slides = this.slides;
    pubsub.publish('beforeChange', this.currentSlide);

    removeAllClasses();

    this.currentSlide++;

    if (this.currentSlide >= slides.length) {
        this.currentSlide = 0;
    }

    addClass(slides[this.currentSlide], 'current');
    addClass(slides[this.currentSlide], 'show-next');
    addClass(slides[this.currentSlide === 0 ? slides.length - 1 : this.currentSlide - 1], 'hide-previous');

    pubsub.publish('afterChange', this.currentSlide);
};

SliderProto.showSlide = function(index) {
    if (!index) {
        return;
    }
    var slides = this.slides;
    var oldIndex = query('.current').getAttribute('data-index');
    this.currentSlide = index;

    removeAllClasses();

    if (this.currentSlide < 0) {
        this.currentSlide = this.slides.length - 1;
    }
    if (this.currentSlide >= this.slides.length) {
        this.currentSlide = 0;
    }

    if (this.currentSlide > oldIndex) {
        addClass(slides[oldIndex], 'hide-previous');
        addClass(slides[this.currentSlide], 'show-next');
    }
    if (this.currentSlide < oldIndex) {
        addClass(slides[this.currentSlide], 'hide-next');
        addClass(slides[oldIndex], 'show-previous');
    }

    addClass(slides[this.currentSlide], 'current');
};

module.exports = Slider;