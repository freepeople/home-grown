/***
 *       ____         _
 *      / __/_    __ (_)___  ___  ____
 *     _\ \ | |/|/ // // _ \/ -_)/ __/
 *    /___/ |__,__//_// .__/\__//_/
 *                   /_/
 */
"use strict";
var pubsub = require('./pubsub');
var onEvent = require('./onEvent');
var Swiper = function() {
    this.isSwiping = false;
    this.threshold = 20;
    this.startX = 0;
    this.startY = 0;
};
var SwiperProto = Swiper.prototype;

SwiperProto.init = function() {
    return onEvent('touchstart', document, this.onTouchstart.bind(this));
};

SwiperProto.onTouchstart = function(e) {
    if (!e.touches) return;
    this.startX = e.touches[0].pageX;
    this.startY = e.touches[0].pageY;
    this.isSwiping = true;
    onEvent('touchmove', document, this.onTouchmove.bind(this));
    onEvent('touchend', document, this.onTouchend.bind(this));
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