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
        eventEmitter.destroy("OPTIONS_TO_MENU");
        eventEmitter.destroy("LEVELSELECT_TO_MENU");
        eventEmitter.destroy("PAUSE_TO_MENU");
        eventEmitter.destroy("LEVELCOMPLETE_TO_MENU"); 
    }
    
    enter(){
        this.destroyEvents();
        audio.menuSong.play();
        
        this.hideAllScreens();
        this.show(this.menuScreen, "grid");
        //disable load button if no saved game is found
       // const loadButtonStatus = localStorage.getItem("loadButtonDisabled");
        //ui.menu_continueBtn.disabled = loadButtonStatus === null ? true : false;
    }

    create(){

        this.enter();
        this.initEvents();
        
        eventEmitter.once("MENU_TO_LEVELSELECT", ()=>{
            this.scene.start("LevelSelectScene");
        })
        eventEmitter.once("MENU_TO_OPTIONS", ()=>{
            this.scene.start("OptionsScene");
        })
        eventEmitter.once("MENU_TO_EXIT", ()=>{
            this.game.destroy();
        }) 
        eventEmitter.once("MENU_TO_CONTINUE", ()=>{
            this.loadGame();
        })
    }
    
    initEvents(){
        ui.menu_playBtn.addEventListener("click", ()=>{
            eventEmitter.emit("MENU_TO_LEVELSELECT");
        })
        ui.menu_optionsBtn.addEventListener("click", ()=>{
            eventEmitter.emit("MENU_TO_OPTIONS");
        })
        ui.menu_continueBtn.addEventListener("click", ()=>{
            const currentLevel = JSON.parse(localStorage.getItem("currentLevel"));
            const currentScene = JSON.parse(localStorage.getItem("currentScene"));
            if ((currentLevel === null) || (currentScene === null)) {
                audio.play(audio.errorSound);
                return;
            }
            eventEmitter.emit("MENU_TO_CONTINUE");
        })
        ui.menu_exitBtn.addEventListener("click", ()=>{
            eventEmitter.emit("MENU_TO_EXIT");
        }) 
    }

}