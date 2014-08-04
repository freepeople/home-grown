'use strict';
var pubsub = require('utils/pubsub');
var test = require('tape');

test('check that we can publish and subscribe', function(t) {
    t.plan(2);

    var testObj = {
        test: 'object published'
    };

    pubsub.subscribe('test', function(resp) {
        t.equal(typeof resp, 'object', 'We subscribed to test event and got object');
    });

    pubsub.subscribe('test', function(resp) {
        t.equal(resp.test, testObj.test, 'The actual response object is the same as published');
    });

    pubsub.publish('test', testObj);

});

test('setup suite for unsubscribe method', function(t) {
    t.plan(1);

    var count = 0;
    var countPlusOne = function() {
        count = count + 1;
    };

    pubsub.subscribe('counter', function() {
        count = ++count;
    });

    pubsub.subscribe('counter', countPlusOne);
    pubsub.unsubscribe('counter', countPlusOne);

    pubsub.publish('counter');

    t.equal(count, 1, 'Count should equal 1 because we only unsubscribed to countPlusOne');
});

test('throw an error if event published is not a string', function(t) {
    t.plan(1);
    t.throws(function() {
        pubsub.publish(1324);
    }, 'Events must be strings');
});

test('throw an error if a subscribed handler is not a function', function(t) {
    t.plan(1);
    t.throws(function() {
        pubsub.subscribe('MyEvent', {
            myEventObj: true
        });
    }, 'Handlers must be functions');
});