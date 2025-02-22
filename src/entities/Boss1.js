import { Boss1Idle, Boss1BlueHeadStrike, Boss1PurpleHeadStrike, Boss1RunningStrike, Boss1Run, Boss1Walk, Boss1Dead, Boss1Hurt, Boss1Bite, Boss1StateMachine } from "../states/Boss1States.js";
import { ImageEffect } from "../effects/HitEffect.js";

export class Boss1 extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y){
        super(scene, 100, 50, "boss1-idle");
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.config = scene.config;
        
        this.init();
        this
            .setOrigin(0)
            
            .setDepth(scene.player.depth || 200)
            .setGravityY(980)
            .setCollideWorldBounds(true)
            .setImmovable(true)
            .setBounce(0, 0)
            .setSize(40, 40)
            .setOffset(46, 56)
            
    }
    
    addCollider(otherGameObject, callback){
        if(!otherGameObject) return;
        this.scene.physics.add.collider(this, otherGameObject, callback, null, this);
    }
    
    init(){
        this.speedX = 25;
        this.speedY = 240;
        this.health = 10;
        this.currentState;
        this.damage;
        this.stateMachine = new Boss1StateMachine(this);
        this.stateMachine.setState(new Boss1Idle(this));
        this.setVelocityY(-this.speedY)
        this.initEvents();
        this.addCollider(this.scene.mapLayers.collisionblocks)
    }
    initEvents(){
        this.scene.events.on("update", this.update, this);
    }
    
    withinBattleRange(){
        //battle range is 200 viewport width to player's position
        const battleRange = { x: 250, y: 100 };
        if(!this.body || !this.scene.player.body) return;
        return( 
            Math.abs( (this.body.right - this.scene.player.body.left) ) < battleRange.x ||
            Math.abs( (this.body.left - this.scene.player.body.right) ) < battleRange.x
        );
    }
    withinStrikeRangeX(){
        //attack range is for melee/sword: 45 viewport width to player's position
        if(!this.body || !this.scene.player.body) return;
        const attackRange = {x: 38, y: 38};
        return (Math.abs(this.scene.player.body.right - this.body.left) <= attackRange.x || Math.abs(this.scene.player.body.left - this.body.right) <= attackRange.x );
    }
    
    withinStrikeRangeY(){
        //attack range is for melee/sword: 45 viewport width to player's position
        if (!this.body || !this.scene.player.body) return;
        const attackRange = { x: 38, y: 38 };
        return (Math.abs(this.scene.player.body.top - this.body.bottom) <= attackRange.y || Math.abs(this.scene.player.body.bottom - this.body.top) <= attackRange.y );
    }
    toTheRightOfPlayer(){
        if(!this.body || !this.scene.player.body) return;
        return this.body.left >= this.scene.player.body.right;
    }
    
    decreaseHealth(source){
        this.hasBeenHit = true;
        this.scene.tweens.add({
            targets: this,
            health: this.health - source.damage,
            duration: 800,
            repeat: 0,
            onComplete: ()=>{
                this.hasBeenHit = false;
                if(this.health <= 0 ){
                    this.stateMachine.setState(new Boss1Dead(this));
                }
            }
        })
    }
    
    playDamageTween(source){
        //send player in opposite direction when taking damage
        this.setVelocity(0, -this.speedY)
        this.stateMachine.setState(new Boss1Hurt(this));
        //play hit effect on player when taking damage
        const target = this;
        if (source.texture.key === "fireball"){
            this.hitEffect = new ImageEffect(this.scene, 0 , 0, "fireball-impact");
            this.hitEffect.playAnimationOn(target, source, "fire-impact"); 
        }
        else if(source.texture.key === "iceball"){
            this.hitEffect = new ImageEffect(this.scene, 0, 0, "iceball-impact");
            this.hitEffect.playAnimationOn(target, source, "ice-impact");
        }
        
    } 
    cleanupAfterDeath(){
        if(this.body&& this.body.y > this.config.height ){
            this.destroy();
        }
    } 
    
    update(time, delta){
        super.update(time, delta);
        if(!this.body) return;
        this.cleanupAfterDeath()
        this.stateMachine.updateState(this.currentState, time, delta);
    }
}
