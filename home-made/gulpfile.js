'use strict';

var fs = require('fs');
var dir = './slider/tasks/';
var tasks = fs.readdirSync(dir);

tasks.forEach(function(task) {
    require(dir + task);
});