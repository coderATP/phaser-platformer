class UI{
    constructor(){
        //loading
        this.loading_startBtn = document.getElementById("loading_startBtn");
        this.loadingBtns = [this.loading_startBtn];
        
        //menu
        this.menu_playBtn = document.getElementById("menu_playBtn");
        this.menu_optionsBtn = document.getElementById("menu_optionsBtn");
        this.menu_leaderboardBtn = document.getElementById("menu_leaderboardBtn");
        this.menu_tutorialBtn = document.getElementById("menu_tutorialBtn");
        this.menu_exitBtn = document.getElementById("menu_exitBtn");
        this.menu_continueBtn = document.getElementById("menu_continueBtn"); 
        this.menuBtns = [this.menu_playBtn, this.menu_optionsBtn, this.menu_leaderboardBtn, this.menu_tutorialBtn, this.menu_exitBtn];
        
        //transition to play
        this.transitionToPlayMessage = document.getElementById("transitionToPlayMessage");
        
        //play
        this.fullscreenBtn = document.getElementById("play_fullscreenBtn");
        this.play_pauseBtn = document.getElementById("play_pauseBtn");
        this.play_specialBtn = document.getElementById("special");
        
        //level complete
        this.levelComplete_replayBtn = document.getElementById("levelComplete_replayBtn");
        this.levelComplete_nextBtn = document.getElementById("levelComplete_nextBtn");
        this.levelComplete_menuBtn = document.getElementById("levelComplete_menuBtn");
        this.levelCompleteBtns = [this.levelComplete_replayBtn, this.levelComplete_nextBtn, this.levelComplete_menuBtn];

        //level select
        this.levelScreenshot_forest = document.getElementById("forestScreenshot");
        this.levelScreenshot_ruins = document.getElementById("ruinsScreenshot");
        
        this.levelDescription = document.getElementById("imageDescription");
        this.levelSelect_back = document.getElementById("levelSelect_back");
        this.levelSelect_enter = document.getElementById("levelSelect_enter");
        
        this.levelScreenshots = [this.levelScreenshot_forest, this.levelScreenshot_ruins, this.levelScreenshot_ruins, this.levelScreenshot_ruins]
        this.levelSelectBtns = [this.levelSelect_back,  this.levelSelect_enter];

        //pause
        this.pause_restartBtn = document.getElementById("pause_restartBtn");
        this.pause_resumeBtn = document.getElementById("pause_resumeBtn");
        this.pause_menuBtn = document.getElementById("pause_menuBtn");
        this.pause_saveBtn = document.getElementById("pause_saveBtn");
        this.pauseBtns = [this.pause_restartBtn, this.pause_resumeBtn, this.pause_menuBtn, this.pause_saveBtn];
        
        //restart
        this.restart_yesBtn = document.getElementById("restart_yesBtn");
        this.restart_noBtn = document.getElementById("restart_noBtn");
        this.restartBtns = [this.restart_noBtn, this.restart_yesBtn];
        
        //options
        this.options_menuBtn = document.getElementById("options_backBtn");
        this.optionsBtns = [this.options_menuBtn];
       
        // ALL BUTTONS
        this.buttons = [...this.menuBtns, ...this.levelSelectBtns, ...this.levelCompleteBtns, ...this.optionsBtns, ...this.pauseBtns, ...this.restartBtns];
        
        //range for vol adjustment
        this.sfx_controller = document.getElementById("options_sfx");
        this.music_controller = document.getElementById("options_music");
        this.volume_controllers = [this.sfx_controller, this.music_controller];
    }
}

export const ui = new UI();