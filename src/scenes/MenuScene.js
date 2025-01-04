/**@type {import("../typings/phaser")} */
import { BaseScene } from "./BaseScene.js";
import { ui } from "../ui.js";
import { eventEmitter } from "../events/EventEmitter.js";
import { audio } from "../audio/AudioControl.js";

export class MenuScene extends BaseScene{
    constructor(config){
        super('MenuScene', config);
        
    }
    
    destroyEvents(){
        eventEmitter.destroy("PRELOAD_TO_MENU");
        eventEmitter.destroy("LEVELSELECT_TO_MENU");
        eventEmitter.destroy("PAUSE_TO_MENU");
        eventEmitter.destroy("LEVELCOMPLETE_TO_MENU"); 
    }
    enter(){
        this.destroyEvents();
        audio.menuSong.play();
        
        this.hideAllScreens();
        this.show(this.menuScreen, "grid");
    }

    create(){

        this.enter();
        this.initEvents();
        
        eventEmitter.once("MENU_TO_LEVELSELECT", ()=>{
            this.scene.start("LevelSelectScene");
        })
    }
    
    initEvents(){
        ui.menu_playBtn.addEventListener("click", ()=>{
            eventEmitter.emit("MENU_TO_LEVELSELECT");
        })
    }

}