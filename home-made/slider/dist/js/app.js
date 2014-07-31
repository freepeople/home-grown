(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
var Slider = require('./slider.proto');
var pubsub = require('./utils/pubsub');

var slider = new Slider('#slider', {
    directionNav: '#slider-direction-nav',
    controlNav: '#slider-control-nav',
    pauseTime: 0
});

// var bc = function() {
//     console.log('before slide change');
// };

// pubsub.subscribe('beforeChange', bc);

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
var swipe = require('./utils/swipe');

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
    this.$selector = document.querySelector(this.selector);
    this.options = extend(this.options, options);
    this.slides = [];
    for (var i = this.$selector.children.length; i--;) {
        // Skip comment nodes on IE8
        if (this.$selector.children[i].nodeType !== 8) {
            this.slides.unshift(this.$selector.children[i]);
        }
    }
    swipe.init();
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
    _updatePagination(this.currentSlide);

    pubsub.subscribe('swipe', function(direction) {
        if (direction === 'left') {
            self.next();
        }
        if (direction === 'right') {
            self.prev();
        }
    });
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

    _removeAllClasses();

    this.currentSlide--;

    if (this.currentSlide < 0) {
        this.currentSlide = slides.length - 1;
    }

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

    if (this.currentSlide >= slides.length) {
        this.currentSlide = 0;
    }

    addClass(slides[this.currentSlide], 'current');
    addClass(slides[this.currentSlide], 'show-next');
    addClass(slides[this.currentSlide === 0 ? slides.length - 1 : this.currentSlide - 1], 'hide-previous');
    _updatePagination(this.currentSlide);

    pubsub.publish('afterChange', this.currentSlide);
};

SliderProto.showSlide = function(index) {
    var slides = this.slides;
    var oldIndex = query('.current').getAttribute('data-index');
    this.currentSlide = index;
    if (!index || oldIndex === index) {
        return;
    }

    _removeAllClasses();

    if (this.currentSlide < 0) {
        this.currentSlide = this.slides.length - 1;
    }
    if (this.currentSlide >= this.slides.length) {
        this.currentSlide = 0;
    }

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

var _checkEvent = function(event) {
    if (Object.prototype.toString.call(event) !== '[object String]') {
        throw new TypeError('Event is not a string.');
    }
};

var _checkHandler = function(handler) {
    if (typeof handler !== 'function') {
        throw new TypeError('Handler is not a function');
    }
};

var handlers = {};
var pubsub = {};

pubsub.publish = function(event) {
    _checkEvent(event);

    if (!handlers[event]) {
        return;
    }

    var context = {
        event: event,
        args: [].slice.call(arguments, 1)
    };

    for (var i = 0, l = handlers[event].length; i < l; i++) {
        handlers[event][i].apply(context, context.args);
    }
};

pubsub.subscribe = function(event, handler) {
    _checkEvent(event);
    _checkHandler(handler);
    (handlers[event] = handlers[event] || []).push(handler);
};

pubsub.unsubscribe = function() {
    var args = [].slice.call(arguments);
    var event = args[0];
    var handler = args[1];

    _checkEvent(event);
    _checkHandler(handler);

    if (event in handlers === false) {
        return;
    }
    handlers[event].splice(handlers[event].indexOf(handler), 1);
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
'use strict';
var pubsub = require('./pubsub');
var Swiper = {
    config: {
        isMoving: false,
        threshold: 20,
        startX: "",
        startY: ""
    },
    touchHandler: function(event) {
        event.preventDefault();
        if (typeof event.touches !== 'undefined') {
            var gestures = {
                'touchstart': function(event) {
                    Swiper.config.startX = event.touches[0].pageX;
                    Swiper.config.startY = event.touches[0].pageY;
                    Swiper.config.isMoving = true;
                    document.addEventListener('touchmove', gestures.touchmove, false);
                    document.addEventListener('touchend', gestures.touchend, false);
                },
                'touchmove': function(event) {
                    if (Swiper.config.isMoving) {
                        var x = event.touches[0].pageX;
                        var y = event.touches[0].pageY;
                        var dx = Swiper.config.startX - x;
                        var dy = Swiper.config.startY - y;
                        var direction;
                        if (Math.abs(dx) >= Swiper.config.threshold) {
                            direction = dx > 0 ? 'left' : 'right';
                        }
                        if (Math.abs(dy) >= Swiper.config.threshold) {
                            direction = dy > 0 ? 'down' : 'up';
                        }
                        if (direction) {
                            gestures.touchend.call(this);
                            pubsub.publish('swipe', direction);
                        }
                    }
                },
                'touchend': function() {
                    document.removeEventListener('touchmove', gestures.touchmove);
                    document.removeEventListener('touchend', gestures.touchend);
                    Swiper.config.isMoving = false;
                }
            };

            if (gestures && typeof(gestures[event.type]) === 'function') {
                gestures[event.type].call(this, event);
            }
        }
    },
    init: function() {
        return document.addEventListener('touchstart', Swiper.touchHandler, false);
    }
};

module.exports = Swiper;
},{"./pubsub":7}]},{},[1])