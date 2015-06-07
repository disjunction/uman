/*jslint node: true */
"use strict";

var LocalAbstractStorage = require('./LocalAbstractStorage');

function LocalUserStorage(dbName, elementClass) {
    LocalAbstractStorage.call(this, dbName, elementClass);
}

LocalUserStorage.prototype = LocalAbstractStorage.prototype;

module.exports = LocalUserStorage;
