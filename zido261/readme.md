# Packaging
## Installation

1. Install npm (https://www.npmjs.com/get-npm)
2. Run `npm install`
3. install grunt
    ```
    npm install -g grunt
    ```
4. install grunt-cli
    ```
    npm install -g grunt-cli
    ```
5. install grunt-contrib concat
    ```
    npm install grunt-contrib-concat --save-dev
    ```
6. install grunt-contrib-uglify-es
    ```
    npm install grunt-contrib-uglify-es --save-dev
    ```
7. install grunt-contrib-copy
    ```
    npm install grunt-contrib-copy --save-dev
    ```

## Usage
1. Make a folder name `build`
2. Run grunt
    ```
    grunt
    ```
3. Processed files will be placed at `build`. Copy them all to server

## Notes
unmodified files can be found at `js/` folder

## How to used

1. Jumping to startscreen after preloadscreen
2. change game1screen with your game (some time it call another class game logic)