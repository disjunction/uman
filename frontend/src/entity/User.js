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
