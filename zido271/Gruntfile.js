var files = [
    'js/phaser.js',
    'js/plugins/phaser-nineslice.min.js',
    'js/plugins/fontfaceobserver.min.js',
    'js/plugins/phaser-fade.js',
    'js/zido-game-plugin.min.js',
    'js/plugins/phaser-state-transition.umd.js',
    'js/ubriframework/transitioncollections.js',
    'js/zidoconnect.js',
    'js/ubriframework/imageassetsdata.js',
    'js/ubriframework/audioassetsdata.js',
    'js/ubriframework/custompointer.js',
    'js/ubriframework/cusrand.js',
    'js/gameimageassets.js',
    'js/gameaudioassets.js',
    'js/talkingdata.js',
    'js/stringsdata.js',
    'js/talker/talker.js',
    'js/endgameoverlay.js',
    'js/trashgame/ScoreUI.js',
    'js/trashgame/TimerUI.js',
    'js/popgame/PopGameView.js',
    'js/popgame/PopGame.js',
    'js/popgame/PopItem.js',
    'js/popgame/PopBoard.js',
    'js/screens/zidoscreen.js',
    'js/screens/zidovideoscreen.js',
    'js/screens/bootscreen.js',
    'js/screens/preloadscreen.js',
    'js/screens/startscreen.js',
    'js/screens/menuscreen.js',
    'js/screens/gamescreen.js',
    'js/screens/closingscreen.js',
    'js/screens/PopGameScreen.js',
    'js/main.js',
    'js/avatar.js'
];

module.exports = function (grunt) {

    // 1. Grunt configuration goes here
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            // 2. parameters for the "concat" task to follow here:
            dist: {
                src: files,
                dest: 'js/build/PopGame_concat.min.js'
            }
        },
        uglify: {
            options: {
                compress: {
                    drop_console: true
                }
            },
            build: {
                src: 'js/build/PopGame_concat.min.js',
                dest: 'js/build/PopGame_concat.min.js'
            }
        },
        clean: ['../mirror-demo-server/public/games/popgame', 'build'],
        copy: {
            main: {
                nonull: true,
                files: [
                    { expand: true, src: ['assets/**'], dest: 'build/' },
                    { expand: true, src: ['css/**'], dest: 'build/' },
                    { expand: true, src: ['js/build/PopGame_concat.min.js'], dest: 'build/' },
                    {
                        expand: true, src: ['index_build_template.html'], dest: 'build/',
                        rename: function (dest, src) {
                            return dest + 'index.html';
                        }
                    }
                ]
            },
            folder: {
                nonull: true,
                files: [
                    { expand: true, cwd: 'build', src: ['**'], dest: '../mirror-demo-server/public/games/popgame' }
                ]
            }
        }

    });

    // 3. Specify to Grunt we plan to use this plug-in
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify-es');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // 4. Sepcify Grunt tasks to run (what will occur when you type "grunt" command)
    grunt.registerTask('default', ['clean', 'concat', 'uglify', 'copy', 'copy:folder']);
    // grunt.registerTask('default', ['concat', 'clean', 'copy']);

}