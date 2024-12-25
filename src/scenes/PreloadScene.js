/**@type {import("../typings/phaser")} */
import { GameState } from "./GameState.js";
import { eventEmitter } from "../events/EventEmitter.js";
import { ui } from "../ui.js";

export class PreloadScene extends GameState{
    constructor(config){
        super("PreloadScene", config);
        this.config = config;
 
    }
    
    enterScene(){
        this.hideAllScreens();
        this.show(this.loadingScreen, "grid");
    }
    
    loadEntities(){
        //PLAYER
        this.load.spritesheet('player', "assets/player/Idle-Sheet.png", {
            frameWidth: 64, frameHeight: 64,
        });
        this.load.spritesheet('player-attack', "assets/player/Attack-01-Sheet.png", {
            frameWidth: 80, frameHeight: 80,
        }); 
        this.load.spritesheet('player-death', "assets/player/Dead-Sheet.png", {
            frameWidth: 64, frameHeight: 64,
        }); 
        this.load.spritesheet('player-jump', "assets/player/Jump-Sheet.png", {
            frameWidth: 64, frameHeight: 64,
        });
        this.load.spritesheet('player-fall', "assets/player/Fall-Sheet.png", {
            frameWidth: 64, frameHeight: 64,
        }); 
        this.load.spritesheet('player-run', "assets/player/Run-Sheet.png", {
            frameWidth: 80, frameHeight: 80,
        }); 
        
        //ENEMIES
        this.load.spritesheet('orc-base', "assets/enemies/Orc Base/Idle-Sheet.png", {
            frameWidth: 32, frameHeight: 32,
        });
        this.load.spritesheet('orc-base-death', "assets/enemies/Orc Base/Death-Sheet.png", {
            frameWidth: 64, frameHeight: 64,
        });
        this.load.spritesheet('orc-base-run', "assets/enemies/Orc Base/Run-Sheet.png", {
            frameWidth: 64, frameHeight: 64,
        });
        
        this.load.spritesheet('orc-rogue', "assets/enemies/Orc Rogue/Idle-Sheet.png", {
            frameWidth: 32, frameHeight: 32,
        });
        this.load.spritesheet('orc-rogue-death', "assets/enemies/Orc Rogue/Death-Sheet.png", {
            frameWidth: 64, frameHeight: 64,
        });
        this.load.spritesheet('orc-rogue-run', "assets/enemies/Orc Rogue/Run-Sheet.png", {
            frameWidth: 64, frameHeight: 64,
        });
        
        this.load.spritesheet('orc-shaman', "assets/enemies/Orc Shaman/Idle-Sheet.png", {
            frameWidth: 32, frameHeight: 32,
        });
        this.load.spritesheet('orc-shaman-death', "assets/enemies/Orc Shaman/Death-Sheet.png", {
            frameWidth: 64, frameHeight: 64,
        });
        this.load.spritesheet('orc-shaman-run', "assets/enemies/Orc Shaman/Run-Sheet.png", {
            frameWidth: 64, frameHeight: 64,
        });
        
        this.load.spritesheet('orc-warrior', "assets/enemies/Orc Warrior/Idle-Sheet.png", {
            frameWidth: 32, frameHeight: 32,
        });
        this.load.spritesheet('orc-warrior-death', "assets/enemies/Orc Warrior/Death-Sheet.png", {
            frameWidth: 96, frameHeight: 80,
        });
        this.load.spritesheet('orc-warrior-run', "assets/enemies/Orc Warrior/Run-Sheet.png", {
            frameWidth: 64, frameHeight: 64,
        });
        
    }
    
    preload(){
        // track and display assets loading progress
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
            
           ui.loading_startBtn.innerText = this.loadingText.text;
        });
        
        //when file adding is done...
        this.load.on("complete", ()=>{
            this.loadingText.setText("Ready? Let's Game!!");
            ui.loading_startBtn.innerText = this.loadingText.text;
            
            ui.loading_startBtn.addEventListener("mouseup", ()=>{
                eventEmitter.emit("PRELOAD_TO_MENU");
            })
        })
        eventEmitter.once("PRELOAD_TO_MENU", ()=>{
            this.scene.start("MenuScene");
        })
        
        this.loadEntities();
        this.enterScene();

    }
}