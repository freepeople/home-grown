'use strict';

module.exports = function(el, className) {
    if (!el) {
        return;
    }
    if (el.classList) {
        return el.classList.contains(className);
    } else {
        return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
    }
};