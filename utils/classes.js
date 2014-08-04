'use strict';
module.exports = function(type, el, className) {
    if (!el) return;
    var actions = {
        'addClass': function() {
            if (el.classList) {
                el.classList.add(className);
            } else {
                el.className += ' ' + className;
            }
        },
        'hasClass': function() {
            if (el.classList) {
                return el.classList.contains(className);
            } else {
                return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
            }
        },
        'removeClass': function() {
            if (el.classList) {
                return el.classList.remove(className);
            } else {
                el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
                return el.className;
            }
        }
    };

    if (actions && typeof actions[type] === 'function') {
        actions[type].call();
    }
};