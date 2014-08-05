'use strict';

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
var MicroRequest = function(config) {
    if (typeof config !== 'object') throw new TypeError('"' + config + '" Must be an object');
    this.config = {
        url: config.url || '',
        type: config.type || 'get',
        data: config.data || {},
        headers: config.headers || ''
    };
    this.process();
};

var MicroRequestProto = MicroRequest.prototype;

MicroRequestProto.process = function() {
    this.xhr = new XMLHttpRequest();
    this.xhr.onreadystatechange = function() {
        var result;
        if (this.xhr.readyState === 4) {
            if (this.xhr.status === 200) {
                result = this.xhr.responseText;
                if (this.config.json === true && typeof JSON !== 'undefined') {
                    result = JSON.parse(result);
                }
                return this.doneCallback && this.doneCallback.apply(this, [result, this.xhr]);
            }
            return this.failCallback && this.failCallback.apply(this, [this.xhr]);
        }
        return this.alwaysCallback && this.alwaysCallback.apply(this, [this.xhr]);
    }.bind(this);

    if (this.config.type === 'get') {
        this.xhr.open("GET", this.config.url + _getParams(this.config.data, this.config.url), true);
        this.xhr.send();
    } else {
        this.xhr.open(this.config.type, this.config.url, true);
        _setHeaders.call(this, {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-type': 'application/x-www-form-urlencoded'
        });
        this.xhr.send(_getParams(this.config.data));
    }
    if (this.config.headers && typeof this.config.headers === 'object') {
        _setHeaders.call(this, this.config.headers);
    }

    return this;
};

MicroRequestProto.done = function(callback) {
    this.doneCallback = callback;
    return this;
};

MicroRequestProto.fail = function(callback) {
    this.failCallback = callback;
    return this;
};

MicroRequestProto.always = function(callback) {
    this.alwaysCallback = callback;
    return this;
};
module.exports = MicroRequest;