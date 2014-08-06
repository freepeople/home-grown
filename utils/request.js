'use strict';
// Forked from https://github.com/krasimir/absurd
// Refactored to support only modern browsers and IE9+

// Helper methods
// underscore prefix represents private methods
var _hasOwn = function(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
};
var _getParams = function(data, url) {
    var arr = [];
    var str;
    for (var name in data) {
        if (_hasOwn(data, name)) {
            arr.push(name + '=' + encodeURIComponent(data[name]));
        }
    }
    str = arr.join('&');
    if (str !== '') {
        return url ? (url.indexOf('?') < 0 ? '?' + str : '&' + str) : str;
    }
    return '';
};
var _setHeaders = function(headers) {
    for (var name in headers) {
        if (_hasOwn(headers, name)) {
            return this.xhr && this.xhr.setRequestHeader(name, headers[name]);
        }
    }
};
/**
 * Constructor for MicroRequest
 * sets up config and runs the process method
 * when a new instance is created
 * @param {Object} config [pass in criteria to xhr]
 */
var MicroRequest = function(config) {
    if (typeof config !== 'object') throw new TypeError('"' + config + '" Must be an object');
    this.config = {
        url: config.url || '',
        type: config.type || 'get',
        data: config.data || {},
        headers: config.headers || '',
        json: config.json || false
    };
    this.process();
};
var MicroRequestProto = MicroRequest.prototype;

/**
 * Process method is the meat and potatoes
 * handles the xhr request and funnels the appropriate responses
 * @return {Object} [the object itself meant for chaining methods]
 */
MicroRequestProto.process = function() {
    var self = this;
    self.xhr = new XMLHttpRequest();
    self.xhr.onload = function() {
        var result;
        var error;
        var status = self.xhr.status;
        var statusText = self.xhr.statusText;
        if (status >= 200 && status < 300 || status === 304) {
            result = self.xhr.responseText;
            if (self.config.json === true) {
                result = JSON.parse(result);
            }
            self.doneCallback && self.doneCallback(result, self.xhr, statusText);
        } else {
            error = self.xhr.response;
            self.failCallback && self.failCallback(error, self.xhr, statusText);
        }
        return self.alwaysCallback && self.alwaysCallback(statusText);

    };

    this.xhr.onerror = function() {
        throw new Error('Can\'t Connect');
    };

    if (this.config.type === 'get' || this.config.type === 'GET') {
        this.xhr.open("GET", this.config.url +
            _getParams.call(this, this.config.data, this.config.url), true);
        this.xhr.send();
    } else {
        this.xhr.open(this.config.type, this.config.url, true);
        _setHeaders.call(this, {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-type': 'application/x-www-form-urlencoded'
        });
        this.xhr.send(_getParams.call(this, this.config.data));
    }
    if (this.config.headers && typeof this.config.headers === 'object') {
        _setHeaders.call(this, this.config.headers);
    }

    return this;
};
/**
 * Done method gets called when xhr has
 * been processed successfully.
 * @param  {Function} callback [returns data, xhr, and status]
 * @return {Object}          [returns the object for chaining]
 */
MicroRequestProto.done = function(callback) {
    this.doneCallback = callback;
    return this;
};
/**
 * Fail occurs when the xhr responds with an
 * error such as a 404 or similar
 * @param  {Function} callback [returns error, xhr, and status]
 * @return {Object}            [returns the object for chaining]
 */
MicroRequestProto.fail = function(callback) {
    this.failCallback = callback;
    return this;
};

/**
 * Always method happens regardless or xhr responses
 * so with that, you can do something on success(done)
 * or on fail
 * @param  {Function} callback [returns status]
 * @return {[type]}            [returns the object for chaining]
 */
MicroRequestProto.always = function(callback) {
    this.alwaysCallback = callback;
    return this;
};

module.exports = MicroRequest;