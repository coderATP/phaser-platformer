/**@type {import("../typings/phaser")} */
import { GameState } from "./GameState.js";
import { ui } from "../ui.js";
import { eventEmitter } from "../events/EventEmitter.js";


export class MenuScene extends GameState{
    constructor(config){
        super('MenuScene', config);
        
    }
    
    enter(){
        eventEmitter.destroy("PRELOAD_TO_MENU");
        eventEmitter.destroy("LEVELSELECT_TO_MENU");
        eventEmitter.destroy("PAUSE_TO_MENU");
        
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