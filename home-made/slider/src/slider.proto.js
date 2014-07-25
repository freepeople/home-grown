// This is orginally lean-slider
// but converted to vanilla js
// and built on top with browserify help :)
'use strict';
var extend = require('./utils/extend');
var addListener = require('./utils/addListener');
var addClass = require('./utils/addClass');
var removeClass = require('./utils/removeClass');
var forEach = require('./utils/forEach');
var pubsub = require('./utils/pubsub');

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

    addClass(this.$selector, 'lean-slider');
    forEach(this.slides, function(slide) {
        addClass(slide, 'lean-slider-slide');
    });
    this.currentSlide = this.options.startSlide;
    if (this.options.startSlide < 0 || this.options.startSlide >= this.slides.length) {
        this.currentSlide = 0;
    }
    this.slides[this.currentSlide].classList.add('current');

    if ($directionNav) {
        $nextNav = document.querySelector('.lean-slider-next');
        $prevNav = document.querySelector('.lean-slider-prev');

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
            bullets = '<a href="#" data-index="' + i + '" class="lean-slider-control-nav">' + (i + 1) + '</a>';
            $controlNav.innerHTML += bullets;
        }
        addListener($controlNav, 'click', function(e) {
            e.preventDefault();
            var i = e.target.getAttribute('data-index');
            self.show(i);
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
    pubsub.publish('beforeChange', this.currentSlide);

    var oldCurrent = this.currentSlide;
    this.currentSlide--;
    if (this.currentSlide < 0) {
        this.currentSlide = this.slides.length - 1;
    }
    removeClass(this.slides[oldCurrent], 'current');
    addClass(this.slides[this.currentSlide], 'current');

    pubsub.publish('afterChange', this.currentSlide);
};

SliderProto.next = function() {
    pubsub.publish('beforeChange', this.currentSlide);

    var oldCurrent = this.currentSlide;
    this.currentSlide++;
    if (this.currentSlide >= this.slides.length) {
        this.currentSlide = 0;
    }
    removeClass(this.slides[oldCurrent], 'current');
    addClass(this.slides[this.currentSlide], 'current');

    pubsub.publish('afterChange', this.currentSlide);
};

SliderProto.show = function(index) {
    var oldCurrent = this.currentSlide;
    this.currentSlide = index;
    if (this.currentSlide < 0) {
        this.currentSlide = this.slides.length - 1;
    }
    if (this.currentSlide >= this.slides.length) {
        this.currentSlide = 0;
    }
    removeClass(this.slides[oldCurrent], 'current');
    addClass(this.slides[this.currentSlide], 'current');
};

module.exports = Slider;