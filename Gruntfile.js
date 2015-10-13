module.exports = function(grunt) {

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Automatically load required grunt tasks
    require('jit-grunt')(grunt);

    grunt.initConfig({
        eslint: {
            target: ['library/*.js']
        },
        watch: {
            js: {
                files: ['<%= eslint.target %>'],
                tasks: ['eslint']
            },
        }
    });

    grunt.registerTask('watch', ['watch']);

    grunt.registerTask('default', ['newer:eslint']);
};
