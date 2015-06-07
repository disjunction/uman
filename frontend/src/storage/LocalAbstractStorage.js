/*jslint node: true */
"use strict";

function LocalAbstractStorage(dbName, elementClass) {
    this.dbName = dbName;
    this.elementClass = elementClass;
    this.elementMap = {};
}

var _p = LocalAbstractStorage.prototype;

_p.getById = function(id, callback) {
    callback(this.elementMap[id] ? this.elementMap[id] : null);
};

_p.getAll = function(callback) {
    callback(this.toArray());
};

_p.toArray = function() {
    var result = [];
    for (var i in this.elementMap) {
        result.push(this.elementMap[i]);
    }
    return result;
};

_p.remove = function(element, callback) {
    delete this.elementMap[element.getId()];
    if (callback) {
        callback(element);
    }
};

_p.save = function(element) {
    this.elementMap[element.getId()] = element;
};

module.exports = LocalAbstractStorage;
