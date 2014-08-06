'use strict';

var test = require('tape');
var Request = require('utils/request');
var req = new Request({
    url: '/echo/html',
    method: 'GET'
});

test('test out the request call', function(t) {
    t.ok(req);
});