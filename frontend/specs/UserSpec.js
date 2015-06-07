/*jslint node: true, jasmine: true */
"use strict";

var User = require('entity/User');

describe('entity/User', function(){
    it('create with name', function() {
        var user = new User('Brendan Eich');
        expect(user.name).toBe('Brendan Eich');
        expect(user.login).toBe('brendan.eich');
    });

    it('create with name and login', function() {
        var user = new User('Brendan Eich', 'beich');
        expect(user.name).toBe('Brendan Eich');
        expect(user.login).toBe('beich');
    });

    it('bad name', function() {
        expect(function() {
            new User();
        }).toThrow();
    });

    it('serializes', function() {
        var user = new User('Brendan Eich', 'beich');
        user.groupIds.push('some');
        var object = user.serialize();
        expect(object.name).toBe('Brendan Eich');
        expect(object.login).toBe('beich');
        expect(object.groupIds).toEqual(['some']);
    });

    it('unserializes', function() {
        var object = {
            name: 'Ryan Dahl',
            login: 'rdahl',
            groupIds: ['gr1', 'gr2']
        };
        var user = User.unserialize(object);
        expect(user.name).toBe('Ryan Dahl');
        expect(user.login).toBe('rdahl');
        expect(user.groupIds).toEqual(['gr1', 'gr2']);
    });
});
