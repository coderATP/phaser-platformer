import {myInput} from "../myInput.js";
import { Projectiles } from "../groups/Projectiles.js";
import { PlayerHealthbar } from "../hud/Healthbar.js";
import { ImageEffect } from "../effects/HitEffect.js";
import { audio } from "../audio/AudioControl.js";
import { PlayerWalk, PlayerStateMachine } from "../states/PlayerStates.js";


export class Player extends Phaser.Physics.Arcade.Sprite{
    //state design
    static Status = {
            Walking: 1,
            Climbing: 2,
            Jumping: 3,
            Falling: 4
    } 
    constructor(scene, x, y, texture){
        super(scene, x, y, texture);
        
        this.scene = scene;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.init();
        this.status = Player.Status.Walking;
        
    }
    
    
    init(){
        this.scene.events.on("update", this.update, this);
        this.name = "player";
        this.speedX = 120;
        this.speedY = 350;
        this.stateMachine = new PlayerStateMachine(this);
        this.currentState = new PlayerWalk(this);
        
        this.onLadder = false;
        this.canClimbDown = false;
        this.canClimbUp = false;
        this.jumpCount = 0;
        this.maxJumps = 1;
        this.walkSoundCounter = 0;
        this.walkSoundInterval = 350;
        this.maxHealth = 100;
        this.health = this.maxHealth;
        this.hasBeenHit = false;
        this.hitEffect = null;
        this.isDead = false;
        this.damage = 10;
        this.lastDirection = "left";
        this.projectiles = new Projectiles(this.scene, "iceball");
        
        this
            .setOrigin(0.5, 1)
            .setSize(15, 40)
            .setOffset(this.width*0.4, this.height*0.4)
            .setScale(0.5)
            .setDepth(100)
            .setGravityY(982)
            .setCollideWorldBounds(true);
            
        this.healthbar = new PlayerHealthbar(this.scene, this);
    }
    
    addCollider(otherGameObject, callback){
        this.scene.physics.add.collider(this, otherGameObject, callback, null, this);
    }
    
    setStatus(newStatus){
        this.status = newStatus;
    }
    
    addCollider(otherGameObject, callback){
        this.scene.physics.add.collider(this, otherGameObject, callback, null, this);
    }
    
    addOverlap(otherGameObject, callback){
        this.scene.physics.add.overlap(this, otherGameObject, callback, null, this);
    }
    
    onEnemyLanded(enemy){
        if(this.body.touching.down || this.body.blocked.down){
            this.decreaseHealth(enemy);
            this.playDamageTween(enemy);
            audio.play(audio.playerHitSound);
            this.lastDirection === "left" ? this.setVelocityX(this.speedX) : this.setVelocityX(-this.speedX);
        }
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
                    this.isDead = true;
                    this.setVelocity(0, -200);
                    this.body.checkCollision.none = true;
                    this.setCollideWorldBounds(false);
                    //then destroy player
                }
            }
        })
    }
    
    playDamageTween(source){
        //send player in opposite direction when taking damage
        source.flipX ? this.setVelocityX(-this.speedX*1) : this.setVelocityX(this.speedX*1);
        this.setVelocityY(-this.speedY);
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
    
   handleAnimations(){
       
       if(this.body.onFloor()){
           this.body.velocity.x === 0 ?
            this.play("player-idle", true) : this.play("player-run", true);
       }
       else{
           this.body.velocity.y < 0 && this.play("player-jump", true);
           this.body.velocity.y > 0 && this.play("player-fall", true);
       }
       //on ladder
       this.onLadder && this.play('player-idle', true);
   }
   
   shoot(key, anim){
       if(this.hasBeenHit) return;
       const projectile = this.projectiles.getFreeProjectile();
       if(projectile){
           projectile.key = key;
           projectile.fire(this, this.getCenter().x, this.getCenter().y, anim);
           audio.play(audio.projectileLaunchSound);
       }
   }
   
   handleShooting(){
       if(this.hasBeenHit) return;
        //shoot
        if(myInput.keys[0] === "rangedShot" && myInput.keypressed){
            this.shoot("iceball", "ice");
            myInput.keypressed = false;
        }
        else if(myInput.keys[0] === "special" && myInput.keypressed){
            this.shoot("fireball", "fire");
            myInput.keypressed = false;
        }
          
   }
   
   playWalkSound(delta){
       if(this.body.velocity.y !== 0 && this.body.velocity.x !== 0) return;
       if(this.walkSoundCounter < this.walkSoundInterval){
           this.walkSoundCounter+= delta;
       }
       else{
           this.walkSoundCounter = 0;
           audio.play(audio.walkSound);
       }
   }
   
    update(time, delta){
        super.update(time, delta );
        
        if(!this.body) return;
        this.stateMachine.updateState(this.currentState, time, delta);
        this.healthbar.draw();
        this.handleAnimations();
        this.handleShooting();
        
        //SETTING PLAYER Hitbox
        this.lastDirection = this.flipX ? "left" : "right";
        
        //hit effect
        this.hitEffect&& this.hitEffect.updatePosition(this);
    }
}