module.exports = function(grunt) {
  grunt.initConfig({
    copy: {
      emoji: {
        expand: true,
        flatten: true,
        src: 'node_modules/emojify.js/dist/images/basic/*',
        dest: 'dist/images/emoji/',
        filter: 'isFile'
      },
      css: {
        expand: true,
        flatten: true,
        src: 'src/css/*',
        dest: 'dist/css/',
        filter: 'isFile'
      },
      images: {
        expand: true,
        flatten: true,
        src: 'src/images/*',
        dest: 'dist/images/',
        filter: 'isFile'
      },
    },
    concat: {
      dist: {
        src: ['src/js/main.js','src/js/modal.js'],
        dest: 'dist/js/build.js',
      }
    },
    uglify: {
      dist: {
        files: {
          'dist/js/build.min.js': ['dist/js/build.js']
        }
      }
    },
    clean: {
      dist: ['dist/'],
      build: ['dist/js/build.js']
    }
});
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('build', ['clean', 'copy', 'concat', 'uglify', 'clean:build']);
};
