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
    this.isMoving = false;
    this.threshold = 20;
    this.startX = 0;
    this.startY = 0;
};

var SwiperProto = Swiper.prototype;

SwiperProto.init = function() {
    return document.addEventListener('touchstart', this.onTouchstart.bind(this), false);
};

SwiperProto.onTouchstart = function(e) {
    if (!e.touches) {
        return;
    }
    this.startX = e.touches[0].pageX;
    this.startY = e.touches[0].pageY;
    this.isMoving = true;
    document.addEventListener('touchmove', this.onTouchmove.bind(this), false);
    document.addEventListener('touchend', this.onTouchend.bind(this), false);
};

SwiperProto.onTouchmove = function(e) {
    e.preventDefault();
    if (this.isMoving) {
        var x = e.touches[0].pageX;
        var y = e.touches[0].pageY;
        var dx = this.startX - x;
        var dy = this.startY - y;
        var direction;
        if (Math.abs(dx) >= this.threshold) {
            direction = dx > 0 ? 'left' : 'right';
        }
        if (Math.abs(dy) >= this.threshold) {
            direction = dy > 0 ? 'down' : 'up';
        }
        if (direction) {
            this.onTouchend.call(this);
            pubsub.publish('swipe', direction);
        }
    }
};

SwiperProto.onTouchend = function() {
    document.removeEventListener('touchmove', this.onTouchmove.bind(this));
    document.removeEventListener('touchend', this.onTouchend.bind(this));
    this.isMoving = false;
};

module.exports = Swiper;