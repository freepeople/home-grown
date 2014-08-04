'use strict';
module.exports = function(type, el, attr, opts) {
    if (!el) return;
    var types = {
        'addClass': function() {
            if (el.classList) {
                el.classList.add(attr);
            } else {
                el.attr += ' ' + attr;
            }
        },
        'hasClass': function() {
            if (el.classList) {
                return el.classList.contains(attr);
            } else {
                return new RegExp('(^| )' + attr + '( |$)', 'gi').test(el.attr);
            }
        },
        'removeClass': function() {
            if (el.classList) {
                return el.classList.remove(attr);
            } else {
                el.attr = el.attr.replace(new RegExp('(^|\\b)' + attr.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
                return el.attr;
            }
        },
        'getAttr': function() {
            return el.getAttribute(attr);
        },
        'setAttr': function() {
            return el.setAttribute(attr, opts);
        }
    };

    if (types && typeof types[type] === 'function') {
        return types[type].call();
    }
};