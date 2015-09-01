module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'script.js',
                dest: 'build/script.js'
            }
        },
        htmlmin: { // Task
            dist: { // Target
                options: { // Target options
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: { // Dictionary of files
                    'build/index.html': 'index.html'
                }
            }
        },
        zip: {
            'using-delate': {
                src: ['build/index.html', 'build/script.js', 'build/style.css'],
                dest: 'build/files.zip',
                compression: 'DEFLATE'
            },
        },
        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            target: {
                files: {
                    'build/style.css': ['style.css']
                }
            }
        },
        useminPrepare: {
            html: 'index.html',
            options: {
                dest: 'build'
            }
        },
        usemin: {
            html: 'build/index.html',
            options: {
                
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-zip');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-filerev');
grunt.loadNpmTasks('grunt-html-build');
    //    grunt.loadNpmTasks('grunt-contrib-filerev');

    grunt.registerTask('build', [
      'useminPrepare',
      'concat:generated',
      'cssmin:generated',
      'uglify:generated',
//      'filerev',
      'usemin'
    ]);
    //    grunt.registerTask('default', ['uglify', 'htmlmin', 'cssmin', 'zip','useminPrepare']);
    grunt.registerTask('default', ['build']);


};
