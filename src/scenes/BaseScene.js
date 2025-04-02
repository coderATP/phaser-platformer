/**@type {import("../typings/phaser")} */
import { ui } from "../ui.js";
import { audio } from "../audio/AudioControl.js";

const STATES = {
    LOAD: 0,
    MENU: 1,
    LEVELSELECT: 2,
    PLAY: 3,
    PAUSE: 4,
    GAMEOVER: 5
};

export const LEVELS = [
     {name: "forest", scenes: 4, slopes: {leftIndexes: [13, 37], rightIndexes: [16, 43]}},
     {name: "ruins", scenes: 2, slopes: {leftIndexes: [13, 37], rightIndexes: [16, 43]}},
     {name: "crypt", scenes: 2, slopes: {leftIndexes: [13, 37], rightIndexes: [16, 43]}},
     {name: "cemetery", scenes: 1, slopes: {leftIndexes: [13, 37], rightIndexes: [16, 43]}},
     {name: "garden", scenes: 0, slopes: {leftIndexes: [13, 37], rightIndexes: [16, 43]}},
     {name: "grassland", scenes: 0, slopes: {leftIndexes: [13, 37], rightIndexes: [16, 43]}},
     {name: "temple", scenes: 0, slopes: {leftIndexes: [13, 37], rightIndexes: [16, 43]}},
     {name: "dungeon", scenes: 0, slopes: {leftIndexes: [13, 37], rightIndexes: [16, 43]}}

];

export class BaseScene extends Phaser.Scene{
    constructor(scene, config){
        super(scene);
        this.config = config;
        this.scene = scene;
        this.cameraZoomFactor = config.zoomFactor;
        this.map = null;
        this.currentLevel = null;
        this.currentScene = null;

        this.mapLayers = null;
        this.bgLayers = null;
        this.light = null;
        this.player = null;
        this.enemies = null;
        this.numberOfEnemies = undefined;
        this.doors = null;
        this.numberOfDoors = undefined;
        this.mapWidth = this.mapHeight = undefined;
        this.gamePaused;
        this.endOfSceneImage = null;
        this.loadingScreen = document.getElementById("loadingScreen");
        this.menuScreen = document.getElementById("menuScreen");
        this.levelSelectScreen = document.getElementById("levelSelectScreen");
        this.playScreen = document.getElementById("playScreen");
        this.pauseScreen = document.getElementById("pauseScreen");
        this.gameOverScreen = document.getElementById("gameOverScreen");
        this.levelCompleteScreen = document.getElementById("levelCompleteScreen");
        this.playSceneCurtain = document.getElementById("playSceneCurtain");
        this.loading_startBtn = document.getElementById("loading_start");
        this.restartConfirmScreen = document.getElementById("restartConfirmScreen");
        this.optionsScreen = document.getElementById("optionsScreen");
        this.shouldUpdate = true;
        this.shouldRender = true;
        this.opacity = 0;
        this.canLoadGame = false;
    }
    
    create(){
        this.registry.set("currentScene", this.registry.get("currentScene") || 1);
    }
    
    getCurrentScene() {
        this.currentLevel = this.registry.get("currentLevel");
        this.currentScene = this.registry.get("currentScene");
    }
    
    saveGame(){
        this.getCurrentScene();
        localStorage.setItem("currentLevel", JSON.stringify(this.currentLevel));
        localStorage.setItem("currentScene", JSON.stringify(this.currentScene));
        //enable continue button
        //localStorage.setItem("loadButtonDisabled", false);
        localStorage.setItem("player", JSON.stringify(this.player));
        localStorage.setItem("light", JSON.stringify(this.light));
        localStorage.setItem("camera", JSON.stringify(this.cam));
        
       // localStorage.setItem("enemies", JSON.stringify(this.enemies));
       this.enemies.getChildren().forEach((enemy, i)=>{
           localStorage.setItem("enemy"+i, JSON.stringify(enemy))
       });
       localStorage.setItem("numberOfEnemies", JSON.stringify(this.enemies.getChildren().length));
      //  localStorage.setItem("map", JSON.stringify(this.map));
        localStorage.setItem("map-layers", JSON.stringify(this.mapLayers));
        localStorage.setItem("background-layers", JSON.stringify(this.bgLayers));
        localStorage.setItem("boss1", JSON.stringify(this.boss1));
       // localStorage.setItem("doors", JSON.stringify(this.doors));
       this.doors.getChildren().forEach((door, i)=>{
           localStorage.setItem("door"+i, JSON.stringify(door))
       });
       localStorage.setItem("numberOfDoors", JSON.stringify(this.doors.getChildren().length));
    }

    loadGame(){
        //idea here is that...
        //we're setting currentLevel/Scene to...
        //the numerical values saved on localStorage,
        //not this.currentLevel/Scene's values
        const currentLevel = JSON.parse(localStorage.getItem("currentLevel"));
        const currentScene = JSON.parse(localStorage.getItem("currentScene"));
        if ((currentLevel===null) || (currentScene===null)) { return; }
       
        this.registry.set("currentLevel", currentLevel);
        this.registry.set("currentScene", currentScene);
        this.registry.set("canLoadGame", true);
        this.canLoadGame = this.registry.get("canLoadGame");
        this.scene.start("TransitionToPlayScene"); 

    }
    
    resetGame(){
        //remove exit sign/door(s)
        this.doors.destroy(true);
        this.doors = null; 
        //destroy player healthbar
        this.player.healthbar.graphics.preDestroy();
        //destroy player projectiles
        this.player.projectiles&& this.player.projectiles.destroy(true);
        this.player.projectiles = null;
        //destroy player itself
        this.player&& this.player.destroy();
        this.player = null;
        //remove enemies' projectiles and enemies themselves
        this.enemies.getChildren().forEach(enemy=>{
            enemy.projectiles.destroy(true);
            enemy.projectiles = null;
            enemy.destroy();
            enemy = null;
        })
        //destroy enemy group
        this.enemies.destroy(true);
        this.enemies = null;
        //destroy boss
        this.boss1.destroy();
        this.boss1 = null;
        //disable light
        this.light&& this.lights.disable();
        this.light = null;
        //remove level tileset
        this.textures.remove("Tileset" + this.currentLevel);
        //remove background images
        this.textures.remove("01");
        this.textures.remove("02");
        //destroy map
        this.mapID = null;
        this.map&& this.map.destroy();
        this.map = null; 
    }
    
    hideAllScreens(){
          this.loadingScreen.style.display = "none";
          this.menuScreen.style.display = "none";
          this.levelSelectScreen.style.display = "none";
          this.playScreen.style.display = "none";
          this.playSceneCurtain.style.display = "none";
          this.pauseScreen.style.display = "none";
          this.levelCompleteScreen.style.display = "none";
          this.gameOverScreen.style.display = "none";
          this.restartConfirmScreen.style.display = "none";
          this.optionsScreen.style.display = "none";
    }
    
    hide(screen){
        screen.style.display = "none";
    }
    
    show(screen, display){
        screen.style.display = display;
    }
    
    update(){
    }
}
