'use strict';

// el = element
// sibling is previousSibling or nextSibling
module.exports = function(el, sibling) {
    if (!el) {
        return;
    }
    do {
        el = el[sibling];
    } while (el && el.nodeType !== 1);
    return el;
};