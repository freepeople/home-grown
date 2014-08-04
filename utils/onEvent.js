'use strict';
module.exports = function(eventName, el, handler) {
    if (el.addEventListener) {
        return el.addEventListener(eventName, handler);
    } else {
        el.attachEvent('on' + eventName, function() {
            return handler.call(el);
        });
    }
};