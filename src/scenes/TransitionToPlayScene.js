/**@type {import("../typings/phaser")} */
import { BaseScene, LEVELS } from "./BaseScene.js";
import { eventEmitter } from "../events/EventEmitter.js";
import { ui } from "../ui.js";
import { Player } from "../entities/Player.js";
import { audio } from "../audio/AudioControl.js";
 

export class TransitionToPlayScene extends BaseScene{
    constructor(config){
        super("TransitionToPlayScene", config);
        this.config = config;
    }
    
    destroyEvents(){
        eventEmitter.destroy("PLAY_SCENECOMPLETE");
        eventEmitter.destroy("LEVELCOMPLETE_TO_RESTART");
        eventEmitter.destroy("LEVELCOMPLETE_TO_NEXT");
        eventEmitter.destroy("MENU_TO_CONTINUE");
    }
    
    enter(){
        this.destroyEvents();
        this.hideAllScreens();
        this.show(this.playSceneCurtain, "grid");
    }
    
    loadAudio() {
    }
    
    preload(){
        this.enter();
        //when file adding is done...
        this.load.once("complete", ()=>{
            eventEmitter.emit("TRANSITIONTOPLAY_PLAY"); 
        })
        eventEmitter.once("TRANSITIONTOPLAY_PLAY", ()=>{
            this.scene.start("PlayScene");
        })
        
        this.loadBG();
        this.loadTilemaps();
        this.loadTilesets();
        //this.loadAudio();
    }

    loadBG(){
        this.getCurrentScene();
        const bgLength = 2;
        for(let i = 1; i <= bgLength; ++i){
            const key = 0+""+i;
            if(this.textures.exists(key) ){
               this.registry.inc("assetsTotal", -1); 
               this.textures.removeKey(key);
            }
            if(!this.textures.exists(key)){
                this.load.image(key, "assets/backgrounds/" + LEVELS[this.currentLevel].name + "/" + i + ".png");
            }
        }
    } 
    
    loadTilemaps(){
        this.getCurrentScene();
        this.load.tilemapTiledJSON("map"+this.currentLevel+this.currentScene, "assets/json/" + LEVELS[this.currentLevel].name + "0" + this.currentScene + ".json");
    }
    
    loadTilesets(){
        this.load.image("Tileset"+this.currentLevel, "assets/tilesets/" + LEVELS[this.currentLevel].name + "_extruded.png");
    }
    
}