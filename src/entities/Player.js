import {myInput} from "../myInput.js";
import { Projectiles } from "../groups/Projectiles.js";
import { PlayerHealthbar } from "../hud/Healthbar.js";
import { ImageEffect } from "../effects/HitEffect.js";
import { audio } from "../audio/AudioControl.js";
import { PlayerWalk, PlayerCrouch, PlayerCrouchWalk, PlayerStateMachine } from "../states/PlayerStates.js";
import { drawStatus } from "../hud/Status.js";


export class Player extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, texture){
        super(scene, x, y, texture);
        this.scene = scene;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.init();
        this.status;
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
        this.gravity = 982;
        
        this
            .setOrigin(0.5, 1)
            .setSize(15, 35) //body height
            .setOffset(this.width*0.4, this.height*0.55)
            .setScale(0.8) //display height
            .setDepth(100)
            .setGravityY(this.gravity)
            .setCollideWorldBounds(true);
            
        this.healthbar = new PlayerHealthbar(this.scene, this);
    }
    
    updateBoundingBox(){

        if(this.currentState.name === "PlayerCrouch" || this.currentState.name == "PlayerCrouchWalk" ){
            this.setSize(15, 22)
            if(this.flipX) this.setOffset(this.width*0.48, this.height*0.72)
            else this.setOffset(this.width*0.4, this.height*0.72); 
        }
        else if(this.currentState.name === "PlayerSlide"  ){
            this.setSize(15, 15)
            if(this.flipX) this.setOffset(this.width*0.48, this.height*0.72)
            else this.setOffset(this.width*0.4, this.height*0.82); 
        } 
        else{
            this.setSize(15, 35)
            if(this.flipX) this.setOffset(this.width*0.48, this.height*0.55)
            else this.setOffset(this.width*0.4, this.height*0.55);
        }
    }
    addCollider(otherGameObject, callback){
        this.scene.physics.add.collider(this, otherGameObject, callback, null, this);
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
            duration: 400,
            repeat: 0,
            onComplete: ()=>{
                this.hasBeenHit = false;
                this.setVelocity(0, 0);
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
    
   
   shoot(key, anim){
       if(this.hasBeenHit) return;
       const projectile = this.projectiles.getFreeProjectile();
       if(projectile){
           projectile.key = key;
           projectile.fire(this, this.body.center.x, this.body.center.y, anim);
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
   
   jump(){
       this.body.setAllowGravity(true);
       this.body.gravity.y = this.gravity;
       this.setVelocityY(-this.speedY);
   }
   intersects(rectangleBody, triangle){
       return Phaser.Geom.Intersects.RectangleToTriangle(rectangleBody.getBounds(), triangle);
   }

   handleIntersection(){
       const { horizontal_bodies, left_slopes, left_bodies, right_slopes, right_bodies } = this.scene.grounds;
       //left
       left_bodies.forEach(body=>{
           if(this.scene.physics.world.intersects(this.body, body)){
               left_slopes.forEach(slope=>{
                   if(this.intersects(this, slope)){
                       if(myInput.keys[0] === "up") { this.jump(); }
                       else{
                            if(myInput.keys[0] !== "right" && myInput.keys[0] !== "ArrowRight"){
                                this.body.position.x -= 0.6; //auto slide
                                this.setFlipX(true);
                            } 
                           const dX = this.body.right - body.left;
                           this.body.position.y = body.bottom - this.body.height - dX;
                           this.body.setAllowGravity(false);
                       }
                   }
               })
           }
           else{
               this.body.setAllowGravity(false);
           }
       })
       //right
       right_bodies.forEach(body=>{
           if(this.scene.physics.world.intersects(this.body, body)){
               right_slopes.forEach(slope=>{
                   if(this.intersects(this, slope)){
                       if(myInput.keys[0] === "up") { this.jump(); }
                       else{
                            if(myInput.keys[0] !== "left" && myInput.keys[0] !== "ArrowLeft"){
                                this.body.position.x += 0.6; //auto slide
                                this.setFlipX(false);
                            } 
                           const dX = body.right - this.body.left;
                           this.body.position.y = body.bottom - this.body.height - dX;
                           this.body.setAllowGravity(false);
                       }
                   }
               })
           }
           else{
               this.body.setAllowGravity(false);
           }
       }) 
   }
   
    update(time, delta){
        if(!this.body) return;
        super.update(time, delta);
        this.handleIntersection()
        this.stateMachine.updateState(this.currentState, time, delta);
        this.healthbar.draw();
        this.handleShooting();
        this.updateBoundingBox()
        //SETTING PLAYER Hitbox
        this.lastDirection = this.flipX ? "left" : "right";
        
        //hit effect
        this.hitEffect&& this.hitEffect.updatePosition(this);
    }
}

