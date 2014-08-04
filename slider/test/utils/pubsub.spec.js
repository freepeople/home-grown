'use strict';
var pubsub = require('../../src/utils/pubsub');
var test = require('tape');

test('check that can publish and subscribe', function(t) {
    t.plan(2);

    var testObj = {
        test: 'object published'
    };

    setTimeout(function() {
        pubsub.publish('test', testObj);
    }, 1000);

    pubsub.subscribe('test', function(resp) {
        t.equal(typeof resp, 'object');
    });

    pubsub.subscribe('test', function(resp) {
        t.equal(resp.test, testObj.test);
    });


});