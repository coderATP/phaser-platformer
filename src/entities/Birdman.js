import { Enemy } from "/src/entities/Enemy.js"

export class Birdman extends Enemy{
    constructor(scene, x, y){
        super(scene, x, y, "birdman");
        
        this.scene = scene;
    }
    
    update(time, delta){
        super.update(time, delta);
        
        if(!this.active || this.isAnimPlaying("birdman-hurt")) { return; }
        this.play("birdman-idle", true);
        
    }
    
    takesHitFrom(weapon){
        super.takesHitFrom(weapon);
        this.playDamageTween();
    }
    
    playDamageTween(){
        if(!this.active) { return; }
        this.scene.tweens.add({
            targets: this,
            duration: 500,
            tint: 0xff0000,
            onComplete: ()=>{
                this.clearTint();
            }
        })
        this.play("birdman-hurt", true);
    }

}