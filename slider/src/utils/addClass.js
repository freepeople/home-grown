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