/**@type {import("../typings/phaser")} */


const STATES = {
    LOAD: 0,
    MENU: 1,
    LEVELSELECT: 2,
    PLAY: 3,
    PAUSE: 4,
    GAMEOVER: 5
};

export const LEVELS = [
     {name: "forest", scenes: 3},
     {name: "ruins", scenes: 3},
     {name: "crypt", scenes: 3},
     {name: "cemetery", scenes: 3}

];

export class GameState extends Phaser.Scene{
    constructor(scene, config){
        super(scene);
        this.config = config;
        this.map = null;
        this.currentLevel = null;
        this.currentScene = null;
        
        this.mapLayers = null;
        this.bgLayers = null;
        this.player = null;
        this.enemies = null;
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
        
    }
    
    create(){
        this.registry.set("currentScene", this.registry.get("currentScene") || 1);
    }
    
    setCurrentScene() {
        this.currentLevel = this.registry.get("currentLevel");
        this.currentScene = this.registry.get("currentScene");
    }
    
    resetGame(){
        this.map = null;
        this.mapID = null;
        this.mapLayers = null;
        this.backgrounds = null;
        this.player = null;
        this.enemies = null;
        this.mapWidth = this.mapHeight = undefined;
        this.gamePaused; 
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
