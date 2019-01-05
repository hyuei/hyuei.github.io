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
    'js/treegame/treegame.js',
    'js/screens/zidoscreen.js',
    'js/screens/zidovideoscreen.js',
    'js/screens/bootscreen.js',
    'js/screens/preloadscreen.js',
    'js/screens/startscreen.js',
    'js/screens/menuscreen.js',
    'js/screens/gamescreen.js',
    'js/screens/shopgamescreen.js',
    'js/screens/closingscreen.js',
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
                dest: 'js/build/ShopGame_concat.min.js'
            }
        },
        uglify: {
            options: {
                compress: {
                    drop_console: true
                }
            },
            build: {
                src: 'js/build/ShopGame_concat.min.js',
                dest: 'js/build/ShopGame_concat.min.js'
            }
        },
        clean: ['../mirror-demo-server/public/games/shopgame'],
        copy: {
            main: {
                files: [
                    { expand: true, src: ['assets/**'], dest: 'build/' },
                    { expand: true, src: ['css/**'], dest: 'build/' },
                    { expand: true, src: ['js/build/ShopGame_concat.min.js'], dest: 'build/' },
                    {
                        expand: true, src: ['index_build_template.html'], dest: 'build/',
                        rename: function (dest, src) {
                            return dest + 'index.html';
                        }
                    },
                    { expand: true, cwd: 'build', src: ['**'], dest: '../mirror-demo-server/public/games/shopgame' }
                ]
            }
        }

    });

    // 3. Specify to Grunt we plan to use this plug-in
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify-es');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');

    // 4. Sepcify Grunt tasks to run (what will occur when you type "grunt" command)
    grunt.registerTask('default', ['concat', 'uglify', 'clean', 'copy']);
    // grunt.registerTask('default', ['concat', 'clean', 'copy']);

}