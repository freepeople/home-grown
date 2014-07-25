'use strict';

var _checkEvent = function(event) {
    if (Object.prototype.toString.call(event) !== '[object String]') {
        throw new TypeError('Event is not a string.');
    }
};

var _checkHandler = function(handler) {
    if (typeof handler !== 'function') {
        throw new TypeError('Handler is not a function');
    }
};

var handlers = {};
var pubsub = {};

pubsub.publish = function(event) {
    _checkEvent(event);

    if (!handlers[event]) {
        return;
    }

    var context = {
        event: event,
        args: [].slice.call(arguments, 1)
    };

    for (var i = 0, l = handlers[event].length; i < l; i++) {
        handlers[event][i].apply(context, context.args);
    }
};

pubsub.subscribe = function(event, handler) {
    _checkEvent(event);
    _checkHandler(handler);
    (handlers[event] = handlers[event] || []).push(handler);
};

pubsub.unsubscribe = function() {
    var args = [].slice.call(arguments);
    var event = args[0];
    var handler = args[1];

    _checkEvent(event);
    _checkHandler(handler);

    if (event in handlers === false) {
        return;
    }
    handlers[event].splice(handlers[event].indexOf(handler), 1);
};

module.exports = pubsub;