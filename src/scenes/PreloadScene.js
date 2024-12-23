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
        this.load.spritesheet('player', "assets/player/move_sprite_1.png", {
            frameWidth: 32, spacing: 32, frameHeight: 38,
        });
        //LADDER
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