import { Enemy } from "/src/entities/Enemy.js"
import { Projectiles } from "/src/groups/Projectiles.js"

export class Snaky extends Enemy{
    constructor(scene, x, y){
        super(scene, x, y, "birdman");
        
        this.scene = scene;
    }
    
    init(){
        super.init();
        this.speed = 40;
        this.setVelocityX(this.speed);
        this.projectiles = new Projectiles(this.scene, "fireball-1");
        this.attackTimer = 0;
        this.attackInterval = Phaser.Math.Between(1000, 4000);
        this.attackUpdated = false;
        this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT;
        
        this.setOffset(10, 20)
    }
    
    delayAttack(delta){
        if(!this.body) return;
        if(this.attackTimer < this.attackInterval){
            this.attackTimer+= delta;
            this.attackUpdated = false;
        }
        else{
            this.attackTimer = 0;
            this.attackInterval = Phaser.Math.Between(1000, 4000);
            this.attackUpdated = true;
        }
    }
    
    shoot(){
        const projectile = this.projectiles.getFreeProjectile();
        if(projectile) projectile.fire(this, "fireball");
    }
    
    update(time, delta){
        super.update(time, delta);
        
        if(!this.active || this.isAnimPlaying("snaky-hurt")) { return; }
        
        this.delayAttack(delta);
        this.play("snaky-walk", true);
        
        //shoot projectile
        if(this.attackUpdated) { this.shoot(); }
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
        this.play("snaky-hurt", true);
    }

}