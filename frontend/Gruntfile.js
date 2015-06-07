/*jslint node: true */
"use strict";

module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-env');
    grunt.initConfig({
        env: {
            dev: {
                NODE_PATH: 'src'
            }
        },
        shell: {
            browserify: {
                command: "node_modules/.bin/browserify --ignore-missing --sourceMapRelative src src/* -o www/build/uman.js"
            },
            jasmine: {
                command: 'node_modules/.bin/jasmine-node specs/*Spec.js'
            },
            'jasmine-verbose': {
                command: 'node_modules/.bin/jasmine-node --verbose specs/*Spec.js'
            },
        },
        watch: {
            files: ['src/**', 'specs/**'],
            tasks: ['env:dev', 'shell:browserify', 'shell:jasmine'],
            options: {
              spawn: false,
            }
        }
    });
    grunt.registerTask('browserify', ['env:dev', 'shell:browserify']);
    grunt.registerTask('jasmine', ['env:dev', 'shell:jasmine']);
    grunt.registerTask('jasmine-verbose', ['env:dev', 'shell:jasmine-verbose']);
};
