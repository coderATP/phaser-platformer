/**@type {import("../typings/phaser")} */
import { BaseScene } from "./BaseScene.js";
import { ui } from "../ui.js";
import { myInput } from "../myInput.js";
import {eventEmitter} from "../events/EventEmitter.js";
import { PlayScene } from "./PlayScene.js";


export class LevelSelectScene extends BaseScene {
    constructor(config) {
        super('LevelSelectScene', config);
        
        this.levelImage = ui.levelScreenshot_forest;
        this.imageIndex = 0;
        this.numberOfLevels = 4;
    }
    
    destroyEvents(){
        eventEmitter.destroy("MENU_TO_LEVELSELECT"); 
    }
    enter() {
        this.destroyEvents();
        
        this.hideAllScreens();
        this.show(this.levelSelectScreen, "grid");
    }
    
    create() {
        this.enter();
        this.handleEvents();
    }
    
    handleEvents() {
        ui.levelSelect_enter.addEventListener("click", ()=>{
            eventEmitter.emit("LEVELSELECT_TO_ENTER");
        })
        ui.levelSelect_back.addEventListener("click", ()=>{
            eventEmitter.emit("LEVELSELECT_TO_MENU");
        })
        
        eventEmitter.once("LEVELSELECT_TO_ENTER", ()=>{
            this.scene.start("TransitionToPlayScene");
        })
        eventEmitter.once("LEVELSELECT_TO_MENU", ()=>{
            this.scene.start("MenuScene");
        }) 
    }

    initEvents() {
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }
    
    renderScreenshot(){
        const canvas = document.querySelector("#levelScreenshot_canvas");
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0,0,canvas.width, canvas.height);
        ctx.drawImage(this.levelImage, 0, 0, canvas.width, canvas.height);
    }
    
    setSelectedLevel() {
        if (this.imageIndex == 0) {
            this.registry.set("currentLevel", 0)
        }
        else if (this.imageIndex == 1) {
            this.registry.set("currentLevel", 1) 
        }
        else if (this.imageIndex == 2) {
            this.registry.set("currentLevel", 2)
        }
        else if (this.imageIndex == 3) {
            this.registry.set("currentLevel", 3)
        }
    }
    
    navigateLevels(){
        
        const imageDescriptions = [ "forest","ruins", "crypt", "cemetry" ];
                                   
        switch(myInput.keys[0]){
            //navigation with the circles, easy
            //forest circle
            case "levelSelect_forest":
                this.imageIndex = 0;
            break;
            //ruins circle
            case "levelSelect_ruins":
                this.imageIndex = 1;
            break;
            //crypt circle
            case "levelSelect_crypt":
                this.imageIndex = 2;
            break;
            //cemetry circle
            case "levelSelect_cemetry":
                this.imageIndex = 3;
            break;
            
            //navigation with the arrows, intermediate
            //"next" arrow
            case "levelSelect_next":
                //this.game.audio.play(this.game.audio.buttonSound);
                if(this.imageIndex < this.numberOfLevels - 1  && myInput.keypressed){
                    this.imageIndex++;
                    myInput.keypressed = false;
                }
                else if(this.imageIndex >= this.numberOfLevels - 1 && myInput.keypressed){
                    this.imageIndex = 0;
                    myInput.keypressed = false;
                }
            break;
            //"previous" arrow
            case "levelSelect_previous":
                //this.game.audio.play(this.game.audio.buttonSound);
                if(this.imageIndex  > 0 && myInput.keypressed){
                    this.imageIndex--;
                    myInput.keypressed = false;
                }
                else if(this.imageIndex <= 0 && myInput.keypressed){
                    this.imageIndex = this.numberOfLevels - 1;
                    myInput.keypressed = false;
                }
            break;
        }
        
        //BASED ON INAGE THE SET IMAGE-INDEX VALUE WE WILL NOW SET:
        // (A) THE SCREENSHOT PROPERTIES
        // (B) THE IMAGE FILEPATH
        this.levelImage = ui.levelScreenshots[this.imageIndex];
        
        // (C) THE IMAGE ID 
        
        //(D) THE IMAGE INFORMATION / DESCRIPTION 
        ui.levelDescription.innerText = imageDescriptions[this.imageIndex];
        //(E) CURRENT LEVEL TO THE SELECTED LEVEL BASED ON IMAGE-INDEX VALUE
        this.setSelectedLevel();
        this.registry.set("currentLevel", this.imageIndex);
    }
     
    update() {
        this.navigateLevels();
        this.renderScreenshot();
        
    }
}