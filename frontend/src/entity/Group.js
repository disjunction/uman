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
