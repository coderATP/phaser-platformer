import { BaseScene } from "./BaseScene.js";
import { ui } from "../ui.js";
import { eventEmitter } from "../events/EventEmitter.js";


export class LevelCompleteScene extends BaseScene{
    constructor(config){
        super("LevelCompleteScene", config);
    }
    
    enter(){
        this.hideAllScreens();
        this.show(this.levelCompleteScreen, "grid");
    }
    
    create(){
        this.enter();
        this.acceptEvents();
        this.processEvents();
    }
    
    acceptEvents(){
        ui.levelComplete_replayBtn.addEventListener("click", ()=>{
            eventEmitter.emit("LEVELCOMPLETE_TO_RESTART");
        })
        ui.levelComplete_nextBtn.addEventListener("click", ()=>{
            eventEmitter.emit("LEVELCOMPLETE_TO_NEXT");
        }) 
        ui.levelComplete_menuBtn.addEventListener("click", () => {
            eventEmitter.emit("LEVELCOMPLETE_TO_MENU");
        })
    }
    
    processEvents(){
        eventEmitter.once("LEVELCOMPLETE_TO_RESTART", ()=>{
            this.setCurrentScene();
            this.scene.start("TransitionToPlayScene");
        })
        eventEmitter.once("LEVELCOMPLETE_TO_NEXT", ()=>{
            if(this.currentLevel < 3) this.registry.inc("currentLevel", 1);
            this.registry.set("currentScene", 1);
            this.setCurrentScene();
            this.scene.start("TransitionToPlayScene");
        })
        eventEmitter.once("LEVELCOMPLETE_TO_MENU", () => {
            this.setCurrentScene();
            this.scene.start("MenuScene");
        })
    }
    update(){
        
    }
}