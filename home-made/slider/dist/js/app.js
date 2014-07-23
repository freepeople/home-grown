(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Slider = require('./slider.proto');

var slider = new Slider('#slider', {
    directionNav: '#slider-direction-nav'
});
},{"./slider.proto":2}],2:[function(require,module,exports){
// This is orginally lean-slider
// but converted to vanilla js
// and built on top with browserify help :)
'use strict';
var extend = require('./utils/extend');
var addListener = require('./utils/addListener');
var addClass = require('./utils/addClass');
var removeClass = require('./utils/removeClass');

var Slider = function(selector, options) {
    this.options = {
        pauseTime: 4000,
        pauseOnHover: true,
        startSlide: 0,
        directionNav: '',
        directionNavPrevBuilder: '',
        directionNavNextBuilder: '',
        controlNav: '',
        controlNavBuilder: '',
        prevText: 'Prev',
        nextText: 'Next',
        beforeChange: function() {},
        afterChange: function() {},
        afterLoad: function() {}
    };
    this.currentSlide = 0;
    this.timer = 0;
    this.selector = selector;
    this.$selector = document.querySelector(this.selector);
    this.options = extend(this.options, options);
    this.children = [];
    for (var i = this.$selector.children.length; i--;) {
        // Skip comment nodes on IE8
        if (this.$selector.children[i].nodeType !== 8) {
            this.children.unshift(this.$selector.children[i]);
        }
    }
    this.init();
};

var SliderProto = Slider.prototype;

SliderProto.init = function() {
    var $nextNav;
    var $prevNav;
    var self = this;
    var $directionNav = document.querySelector(this.options.directionNav);

    addClass(this.$selector, 'lean-slider');
    this.children.forEach(function(child) {
        addClass(child, 'lean-slider-slide');
    });
    this.currentSlide = this.options.startSlide;
    if (this.options.startSlide < 0 || this.options.startSlide >= this.children.length) {
        this.currentSlide = 0;
    }
    this.children[this.currentSlide].classList.add('current');

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
};


// Process timer
SliderProto.doTimer = function() {
    var self = this;
    if (this.options.pauseTime && this.options.pauseTime > 0) {
        clearTimeout(this.timer);
        this.timer = setTimeout(function() {
            self.next();
        }, this.options.pauseTime);
    }
};


SliderProto.prev = function() {
    var oldCurrent = this.currentSlide;
    this.currentSlide--;
    if (this.currentSlide < 0) {
        this.currentSlide = this.children.length - 1;
    }
    removeClass(this.children[oldCurrent], 'current');
    addClass(this.children[this.currentSlide], 'current');

};

SliderProto.next = function() {
    var oldCurrent = this.currentSlide;
    this.currentSlide++;
    if (this.currentSlide >= this.children.length) {
        this.currentSlide = 0;
    }
    removeClass(this.children[oldCurrent], 'current');
    addClass(this.children[this.currentSlide], 'current');
};

SliderProto.show = function() {};

module.exports = Slider;
},{"./utils/addClass":3,"./utils/addListener":4,"./utils/extend":5,"./utils/removeClass":6}],3:[function(require,module,exports){
'use strict';

module.exports = function(el, className) {
    if (el.classList) {
        el.classList.add(className);
    } else {
        el.className += ' ' + className;
    }
};
},{}],4:[function(require,module,exports){
'use strict';
module.exports = function(el, eventName, handler) {
    if (el.addEventListener) {
        el.addEventListener(eventName, handler);
    } else {
        el.attachEvent('on' + eventName, function() {
            handler.call(el);
        });
    }
};
},{}],5:[function(require,module,exports){
'use strict';

module.exports = function(obj) {
    var arr = [];
    // create true array from arguments
    arr = arr.slice.call(arguments, 1);
    arr.forEach(function(source) {
        if (source) {
            for (var prop in source) {
                if (source.hasOwnProperty(prop)) {
                    obj[prop] = source[prop];
                }
            }
        }
    });
    return obj;
};
},{}],6:[function(require,module,exports){
'use strict';
module.exports = function(el, className) {
    if (el.classList) {
        el.classList.remove(className);
    } else {
        el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
};
},{}]},{},[1])