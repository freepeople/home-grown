(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
var Slider = require('./slider.proto');
var pubsub = require('./utils/pubsub');

var slider = new Slider('#slider', {
    directionNav: '#slider-direction-nav',
    controlNav: '#slider-control-nav',
    pauseTime: 0
});

var bc = function() {
    console.log('before slide change');
};

pubsub.subscribe('beforeChange', bc);
// pubsub.subscribe('beforeChange', function() {
//     console.log('different dev using anonymous function cb');
// });

// pubsub.subscribe('hovered', function() {
//     console.log('hovered on slide');
// });

// setTimeout(function() {
//     pubsub.unsubscribe('beforeChange', bc);
// }, 12000);
},{"./slider.proto":2,"./utils/pubsub":7}],2:[function(require,module,exports){
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
var Swiper = require('./utils/swipe');

var query = document.querySelector.bind(document);

var _removeAllClasses = function() {
    removeClass(query('.current'), 'current');
    removeClass(query('.hide-previous'), 'hide-previous');
    removeClass(query('.show-previous'), 'show-previous');
    removeClass(query('.show-next'), 'show-next');
    removeClass(query('.hide-next'), 'hide-next');
};

var _updatePagination = function(index) {
    var pagination = query('#slider-control-nav');
    removeClass(query('.active-pager'), 'active-pager');
    addClass(pagination.children[index], 'active-pager');
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

    addClass(slides[this.currentSlide], 'current');
    addClass(slides[this.currentSlide], 'show-previous');
    addClass(slides[this.currentSlide === slides.length - 1 ? 0 : this.currentSlide + 1], 'hide-next');
    _updatePagination(this.currentSlide);

    pubsub.publish('afterChange', this.currentSlide);
};

SliderProto.next = function() {
    var slides = this.slides;
    pubsub.publish('beforeChange', this.currentSlide);

    _removeAllClasses();

    this.currentSlide++;

    if (this.currentSlide >= slides.length) this.currentSlide = 0;

    addClass(slides[this.currentSlide], 'current');
    addClass(slides[this.currentSlide], 'show-next');
    addClass(slides[this.currentSlide === 0 ? slides.length - 1 : this.currentSlide - 1], 'hide-previous');
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
        addClass(slides[oldIndex], 'hide-previous');
        addClass(slides[this.currentSlide], 'show-next');
    } else {
        addClass(slides[oldIndex], 'hide-next');
        addClass(slides[this.currentSlide], 'show-previous');
    }

    addClass(slides[this.currentSlide], 'current');
    _updatePagination(index);
};

module.exports = Slider;
},{"./utils/addClass":3,"./utils/addListener":4,"./utils/extend":5,"./utils/forEach":6,"./utils/pubsub":7,"./utils/removeClass":8,"./utils/swipe":9}],3:[function(require,module,exports){
'use strict';

module.exports = function(el, className) {
    if (!el) {
        return;
    }
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
        return el.addEventListener(eventName, handler);
    } else {
        el.attachEvent('on' + eventName, function() {
            return handler.call(el);
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

module.exports = function(arr, callback, thisObj) {
    if (arr === null) {
        return;
    }
    var i = -1;
    var len = arr.length;
    while (++i < len) {
        // we iterate over sparse items since there is no way to make it
        // work properly on IE 7-8.
        if (callback.call(thisObj, arr[i], i, arr) === false) {
            break;
        }
    }
};
},{}],7:[function(require,module,exports){
'use strict';

var _checkEvent = function(e) {
    if (Object.prototype.toString.call(e) !== '[object String]') {
        throw new TypeError('Event is not a string.');
    }
};

var _checkHandler = function(handler) {
    if (typeof handler !== 'function') {
        throw new TypeError('Handler is not a function');
    }
};

var handlers = {};
var pubsub = {
    publish: function(e) {
        _checkEvent(e);

        if (!handlers[e]) return;

        var context = {
            e: e,
            args: [].slice.call(arguments, 1)
        };

        for (var i = 0, l = handlers[e].length; i < l; i++) {
            handlers[e][i].apply(context, context.args);
        }
    },
    subscribe: function(e, handler) {
        _checkEvent(e);
        _checkHandler(handler);
        (handlers[e] = handlers[e] || []).push(handler);
    },
    unsubscribe: function() {
        var args = [].slice.call(arguments);
        var e = args[0];
        var handler = args[1];

        _checkEvent(e);
        _checkHandler(handler);

        if (e in handlers === false) return;
        handlers[e].splice(handlers[e].indexOf(handler), 1);
    }
};
module.exports = pubsub;
},{}],8:[function(require,module,exports){
'use strict';
module.exports = function(el, className) {
    if (!el) {
        return;
    }
    if (el.classList) {
        return el.classList.remove(className);
    } else {
        el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        return el.className;
    }
};
},{}],9:[function(require,module,exports){
/***
 *       ____         _
 *      / __/_    __ (_)___  ___  ____
 *     _\ \ | |/|/ // // _ \/ -_)/ __/
 *    /___/ |__,__//_// .__/\__//_/
 *                   /_/
 */
"use strict";
var pubsub = require('./pubsub');

var Swiper = function() {
    this.isSwiping = false;
    this.threshold = 20;
    this.startX = 0;
    this.startY = 0;
};

var SwiperProto = Swiper.prototype;
var listenTo = document.addEventListener.bind(document);

SwiperProto.init = function() {
    return listenTo('touchstart', this.onTouchstart.bind(this), false);
};

SwiperProto.onTouchstart = function(e) {
    if (!e.touches) return;
    this.startX = e.touches[0].pageX;
    this.startY = e.touches[0].pageY;
    this.isSwiping = true;
    listenTo('touchmove', this.onTouchmove.bind(this), false);
    listenTo('touchend', this.onTouchend.bind(this), false);
};

SwiperProto.onTouchmove = function(e) {
    e.preventDefault();
    if (this.isSwiping) {
        var x = e.touches[0].pageX;
        var y = e.touches[0].pageY;
        var distanceX = this.startX - x;
        var distanceY = this.startY - y;
        var direction;
        if (Math.abs(distanceX) >= this.threshold) {
            direction = distanceX > 0 ? 'left' : 'right';
        }
        if (Math.abs(distanceY) >= this.threshold) {
            direction = distanceY > 0 ? 'down' : 'up';
        }
        if (direction) {
            this.onTouchend.call(this);
            pubsub.publish('swipe', direction);
        }

    }
};

SwiperProto.onTouchend = function() {
    this.isSwiping = false;
    document.removeEventListener('touchmove', this.onTouchmove.bind(this));
    document.removeEventListener('touchend', this.onTouchend.bind(this));
};

module.exports = Swiper;
},{"./pubsub":7}]},{},[1])