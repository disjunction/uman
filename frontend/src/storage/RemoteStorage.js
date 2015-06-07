/*jslint node: true */
"use strict";

/**
 * REST Uman API client providing Storage interface (same as Local***Storge)
 *
 * By coincidence Users and Groups API is so similar, that this class can serve both,
 * the only difference is the elementClass and endpoint
 *
 * @param {Function} jQuery       [injected jQuery function, to keep node.js complience]
 * @param {string} endpoint       [e.g. http://localhost:8000/users]
 * @param {Function} elementClass [entity class, needed for corect unserialization]
 */
function RemoteStorage(jQuery, endpoint, elementClass) {
    this.$ = jQuery;
    this.endpoint = endpoint;
    this.elementClass = elementClass;
}

var _p = RemoteStorage.prototype;

_p.getAll = function(callback) {
    this.$.getJSON(this.endpoint, null, function(data) {
        if (Array.isArray(data)) {
            var result = [];
            data.map(function(object) {
                result.push(this.elementClass.unserialize(object));
            }.bind(this));
            callback(result);
        } else if (data === false) {
            callback([]);
        } else {
            throw new Error('unexpected response from ' + this.endpoint);
        }
    }.bind(this));
};

_p.getById = function(id, callback) {
    this.$.getJSON(this.endpoint + '/' + encodeURIComponent(id), null, function(data) {
        callback(this.elementClass.unserialize(data));
    }.bind(this));
};

_p.save = function(element, callback) {
    var params = JSON.stringify(element.serialize());
    this.$.post(this.endpoint, params, function() {
        if (callback) {
            callback();
        }
    });
};

_p.remove = function(element, callback) {
    this.$.ajax({
        url: this.endpoint + '/' + encodeURIComponent(element.getId()),
        type: 'DELETE',
        success: function() {
            if (callback) {
                callback();
            }
        }
    });
};

module.exports = RemoteStorage;
