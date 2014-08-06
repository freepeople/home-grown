'use strict';
var test = require('tape');
var Request = require('utils/request');

test('XHR using GET was successful', function(t) {
    new Request({
        url: window.location.href,
        type: 'GET'
    })
        .done(function(data) {
            t.ok(data, 'got the request');
            t.end();
        });
});

test('XHR using GET failed', function(t) {
    new Request({
        url: 'example.com',
        type: 'GET'
    })
        .fail(function(err, xhr) {
            t.throws(err, 'could not get request: ' + xhr.status);
            t.end();
        });
});

test('XHR using GET always callback', function(t) {
    t.plan(2);
    new Request({
        url: window.location.href,
        type: 'GET'
    })
        .always(function(status) {
            t.ok(status, 'I always appear no matter what: ' + status);
        });

    new Request({
        url: 'example.com',
        type: 'GET'
    })
        .always(function(status) {
            t.ok(status, 'I always appear no matter what: ' + status);
        });
});