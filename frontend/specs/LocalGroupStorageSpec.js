/*jslint node: true, jasmine: true */
"use strict";

var LocalGroupStorage = require('storage/LocalGroupStorage'),
    LocalUserStorage = require('storage/LocalUserStorage'),
    User = require('entity/User'),
    Group = require('entity/Group');

describe('storage/LocalGroupStorage', function(){
    var userStorage = new LocalUserStorage('users', User);

    function makeEmpty() {
        return new LocalGroupStorage('some', Group, userStorage);
    }

    describe('when getting by id async', function() {
        var storage = makeEmpty(),
            element = new Group('Some Important');
        storage.save(element);

        var group;

        beforeEach(function(done) {
            storage.getById('Some Important', function(groupParam) {
                group = groupParam;
                done();
            });
        });

        it ('should return a valid user', function() {
            expect(group.name).toBe('Some Important');
        });

    });

    describe('when getAll() is called async', function() {
        var groupStorage = makeEmpty();
        groupStorage.save(new Group('group1'));
        groupStorage.save(new Group('group2'));

        // remove all users
        userStorage.elementMap = {};
        var user = new User('Martin Fowler');
        user.groupIds = ['group1', 'group2'];
        userStorage.save(user);

        var groups;

        beforeEach(function(done) {
            groupStorage.getAll(function(groupsParam) {
                groups = groupsParam;
                done();
            });
        });

        it('should recalculate memberCount', function() {
            expect(groups[0].memberCount).toBe(1);
            expect(groups[1].memberCount).toBe(1);
        });
    });
});
