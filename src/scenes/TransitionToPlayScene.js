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
        this.graphics;
    }
    
    destroyEvents(){
        eventEmitter.destroy("PLAY_SCENECOMPLETE");
        eventEmitter.destroy("LEVELCOMPLETE_TO_RESTART");
        eventEmitter.destroy("LEVELCOMPLETE_TO_NEXT");
        eventEmitter.destroy("MENU_TO_CONTINUE");
    }
    
    enter(){
        this.destroyEvents();
        this.graphics = this.add.graphics({lineWidth: 6})
        this.barWidth = this.config.width*0.95;
        this.barHeight = 4;
        this.padding = 1;
        this.borderRect = new Phaser.Geom.Rectangle(this.config.width/2 - this.barWidth/2, this.config.height - this.barHeight - 80, this.barWidth, this.barHeight);
        this.loadingBar = new Phaser.Geom.Rectangle(this.config.width/2 - this.barWidth/2, this.config.height - this.barHeight - 80 + this.padding/2, this.barWidth, this.barHeight - this.padding);
        this.hideAllScreens();
        //this.show(this.playSceneCurtain, "grid");
    }
    
    loadAudio() {
        this.load.audio("menuSong", "assets/sounds/menu_song.mp3");
        this.load.audio("forestSong", "assets/sounds/forest_song.mp3");
        this.load.audio("ruinsSong", "assets/sounds/ruins_song.mp3");
        this.load.audio("buttonClick", "assets/sounds/button_sound.wav");
        this.load.audio("buttonHover", "assets/sounds/button_hover_sound.wav");
        this.load.audio("coinColected", "assets/sounds/coin_collected.wav");
        this.load.audio("winSong", "assets/sounds/win_song.wav");
    }
    preload(){
        this.enter();
        this.events.on("update", this.update, this);
        this.levelAssets = 0;
        //added 1 new file
        this.load.on("addfile", ()=>{
            this.levelAssets++;
        });

        this.loadingText = this.add.text(0,0, "")
                .setInteractive()
                .setOrigin(0)
        
        //while files are still being added...
        this.load.on("progress", (progress)=>{
            this.loadingText.setText(Math.floor(progress*this.levelAssets) + " of " + this.levelAssets + " assets loading...");
            this.loadingText
                .setPosition(this.config.width/2 - this.loadingText.width/2, this.config.height - this.loadingText.height - 15)
                .setStyle({fill: "gold", font: "22px myFont"})
               
               
               this.graphics.fillStyle(0xffffff);
               this.graphics.fillRectShape(this.borderRect);
               this.graphics.fillStyle(0x9800ff);
               this.loadingBar.width = progress * this.barWidth;
               this.graphics.fillRectShape(this.loadingBar);
               
           ui.transitionToPlayMessage.innerText = this.loadingText.text;
        });

        //when file adding is done...
        this.load.once("complete", ()=>{
            eventEmitter.emit("TRANSITIONTOPLAY_PLAY"); 
            addEventListener("mouseup", ()=>{
                //eventEmitter.emit("TRANSITIONTOPLAY_PLAY");
            })
        })
        eventEmitter.once("TRANSITIONTOPLAY_PLAY", ()=>{
            this.graphics.preDestroy();
            this.scene.start("PlayScene");
        })
        
        this.loadBG();
        this.loadTilemaps();
        this.loadTilesets();
        //this.loadAudio();
    }

    loadBG(){
        //this.loadGame()
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