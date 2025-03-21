/**@type {import("../typings/phaser")} */
import { BaseScene } from "./BaseScene.js";
import { eventEmitter } from "../events/EventEmitter.js";
import { ui } from "../ui.js";
import { createOrcAnimKeys } from "../anims/orcAnims.js";
import { createSkeletonAnimKeys } from "../anims/skeletonAnims.js";
import { createPlayerAnimKeys } from "../anims/playerAnims.js";
import { createProjectileAnimKeys } from "../anims/projectileAnims.js";
import { createBoss1AnimKeys } from "../anims/boss1Anims.js";
import { createDoorAnimKeys } from "../anims/doorAnims.js";


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
        createOrcAnimKeys(this);
        createSkeletonAnimKeys(this);
        createProjectileAnimKeys(this);
        createBoss1AnimKeys(this);
        createDoorAnimKeys(this);
    }
    
    loadDoors(){
        this.load.image("exitSign", "assets/doors/exitSign.png");
        this.load.spritesheet('exitDoor', "assets/doors/door_sprite.png", {
            frameWidth: 68, frameHeight: 96,
        }); 
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
        this.load.spritesheet('player', "assets/player/Idle.png", {
            frameWidth: 120, frameHeight: 80,
        });
        this.load.spritesheet('player-climb', "assets/player/WallClimbNoMovement.png", {
            frameWidth: 120, frameHeight: 80,
        }); 
        this.load.spritesheet('player-crouch', "assets/player/Crouch.png", {
            frameWidth: 120, frameHeight: 80,
        });
        this.load.spritesheet('player-crouch-walk', "assets/player/CrouchWalk.png", {
            frameWidth: 120, frameHeight: 80,
        });
        this.load.spritesheet('player-attack', "assets/player/Attack-01-Sheet.png", {
            frameWidth: 80, frameHeight: 80,
        });
        this.load.spritesheet('player-roll', "assets/player/Roll.png", {
            frameWidth: 120, frameHeight: 80,
        });
        this.load.spritesheet('player-slide', "assets/player/Slide.png", {
            frameWidth: 120, frameHeight: 80,
        });  
        this.load.spritesheet('player-death', "assets/player/Dead-Sheet.png", {
            frameWidth: 64, frameHeight: 64,
        }); 
        this.load.spritesheet('player-jump', "assets/player/Jump.png", {
            frameWidth: 120, frameHeight: 80,
        });
        this.load.spritesheet('player-fall', "assets/player/Fall.png", {
            frameWidth: 120, frameHeight: 80,
        }); 
        this.load.spritesheet('player-run', "assets/player/Run.png", {
            frameWidth: 120, frameHeight: 80,
        }); 
        
        //ENEMIES
        //ORCS
        this.load.spritesheet('orc-base', "assets/enemies/Orc Base/Idle-Sheet.png", {
            frameWidth: 32, frameHeight: 32,
        });
        this.load.spritesheet('orc-base-run', "assets/enemies/Orc Base/Run-Sheet.png", {
            frameWidth: 64, frameHeight: 64,
        });
        this.load.spritesheet('orc-base-death', "assets/enemies/Orc Base/Death-Sheet.png", {
            frameWidth: 64, frameHeight: 64,
        });  
        this.load.spritesheet('orc-rogue', "assets/enemies/Orc Rogue/Idle-Sheet.png", {
            frameWidth: 32, frameHeight: 32,
        });
        this.load.spritesheet('orc-rogue-run', "assets/enemies/Orc Rogue/Run-Sheet.png", {
            frameWidth: 64, frameHeight: 64,
        });
        this.load.spritesheet('orc-rogue-death', "assets/enemies/Orc Rogue/Death-Sheet.png", {
            frameWidth: 64, frameHeight: 64,
        });   
        this.load.spritesheet('orc-shaman', "assets/enemies/Orc Shaman/Idle-Sheet.png", {
            frameWidth: 32, frameHeight: 32,
        });
        this.load.spritesheet('orc-shaman-run', "assets/enemies/Orc Shaman/Run-Sheet.png", {
            frameWidth: 64, frameHeight: 64,
        });
        this.load.spritesheet('orc-shaman-death', "assets/enemies/Orc Shaman/Death-Sheet.png", {
            frameWidth: 64, frameHeight: 64,
        });  
        this.load.spritesheet('orc-warrior', "assets/enemies/Orc Warrior/Idle-Sheet.png", {
            frameWidth: 32, frameHeight: 32,
        });
        this.load.spritesheet('orc-warrior-run', "assets/enemies/Orc Warrior/Run-Sheet.png", {
            frameWidth: 64, frameHeight: 64,
        });
        this.load.spritesheet('orc-warrior-death', "assets/enemies/Orc Warrior/Death-Sheet.png", {
            frameWidth: 64, frameHeight: 64,
        });
        //SKELETONS
        this.load.spritesheet('skeleton-base', "assets/enemies/Skeleton Base/Idle-Sheet.png", {
            frameWidth: 32, frameHeight: 32,
        });
        this.load.spritesheet('skeleton-base-run', "assets/enemies/Skeleton Base/Run-Sheet.png", {
            frameWidth: 64, frameHeight: 64,
        });
        this.load.spritesheet('skeleton-base-death', "assets/enemies/Skeleton Base/Death-Sheet.png", {
            frameWidth: 64, frameHeight: 64,
        });  
        this.load.spritesheet('skeleton-rogue', "assets/enemies/Skeleton Rogue/Idle-Sheet.png", {
            frameWidth: 32, frameHeight: 32,
        });
        this.load.spritesheet('skeleton-rogue-run', "assets/enemies/Skeleton Rogue/Run-Sheet.png", {
            frameWidth: 64, frameHeight: 64,
        });
        this.load.spritesheet('skeleton-rogue-death', "assets/enemies/Skeleton Rogue/Death-Sheet.png", {
            frameWidth: 64, frameHeight: 64,
        });   
        this.load.spritesheet('skeleton-mage', "assets/enemies/Skeleton Mage/Idle-Sheet.png", {
            frameWidth: 32, frameHeight: 32,
        });
        this.load.spritesheet('skeleton-mage-run', "assets/enemies/Skeleton Mage/Run-Sheet.png", {
            frameWidth: 64, frameHeight: 64,
        });
        this.load.spritesheet('skeleton-mage-death', "assets/enemies/Skeleton Mage/Death-Sheet.png", {
            frameWidth: 64, frameHeight: 64,
        });  
        this.load.spritesheet('skeleton-warrior', "assets/enemies/Skeleton Warrior/Idle-Sheet.png", {
            frameWidth: 32, frameHeight: 32,
        });
        this.load.spritesheet('skeleton-warrior-run', "assets/enemies/Skeleton Warrior/Run-Sheet.png", {
            frameWidth: 64, frameHeight: 64,
        });
       
       this.load.spritesheet('skeleton-warrior-death', "assets/enemies/Skeleton Warrior/Death-Sheet.png", {
            frameWidth: 64, frameHeight: 48,
        });
        
        //boss1
       this.load.spritesheet('boss1-blue-head-strike', "assets/enemies/Boss1/Attack1.png", {
            frameWidth: 96, frameHeight: 96,
        });
       this.load.spritesheet('boss1-purple-head-strike', "assets/enemies/Boss1/Attack2.png", {
            frameWidth: 96, frameHeight: 96,
        });
       this.load.spritesheet('boss1-run', "assets/enemies/Boss1/Run.png", {
            frameWidth: 96, frameHeight: 96,
        });
       this.load.spritesheet('boss1-running-strike', "assets/enemies/Boss1/Attack4.png", {
            frameWidth: 96, frameHeight: 96,
        });

       this.load.spritesheet('boss1-death', "assets/enemies/Boss1/Death.png", {
            frameWidth: 96, frameHeight: 96,
        }); 
       this.load.spritesheet('boss1-hurt', "assets/enemies/Boss1/Hurt.png", {
            frameWidth: 96, frameHeight: 96,
        });
       this.load.spritesheet('boss1-idle', "assets/enemies/Boss1/Idle.png", {
            frameWidth: 96, frameHeight: 96,
        });
       this.load.spritesheet('boss1-bite', "assets/enemies/Boss1/Special.png", {
            frameWidth: 96, frameHeight: 96,
        });
       this.load.spritesheet('boss1-walk', "assets/enemies/Boss1/Walk.png", {
            frameWidth: 96, frameHeight: 96,
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
            this.toggleFullscreen()
            this.scene.start("MenuScene");
        })
        //load audio
        //this.loadAudio(); 
        //load icons
        this.loadDoors();
        this.loadIcons();
        //load entities
        this.loadEntities();
        this.registry.set("currentLevel", 0);
    }
    toggleFullscreen(){
       if(!document.fullscreenElement){
           document.documentElement.requestFullscreen();
            screen.orientation.lock("landscape");
            }else if(document.exitFullscreen){
                document.exitFullscreen();
            }
        } 
}