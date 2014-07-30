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