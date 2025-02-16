/**@type {import("../typings/phaser")} */
/**@type {import("../typings/matter") }*/


import { PreloadScene } from "./scenes/PreloadScene.js";
import { MenuScene } from "./scenes/MenuScene.js";
import { LevelSelectScene } from "./scenes/LevelSelectScene.js";
import { TransitionToPlayScene } from "./scenes/TransitionToPlayScene.js";
import { PlayScene } from "./scenes/PlayScene.js";
import { LevelCompleteScene} from "./scenes/LevelCompleteScene.js";
import { OptionsScene} from "./scenes/OptionsScene.js";


const play_fullscreenBtn = document.getElementById("play_fullscreenBtn");
play_fullscreenBtn.addEventListener('click', toggleFullscreen);
function toggleFullscreen(){
        if(!document.fullscreenElement){
            document.documentElement.requestFullscreen();
            screen.orientation.lock("landscape");
        }else if(document.exitFullscreen){
            document.exitFullscreen();
        }
    }
    
    
const GAME_WIDTH = 1024;
const GAME_HEIGHT = 576;
const ZOOM_FACTOR = 3.5;

const SHARED_CONFIG = {
    width: GAME_WIDTH, 
    height: GAME_HEIGHT,
    zoomFactor: ZOOM_FACTOR,
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
    debug: false 
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
    scene: [ new PreloadScene(SHARED_CONFIG),
        new MenuScene(SHARED_CONFIG),
        new LevelSelectScene(SHARED_CONFIG),
        new TransitionToPlayScene(SHARED_CONFIG),
        new PlayScene(SHARED_CONFIG),
        new LevelCompleteScene(SHARED_CONFIG),
        new OptionsScene(SHARED_CONFIG)],
};

const game = new Phaser.Game(config);




