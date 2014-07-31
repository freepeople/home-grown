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