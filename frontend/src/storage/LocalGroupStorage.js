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
