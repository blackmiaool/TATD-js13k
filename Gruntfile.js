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
                    'build/index.html': 'build/index.html'
                }
            }
        },
        zip: {
            'using-delate': {
                src: 'build/index.html',
                dest: 'TATD.zip',
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
        fixturesPath: ".",
        htmlbuild: {
            dist: {
                src: 'index.html',
                dest: 'build/index.html',
                options: {
                    relative: true,
                    scripts: {
                        bundle:'<%= fixturesPath %>/build/script.js',
                    },
                    styles: {
                        bundle:'<%= fixturesPath %>/build/style.css',
                    },
                }
            }
        },
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-zip');
    grunt.loadNpmTasks('grunt-html-build');

    grunt.registerTask('default', ['uglify','cssmin','htmlbuild','htmlmin','zip']);


};
