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
        args: Array.prototype.slice.call(arguments, 1)
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
    var len;
    var event;
    var index;
    var handler;
    var args = Array.prototype.slice.call(arguments);

    if (args.length >= 2) {
        event = args[0];
        handler = args[1];

        _checkEvent(event);
        _checkHandler(handler);

        if (!handlers[event]) {
            return;
        }

        for (index = 0, len = handlers[event].length; index < len; index++) {
            if (handlers[event][index] === handler) {
                handlers[event].splice(index, 1);
            }
        }
    } else {
        handler = args[0];

        _checkHandler(handler);

        for (event in handlers) {
            if (handlers.hasOwnProperty(event)) {
                for (index = 0, len = handlers[event].length; index < len; index++) {
                    if (handlers[event][index] === handler) {
                        handlers[event].splice(index, 1);
                    }
                }
            }
        }
    }
};

module.exports = pubsub;