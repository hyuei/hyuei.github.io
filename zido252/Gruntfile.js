var files= [
    'js/phaser.js',
    'js/core/init.js',

    'js/plugins/phaser-nineslice.min.js',
    'js/plugins/fontfaceobserver.min.js',
    'js/plugins/phaser-fade.js',

    'js/plugins/phaser-state-transition.umd.js',
    'js/ubriframework/transitioncollections.js',
    'js/lz-string.min.js',
    'js/ubriframework/custom-storage.js',
    'js/zidoconnect.js',
    'js/ubriframework/imageassetsdata.js',
    'js/ubriframework/audioassetsdata.js',
    'js/ubriframework/statescreenmanager.js',
    'js/ubriframework/custompointer.js',
    'js/zido-game-plugin.min.js',

    'js/plugins/fontdetect.min.js',
    'js/assets-reader.js',
    'js/gameimageassets.js',
    'js/gameaudioassets.js',
    'js/talkingdata.js',
    'js/stringsdata.js',

    'js/talker/talker.js',

    'js/components/transition.js',
    'js/components/basestate.js',
    'js/screens/zidoscreen.js',
    'js/screens/zidovideoscreen.js',
    'js/screens/gamescreen.js',
    'js/screens/bootscreen.js',
    'js/screens/preloadscreen.js',
    'js/screens/startscreen.js',
    'js/screens/game1screen.js',

    'js/objects/correct-burst.js',
    'js/objects/chara.js',
    'js/objects/endscreen.js',
    'js/objects/click-btn.js',
    'js/objects/ground-group.js',
    'js/objects/runner.js',
    'js/objects/scoreboard.js',
    
    'js/main.js'
];

module.exports = function(grunt) {

    // 1. Grunt configuration goes here
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            // 2. parameters for the "concat" task to follow here:
            dist: {
                src: files,
                dest: 'js/build/BuildGame_concat.min.js'
            }
        },
        uglify: {
            options: {
                compress: {
                    drop_console: true
                }
            },
            build: {
                src: 'js/build/BuildGame_concat.min.js',
                dest: 'js/build/BuildGame_concat.min.js'
            }
        },
        copy: {
            main: {
                files: [
                    {expand: true, src: ['assets/**'], dest:'build/'},
                    {expand: true, src: ['css/**'], dest:'build/'},
                    {expand: true, src: ['js/build/BuildGame_concat.min.js'], dest:'build/'},
                    {expand: true, src: ['index_build_template.html'], dest:'build/',
                        rename: function(dest, src) {
                            return dest + 'index.html';
                        }
                    },
                    {expand: true, cwd: 'build', src: ['**'], dest:'../integration_demo/public/games/branch-collecting'}
                ]
            }
        }

    });

    // 3. Specify to Grunt we plan to use this plug-in
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify-es');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // 4. Sepcify Grunt tasks to run (what will occur when you type "grunt" command)
    grunt.registerTask('default', ['concat', 'uglify', 'copy']);
    // grunt.registerTask('default', ['concat', 'copy']);

}