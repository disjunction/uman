/*jslint node: true, jasmine: true */
"use strict";

var Group = require('entity/Group');

describe('entity/Group', function(){
    it('create with name', function() {
        var group = new Group('Mozilla');
        expect(group.name).toBe('Mozilla');
    });
});
