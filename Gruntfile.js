module.exports = function(grunt) {

    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      uglify: {
        build: {
          files: {
            'dest/game.min.js': ['game/lib/phaser.js','game/lib/particle-storm.js',
            'game/lib/slick-ui.min.js','game/js/Main.js','game/js/Enemy.js','game/js/Weapon.js',
            'game/js/Level2.js']
          }
        }
      }
    });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['uglify']);

};