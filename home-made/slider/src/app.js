'use strict';
var Slider = require('./slider.proto');
var pubsub = require('./utils/pubsub');

var slider = new Slider('#slider', {
    directionNav: '#slider-direction-nav',
    controlNav: '#slider-control-nav'
});