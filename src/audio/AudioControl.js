import { ui } from "../ui.js";


class AudioControl{
    constructor(){
        this.menuSong = new Audio("assets/sounds/menu_song.mp3");
        this.forestSong = new Audio("assets/sounds/forest_song.mp3");
        this.ruinsSong = new Audio("assets/sounds/ruins_song.mp3");
        this.winSong = new Audio("assets/sounds/win_song.wav");
        
        this.buttonClickSound = new Audio("assets/sounds/button_hover_sound.wav");
        this.buttonHoverSound = new Audio("assets/sounds/button_sound.wav");
        this.playStateSongs = [this.forestSong, this.ruinsSong];
        //ARRAY OF ALL SONGS
        this.songs = [this.menuSong, ...this.playStateSongs, this.winSong];
        this.songs.forEach(song=>{song.volume = 0.5;})
        //ARRAY OF ALL SOUNDS
        //this.sounds = [this.buttonSound, this.buttonHoverSound, this.coinSound];
        
        
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
    
}

export const audio = new AudioControl();