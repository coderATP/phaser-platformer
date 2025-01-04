/**@type {import("../typings/phaser")} */
import { BaseScene } from "./BaseScene.js";
import { eventEmitter } from "../events/EventEmitter.js";
import { ui } from "../ui.js";
import { createEnemyAnimKeys } from "../anims/enemyAnims.js"
import { createPlayerAnimKeys } from "../anims/playerAnims.js"
import { createProjectileAnimKeys } from "../anims/projectileAnims.js"


export class PreloadScene extends BaseScene{
    constructor(config){
        super("PreloadScene", config);
        this.config = config;
 
    }
    
    enterScene(){
        this.hideAllScreens();
        this.show(this.loadingScreen, "grid");
    }
    
    loadAnims(){
        createPlayerAnimKeys(this);
        createEnemyAnimKeys(this);
        createProjectileAnimKeys(this);
    }
    
    loadAudio(){
        this.load.audio("menuSong", "assets/sounds/menu_song.mp3");
        this.load.audio("forestSong", "assets/sounds/forest_song.mp3");
        this.load.audio("ruinsSong", "assets/sounds/ruins_song.mp3");
        this.load.audio("buttonClick", "assets/sounds/button_sound.wav");
        this.load.audio("buttonHover", "assets/sounds/button_hover_sound.wav");
        this.load.audio("coinColected", "assets/sounds/coin_collected.wav");
        this.load.audio("winSong", "assets/sounds/win_song.wav");
    }
    
    loadIcons(){
        this.load.image("lifeIcon", "assets/icons/lifeIcon.png");
    }
    
    loadEntities(){
        //PLAYER
        this.load.spritesheet('player', "assets/player/Idle-Sheet.png", {
            frameWidth: 64, frameHeight: 64,
        });
        this.load.spritesheet('player-attack', "assets/player/Attack-01-Sheet.png", {
            frameWidth: 80, frameHeight: 80,
        }); 
        this.load.spritesheet('player-death', "assets/player/Dead-Sheet.png", {
            frameWidth: 64, frameHeight: 64,
        }); 
        this.load.spritesheet('player-jump', "assets/player/Jump-Sheet.png", {
            frameWidth: 64, frameHeight: 64,
        });
        this.load.spritesheet('player-fall', "assets/player/Fall-Sheet.png", {
            frameWidth: 64, frameHeight: 64,
        }); 
        this.load.spritesheet('player-run', "assets/player/Run-Sheet.png", {
            frameWidth: 80, frameHeight: 80,
        }); 
        
        //ENEMIES
        this.load.spritesheet('orc-base', "assets/enemies/Orc Base/Idle-Sheet.png", {
            frameWidth: 32, frameHeight: 32,
        });
        this.load.spritesheet('orc-base-death', "assets/enemies/Orc Base/Death-Sheet.png", {
            frameWidth: 64, frameHeight: 64,
        });
        this.load.spritesheet('orc-base-run', "assets/enemies/Orc Base/Run-Sheet.png", {
            frameWidth: 64, frameHeight: 64,
        });
        
        this.load.spritesheet('orc-rogue', "assets/enemies/Orc Rogue/Idle-Sheet.png", {
            frameWidth: 32, frameHeight: 32,
        });
        this.load.spritesheet('orc-rogue-death', "assets/enemies/Orc Rogue/Death-Sheet.png", {
            frameWidth: 64, frameHeight: 64,
        });
        this.load.spritesheet('orc-rogue-run', "assets/enemies/Orc Rogue/Run-Sheet.png", {
            frameWidth: 64, frameHeight: 64,
        });
        
        this.load.spritesheet('orc-shaman', "assets/enemies/Orc Shaman/Idle-Sheet.png", {
            frameWidth: 32, frameHeight: 32,
        });
        this.load.spritesheet('orc-shaman-death', "assets/enemies/Orc Shaman/Death-Sheet.png", {
            frameWidth: 64, frameHeight: 64,
        });
        this.load.spritesheet('orc-shaman-run', "assets/enemies/Orc Shaman/Run-Sheet.png", {
            frameWidth: 64, frameHeight: 64,
        });
        
        this.load.spritesheet('orc-warrior', "assets/enemies/Orc Warrior/Idle-Sheet.png", {
            frameWidth: 32, frameHeight: 32,
        });
        this.load.spritesheet('orc-warrior-death', "assets/enemies/Orc Warrior/Death-Sheet.png", {
            frameWidth: 96, frameHeight: 80,
        });
        this.load.spritesheet('orc-warrior-run', "assets/enemies/Orc Warrior/Run-Sheet.png", {
            frameWidth: 64, frameHeight: 64,
        });
        
        //PROJECTILES
        this.load.spritesheet("fireball", "assets/weapons/fireball.png", {
            frameWidth: 32, frameHeight: 32
        })
        this.load.spritesheet("fireball-impact", "assets/weapons/fireball_impact.png", {
            frameWidth: 32, frameHeight: 32
        }) 
        this.load.spritesheet("iceball", "assets/weapons/iceball.png", {
            frameWidth: 32, frameHeight: 32
        });
        this.load.spritesheet("iceball-impact", "assets/weapons/iceball_impact.png", {
            frameWidth: 32, frameHeight: 32
        }); 
    }
    
    preload(){
        this.enterScene();

        // track and display assets loading progress
        //added 1 new file
        this.load.on("addfile", ()=>{
            this.registry.inc("assetsTotal", 1);
        });

        this.loadingText = this.add.text(0,0, "", { font: "42px myOtherFont"})
                .setInteractive()
                .setOrigin(0)
                .setStyle({fill: 'brown'})
        this.loadingText.setPosition(this.config.width/2 - this.loadingText.width/2, this.config.height/2 - this.loadingText.height/2);
        
        //while files are still being added...
        this.load.on("progress", (progress)=>{
            this.loadingText.setText(Math.floor(progress*this.registry.get("assetsTotal")) + " of " + this.registry.get("assetsTotal") + " assets loading..." );
            this.loadingText.setPosition(this.config.width/2 - this.loadingText.width/2, this.config.height/2 - this.loadingText.height/2);
            
           ui.loading_startBtn.innerText = this.loadingText.text;
        });
        
        //when file adding is done...
        this.load.on("complete", ()=>{
            //load animations (this has to wait till now since it requires textures to first load)
            this.loadAnims();
            
            this.loadingText.setText("Ready? Let's Game!!");
            ui.loading_startBtn.innerText = this.loadingText.text;
            
            ui.loading_startBtn.addEventListener("mouseup", ()=>{
                eventEmitter.emit("PRELOAD_TO_MENU");
            })
        })
        eventEmitter.once("PRELOAD_TO_MENU", ()=>{
            this.scene.start("MenuScene");
        })
        //load audio
        //this.loadAudio(); 
        //load icons
        this.loadIcons();
        //load entities
        this.loadEntities();
        
    }
}