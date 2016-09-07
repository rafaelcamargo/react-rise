module.exports = function(grunt) {

  var src = {
    libs: {
      path: 'node_modules/',
      files: 'node_modules/**/*.min.js'
    },
    scripts: {
      path: 'src/jsx/',
      files: 'src/jsx/**/*.jsx'
    },
    styles: {
      path: 'src/styl/',
      files: 'src/styl/**/*.styl'
    }
  };

  var dist = {
    libs: {
      styles: {
        path: 'dist/css/libs/',
        file: 'dist/css/libs/libs.min.css'
      },
      scripts: {
        path: 'dist/js/libs/',
        file: 'dist/js/libs/libs.min.js'
      }
    },
    app: {
      scripts: {
        path: 'dist/js/app/',
        file: 'dist/js/app/app.min.js'
      },
      styles: {
        path: 'dist/css/',
        file: 'dist/css/app.min.css'
      }
    }
  };

  var config = {
    files: [
      'package.json',
      'gruntfile.js',
    ]
  };

  grunt.initConfig({

    stylus: {
      compile: {
        files: {
          'dist/css/app.min.css': src.styles.files
        }
      }
    },

    cssmin: {
      target: {
        files: {
          'dist/css/app.min.css': dist.app.styles.file,
          'dist/css/libs.min.css': dist.libs.styles.file
        }
      }
    },

    // copy :{
    //   lib: {
    //     files: [
    //       {
    //         expand: true,
    //         flatten: true,
    //         cwd: src.libs.path,
    //         src: [
    //           'jquery/dist/jquery.min.js',
    //           'jquery/dist/jquery.min.map'
    //         ],
    //         dest: dist.libs.path
    //       }
    //     ],
    //   }
    // },

    uglify: {
      options: {
        mangle: false
      },
      libScripts: {
        files: {
          'dist/js/libs/libs.min.js': dist.libs.scripts.file
        }
      },
      app: {
        files : {
          'dist/js/app.min.js' : dist.app.scripts.file
        }
      }
    },

    concat_in_order: {
      dist : {
        files : {
          'dist/js/app.min.js' : dist.app.scripts.file
        }
      },
      libStyles : {
        files : {
          'dist/css/lib.min.css': [
            src.libs.path + 'ggrid/dist/ggrid.min.css'
          ]
        }
      }
      // libScripts: {
      //   files : {
      //     'dist/js/lib.min.js': [
      //       src.libs.path + 'react/dist/react.min.js',
      //       src.libs.path + 'react-dom/dist/react-dom.min.js'
      //     ]
      //   }
      // }
    },

    browserify: {
      dist: {
        files: {
          'dist/js/libs/libs.min.js': [
            src.libs.path + 'react/dist/react.min.js',
            src.libs.path + 'react-dom/dist/react-dom.min.js',
            src.libs.path + 'react-router/umd/ReactRouter.min.js'
          ]
        }
        // options: {
        //   transform: ['coffeeify']
        // }
      }
    },

    babel: {
      options: {
        plugins: ['transform-react-jsx'],
        presets: ['es2015', 'react']
      },
      jsx: {
        files: [{
          expand: true,
          cwd: src.scripts.path,
          src: '*.jsx',
          dest: dist.app.scripts.path,
          ext: '.js'
        }]
      }
    },

    jshint: {
      conf: config.files,
      dist: src.scripts.files
    },

    // karma: {
    //   unit: {
    //     configFile: 'karma.conf.js'
    //   }
    // },

    watch: {
      styles: {
        files: src.styles.files,
        tasks: ['stylus']
      },
      dist: {
        files: src.scripts.files,
        tasks: [
          'jshint:dist',
          'concat_in_order:dist'
        ]
      },
      lib: {
        files: src.libs.files,
        tasks: [
          'concat_in_order:libStyles',
          'concat_in_order:libScripts'
        ]
      },
      conf: {
        files: config.files,
        tasks: ['jshint:conf']
      }
    },

    'http-server': {
      dev: {
        port: 9000,
        host: '0.0.0.0',
        showDir : true,
        autoIndex: true,
        ext: 'html',
        runInBackground: true
      }
    }

  });

  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-concat-in-order');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-http-server');
  grunt.loadNpmTasks('grunt-karma');

  grunt.registerTask('build', [
    'stylus',
    // 'copy',
    'browserify',
    'babel',
    'concat_in_order',
    'uglify:libScripts',
    // 'jshint'
    // 'karma'
  ]);

  grunt.registerTask('start', [
    'build',
    'http-server',
    'watch'
  ]);

  grunt.registerTask('deploy', [
    'build',
    'cssmin',
    'uglify:modules',
    'exec:deploy'
  ]);

};
