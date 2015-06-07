/*jslint node: true, jasmine: true */
"use strict";

var LocalUserStorage = require('storage/LocalUserStorage'),
    User = require('entity/User');

describe('storage/LocalUserStorage', function(){
    function makeEmpty() {
        return new LocalUserStorage('some', User);
    }

    describe('when getting by id async', function() {
        var storage = makeEmpty(),
            element = new User('John Doe');

        storage.save(element);

        var user;

        beforeEach(function(done) {
            storage.getById('john.doe', function(userParam) {
                user = userParam;
                done();
            });
        });

        it('should have valid user', function() {
            expect(user.name).toBe('John Doe');
        });
    });
});
