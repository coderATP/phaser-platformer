import { ui } from "../ui.js";


class AudioControl{
    constructor(){
        this.menuSong = new Audio("assets/sounds/overworld.ogg");
        this.forestSong = new Audio("assets/sounds/forest.ogg");
        this.ruinsSong = new Audio("assets/sounds/ruins.mp3");
        this.cryptSong = new Audio("assets/sounds/crypt.mp3");
        this.cemeterySong = new Audio("assets/sounds/cemetery.wav"); 
        
        this.winSong = new Audio("assets/sounds/win.wav");

        this.buttonClickSound = new Audio("assets/sounds/button_hover_sound.wav");
        this.buttonHoverSound = new Audio("assets/sounds/button_sound.wav");
        
        this.punchSound = new Audio("assets/sounds/punch.wav");
        this.punchImpactSound = new Audio("assets/sounds/punch_impact.wav");
        this.jumpSound = new Audio("assets/sounds/jump.wav");
        this.coinCollectedSound = new Audio("assets/sounds/coin_collected.wav");
        this.projectileLaunchSound = new Audio("assets/sounds/projectile_launch.wav");
        this.projectileImpactSound = new Audio("assets/sounds/projectile_impact.mp3");
        this.playerHitSound = new Audio("assets/sounds/player_hit.mp3");
        this.walkSound = new Audio("assets/sounds/walk.wav");
        this.doorOpenSound = new Audio("assets/sounds/door_open.ogg");
         
        this.playStateSongs = [this.forestSong, this.ruinsSong, this.cryptSong, this.cemeterySong];
        //ARRAY OF ALL SONGS
        this.songs = [this.menuSong, ...this.playStateSongs, this.winSong];
        //ARRAY OF ALL SOUNDS
        this.sounds = [this.buttonClickSound, this.buttonHoverSound, this.coinCollectedSound, this.projectileLaunchSound, this.walkSound];
        //REDUCE VOLUME AT STARTUP, UNLESS OTHERWISE SPECIFIED BY USER
        this.songs.forEach(song=>{song.volume = 0.2;});
        this.sounds.forEach(sound=>{sound.volume = 0.1});
        this.onHover();
        this.onClick();
    }
    
    onHover(){
        ui.buttons.forEach(btn=>{
            btn.addEventListener("hover", ()=>{
                this.play(this.buttonHoverSound);
            })
        })
    }
    
    onClick(){
        ui.buttons.forEach(btn=>{
            btn.addEventListener("click", ()=>{
                this.play(this.buttonClickSound);
            })
        }) 
    }
    
    play(audio){
        audio.currentTime = 0;
        audio.play();
    }
    
    stop(audio){
        audio.currentTime = 0;
        audio.pause();
    }
    stopAllSongs(){
        this.songs.forEach(song=>{
            song.currentTime = 0;
            song.pause();
        })
    }
    
}

export const audio = new AudioControl();