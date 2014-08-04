'use strict';
var Slider = require('./slider.proto');
var pubsub = require('utils/pubsub');

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