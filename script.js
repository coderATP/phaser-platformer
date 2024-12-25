/**@type {import("../typings/phaser")} */
/**@type {import("../typings/matter") }*/

import { Game } from "./game.js";
import { PreloadScene } from "./src/scenes/PreloadScene.js";
import { MenuScene } from "./src/scenes/MenuScene.js";
import { LevelSelectScene } from "./src/scenes/LevelSelectScene.js";
import { TransitionToPlayScene } from "./src/scenes/TransitionToPlayScene.js";
import { PlayScene } from "./src/scenes/PlayScene.js";


const play_fullscreenBtn = document.getElementById("play_fullscreenBtn");
play_fullscreenBtn.addEventListener('click', toggleFullscreen);
function toggleFullscreen(){
        if(!document.fullscreenElement){
            document.documentElement.requestFullscreen();
        }else if(document.exitFullscreen){
            document.exitFullscreen();
        }
    }
    
    
const GAME_WIDTH = 1024;
const GAME_HEIGHT = 576;

const MAP_WIDTH = 1600
const MAP_HEIGHT = 600;

const ZOOM_FACTOR = 1.5;

const SHARED_CONFIG = {
    width: GAME_WIDTH, 
    height: GAME_HEIGHT,
    offsetX: MAP_WIDTH - GAME_WIDTH,
    offsetY: MAP_HEIGHT - GAME_HEIGHT,
    topLeft: {
        x: ( GAME_WIDTH - (GAME_WIDTH/ZOOM_FACTOR) ) / 2,
        y: ( GAME_HEIGHT - (GAME_HEIGHT/ZOOM_FACTOR) ) / 2,
    },
    topRight: {
        x: ( ( GAME_WIDTH - (GAME_WIDTH/ZOOM_FACTOR) ) / 2 ) + (GAME_WIDTH/ZOOM_FACTOR),
        y: ( GAME_HEIGHT - (GAME_HEIGHT/ZOOM_FACTOR) ) / 2,
    },
    bottomRight: {
        x: ( ( GAME_WIDTH - (GAME_WIDTH/ZOOM_FACTOR) ) / 2 ) + (GAME_WIDTH/ZOOM_FACTOR),
        y: ( (GAME_HEIGHT - (GAME_HEIGHT/ZOOM_FACTOR) ) / 2 ) + (GAME_HEIGHT/ZOOM_FACTOR),
    },
    debug: true
};

const config= {
    type: Phaser.AUTO,
    ...SHARED_CONFIG, 
    parent: "gameWrapper",
    scale: {
         mode: Phaser.Scale.Fit,
         //autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    pixelArt: true, 
    physics:{
        default: 'arcade',
        arcade:{
            debug: SHARED_CONFIG.debug,
        },
        matter:{
            debug: SHARED_CONFIG.debug,
        },

    },
    scene: [ new PreloadScene(SHARED_CONFIG), new MenuScene(SHARED_CONFIG), new LevelSelectScene(SHARED_CONFIG), new TransitionToPlayScene(SHARED_CONFIG), new PlayScene(SHARED_CONFIG)],
};

const game = new Phaser.Game(config);




