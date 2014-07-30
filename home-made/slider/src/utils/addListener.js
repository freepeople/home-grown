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