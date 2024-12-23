/**@type {import("../typings/phaser")} */
import { GameState, LEVELS } from "./GameState.js";
import { eventEmitter } from "../events/EventEmitter.js";
import { ui } from "../ui.js";
import { Player } from "../entities/Player.js";


export class TransitionToPlayScene extends GameState{
    constructor(config){
        super("TransitionToPlayScene", config);
        this.config = config;
 
    }
    
    enter(){
        this.hideAllScreens();
        this.show(this.playSceneCurtain, "grid");
    } 
    
    preload(){
        this.enter();

        //added 1 new file
        this.load.on("addfile", ()=>{
            this.registry.inc("assetsTotal", 1);
        });

        this.loadingText = this.add.text(0,0, "", { font: "42px myOtherFont"})
                .setInteractive()
                .setOrigin(0)
                .setStyle({fill: 'brown'})
        this.loadingText.setPosition(this.config.width/2 - this.loadingText.width/2, this.config.height/2 - this.loadingText.height/2);
        
        //while files are still being added...
        this.load.on("progress", (progress)=>{
            this.loadingText.setText(Math.floor(progress*this.registry.get("assetsTotal")) + " of " + this.registry.get("assetsTotal") + " assets loaded..." );
            this.loadingText.setPosition(this.config.width/2 - this.loadingText.width/2, this.config.height/2 - this.loadingText.height/2);
            
           ui.transitionToPlayMessage.innerText = this.loadingText.text;
        });
        
        //when file adding is done...
        this.load.on("complete", ()=>{
            eventEmitter.emit("TRANSITIONTOPLAY_PLAY"); 
            addEventListener("mouseup", ()=>{
                //eventEmitter.emit("TRANSITIONTOPLAY_PLAY");
            })
        })
        eventEmitter.once("TRANSITIONTOPLAY_PLAY", ()=>{
            this.scene.start("PlayScene");
        })
        
        this.loadBG();
        this.loadTilemaps();
        this.loadTilesets();

    }

    loadBG(){
        this.setCurrentScene();
        const bgLength = 7;
        for(let i = bgLength; i >= 1; --i){
            const key = 0+""+i;
            if(this.textures.exists(key) ){
                this.registry.inc("assetsTotal", -1); 
                this.textures.removeKey(key);
            }
        }
        this.load.image("01", "assets/backgrounds/" + LEVELS[this.currentLevel].name + "/1.png");
        this.load.image("02", "assets/backgrounds/" + LEVELS[this.currentLevel].name + "/2.png");
        this.load.image("03", "assets/backgrounds/" + LEVELS[this.currentLevel].name + "/3.png");
        this.load.image("04", "assets/backgrounds/" + LEVELS[this.currentLevel].name + "/4.png");
        this.load.image("05", "assets/backgrounds/" + LEVELS[this.currentLevel].name + "/5.png");
        this.load.image("06", "assets/backgrounds/" + LEVELS[this.currentLevel].name + "/6.png");
        this.load.image("07", "assets/backgrounds/" + LEVELS[this.currentLevel].name + "/7.png");

    } 
    
    loadTilemaps(){
        this.setCurrentScene();
        this.load.tilemapTiledJSON("map"+this.currentLevel+this.currentScene, "assets/json/" + LEVELS[this.currentLevel].name + "0" + this.currentScene + ".json");
    }
    
    loadTilesets(){
        this.load.image("Tileset"+this.currentLevel, "assets/tilesets/" + LEVELS[this.currentLevel].name + ".png");
    }
    
}