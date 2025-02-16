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
        
        //adjust sfx
        ui.sfx_controller.addEventListener('change', ()=>{
            audio.sounds.forEach(sound=>{
                sound.volume = ui.sfx_controller.value * 0.1;
                
            })
        })
        ui.music_controller.addEventListener('change', ()=>{
            audio.songs.forEach(song=>{
                song.volume = ui.music_controller.value * 0.1;
                
            })
        }) 
    }
    
    
    initEvents(){
        ui.options_menuBtn.addEventListener('click', ()=>{
            eventEmitter.emit("OPTIONS_TO_MENU");
        }) 
    }
}