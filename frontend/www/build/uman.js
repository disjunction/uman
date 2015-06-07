(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*jslint node: true */
"use strict";

function Group(name) {
    if (typeof name != 'string' || !name) {
        throw new Error('Group must have a non-empty name');
    }
    this.name = name;
    this.name = this.name.replace(/\//g, '.');
    this.memberCount = 0;
}

var _p = Group.prototype;

_p.getId = function() {
    return this.name;
};

_p.serialize = function() {
    return {
        name: this.name,
    };
};

Group.unserialize = function(object) {
    var group = new Group(object.name);
    if (object.memberCount !== undefined) {
        group.memberCount = parseInt(object.memberCount);
    }
    return group;
};

module.exports = Group;

},{}],2:[function(require,module,exports){
/*jslint node: true */
"use strict";

function User(name, login) {
    if (typeof name != 'string' || !name) {
        throw new Error('User must have a non-empty name');
    }
    this.name = name;
    this.login = login || name.replace(/ /g, '.').toLowerCase();
    this.login = this.login.replace(/[\s\/]/g, '.').toLowerCase();
    this.groupIds = [];
}

var _p = User.prototype;

_p.getId = function(callback) {
    return this.login;
};

_p.serialize = function() {
    return {
        name: this.name,
        login: this.login,
        groupIds: this.groupIds
    };
};

User.unserialize = function(object) {
    var user = new User(object.name, object.login);
    if (Array.isArray(object.groupIds)) {
        user.groupIds = object.groupIds;
    }
    return user;
};

module.exports = User;

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
/*jslint node: true */
"use strict";

var LocalAbstractStorage = require('./LocalAbstractStorage');

function LocalGroupStorage(dbName, elementClass, userStorage) {
    LocalAbstractStorage.call(this, dbName, elementClass);
    this.userStorage = userStorage;
    var self = this;

    /**
     * updates memberCount on call
     * @param  {Function(Array.<uman.entity.Group>)} callback
     */
    this.getAll = function(callback) {
        var groups = LocalAbstractStorage.prototype.getAll.call(this, function(groups) {
            groups.map(function(group){
                group.memberCount = 0;
            });

            var users = userStorage.toArray();
            users.map(function(user) {
                user.groupIds.map(function(groupId){
                    if (self.elementMap[groupId] === undefined) {
                        throw new Error('user ' + user.name + ' belongs to a non-existent group ' + groupId);
                    }
                    self.elementMap[groupId].memberCount++;
                });
            });

            callback(groups);
        });
    };

    /**
     * same as in abstract, just with validation
     * @param  {uman.entity.Group}   element
     * @param  {Function(element)} callback
     */
    this.remove = function(element, callback) {
        if (element.memberCount > 0) {
            throw new Error('cannot delete group containing users');
        }
        LocalAbstractStorage.prototype.remove.call(this, element, callback);
    };
}

LocalGroupStorage.prototype = LocalAbstractStorage.prototype;

module.exports = LocalGroupStorage;

},{"./LocalAbstractStorage":3}],5:[function(require,module,exports){
/*jslint node: true */
"use strict";

var LocalAbstractStorage = require('./LocalAbstractStorage');

function LocalUserStorage(dbName, elementClass) {
    LocalAbstractStorage.call(this, dbName, elementClass);
}

LocalUserStorage.prototype = LocalAbstractStorage.prototype;

module.exports = LocalUserStorage;

},{"./LocalAbstractStorage":3}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
// export "uman" namespace globally
uman = {
    entity: {
        Group: require('entity/Group'),
        User: require('entity/User')
    },
    storage: {
        LocalUserStorage: require('storage/LocalUserStorage'),
        LocalGroupStorage: require('storage/LocalGroupStorage'),
        RemoteStorage: require('storage/RemoteStorage')
    }
};

},{"entity/Group":1,"entity/User":2,"storage/LocalGroupStorage":4,"storage/LocalUserStorage":5,"storage/RemoteStorage":6}]},{},[7]);
