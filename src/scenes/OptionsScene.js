/**@type {import("../typings/phaser")} */
import { BaseScene, LEVELS } from "./BaseScene.js";
import { eventEmitter } from "../events/EventEmitter.js";
import { ui } from "../ui.js";
import { audio } from "../audio/AudioControl.js";
 

export class OptionsScene extends BaseScene{
    constructor(config){
        super("OptionsScene", config);
        this.config = config;
    }
    
    destroyEvents(){
        eventEmitter.destroy("MENU_TO_OPTIONS");
    }
    
    enter(){
        this.destroyEvents();
        this.hideAllScreens();
        this.show(this.optionsScreen, "grid");
    }
    
    create(){
        this.enter();
        this.initEvents();
        eventEmitter.once("OPTIONS_TO_MENU", ()=>{
            this.scene.start("MenuScene");
        })
    }
    
    
    initEvents(){
        ui.options_menuBtn.addEventListener('click', ()=>{
            eventEmitter.emit("OPTIONS_TO_MENU");
        }) 
    }
}