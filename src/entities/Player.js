import {myInput} from "../myInput.js";
import { Projectiles } from "../groups/Projectiles.js";
import { PlayerHealthbar, PlayerEnergybar } from "../hud/Healthbar.js";
import { Scoreboard } from "../hud/Scoreboard.js";
import { ImageEffect } from "../effects/HitEffect.js";
import { audio } from "../audio/AudioControl.js";
import { PlayerWalk, PlayerCrouch, PlayerCrouchWalk, PlayerStateMachine } from "../states/PlayerStates.js";
import { Status } from "../hud/Status.js";
import { Sword } from "../entities/Sword.js";
import { Coins } from "../groups/Coins.js";

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
        this.speedX = 130;
        this.speedY = 350;
        this.stateMachine = new PlayerStateMachine(this);
        this.currentState = new PlayerWalk(this);
        
        this.isOnSlope = false;
        this.updatedBounds = undefined;
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
        this.immuneToDamage = undefined;
        this.damage = 10;
        this.lastDirection = "left";
        this.projectiles = new Projectiles(this.scene, "iceball");
        this.gravity = 982;
        this.score = 0;
        this.scoreboard = new Scoreboard(this.scene);
        this.scoreboard.draw(this.score);
        
        this
            .setOrigin(0.5, 1)
            .setSize(15, 35) //body height
            .setOffset(this.width*0.4, this.height*0.55)
            .setScale(0.8) //display height
            .setDepth(100)
            .setGravityY(this.gravity)
            .setCollideWorldBounds(true);
        //HUD
        this.healthbar = new PlayerHealthbar(this.scene, this);
        this.energybar = new PlayerEnergybar(this.scene, this);
        
        this.status = new Status(this.scene);
        this.status.draw();
        //sword
        this.sword = new Sword(this.scene, this);
        //collectible coins
        this.coins = new Coins(this.scene, 'gold-coin');

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
    
    increaseScore(amount){
        this.score += amount;
    }
    playCoinCollectSound(){
        audio.play(audio.coinCollectedSound);
    }
    onEnemyLanded(enemy){
        if(this.body.touching.down || this.body.blocked.down){
            this.decreaseHealth(enemy);
            this.playDamageTween(enemy);
            audio.play(audio.playerHitSound);

            this.lastDirection === "left" ? this.setVelocityX(this.speedX) : this.setVelocityX(-this.speedX);
        }
    }
    
    decreaseHealth(source, factor = 1){
        this.hasBeenHit = true;
        this.scene.tweens.add({
            targets: this,
            health: this.health - source.damage * factor,
            duration: 400,
            repeat: 0,
            onComplete: ()=>{
                this.hasBeenHit = false;
                this.setVelocity(0, 0);
                if(this.health <= 0 ){
                    this.sendToGrave();
                }
            }
        })
    }
    sendToGrave(){
        this.isDead = true;
        this.setVelocity(0, -200);
        this.body.checkCollision.none = true;
        this.setCollideWorldBounds(false);
    }
    playDamageTween(source){
        //send player in opposite direction when taking damage
        source.flipX ? this.setVelocityX(-this.speedX*1) : this.setVelocityX(this.speedX*1);
        this.setVelocityY(-this.speedY*0.5);
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
           projectile.fire(this, this.body.center.x, this.body.center.y, anim, 200);
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
    intersects(rectangleBounds, triangle){
       return Phaser.Geom.Intersects.RectangleToTriangle(rectangleBounds, triangle);
   }
    handleSlopes(){
        if(!this.scene.grounds) return;
        const { left_slopes, left_bodies, right_slopes, right_bodies } = this.scene.grounds;
        this.isOnSlope = false;
        if(!this.isOnSlope) this.body.setAllowGravity(true);
        
        left_bodies.forEach(body=> {
            if(this.scene.physics.world.intersects(this.body, body.body)){
                left_slopes.forEach(slope=>{
                    if(this.intersects(new Phaser.Geom.Rectangle(this.body.x, this.body.y, this.body.width, this.body.height), slope) ){
                        this.isOnSlope = true;
                        //if(myInput.keys[0] === "up") { this.jump() }
                        {
                            const dX = this.body.right - body.body.left;
                            this.body.position.y = body.body.bottom - this.body.height - dX;
                            this.body.setAllowGravity(false);
                        }
                    }
                    else{
                        this.body.setAllowGravity(true)
                    }
                })
            }
        })
        right_bodies.forEach(body=> {
            if(this.scene.physics.world.intersects(this.body, body.body)){
                right_slopes.forEach(slope=>{
                    if(this.intersects(new Phaser.Geom.Rectangle(this.body.x, this.body.y, this.body.width, this.body.height), slope) ){
                        this.isOnSlope = true;
                        //if(myInput.keys[0] === "up") { this.jump() }
                        {
                            const dX = this.body.left - body.body.right;
                            this.body.position.y = body.body.bottom - this.body.height + dX;
                            this.body.setAllowGravity(false);
                        }
                    }
                    else{
                        this.body.setAllowGravity(true);
                    }
                })
            }
        }) 
    }
    checkSwordIntersection(){
       if(!this.scene.enemies) return;
       let isIntersecting = false;
       let victim = undefined;
       
       this.scene.enemies.getChildren().forEach(enemy=>{
           const enemyBounds ={
               x: enemy.body.x,
               y: enemy.body.y,
               width: enemy.body.width,
               height: enemy.body.height
            }
           if(Phaser.Geom.Intersects.RectangleToRectangle(
               new Phaser.Geom.Rectangle(enemy.body.x, enemy.body.y, enemy.body.width, enemy.body.height), this.sword.swordObject)){
               isIntersecting = true;
               victim = enemy;
           }
       })
       return {isIntersecting, victim}
   }
    
    update(time, delta){
        if(!this.body) return;
        super.update(time, delta);
        this.handleSlopes();
        
        this.stateMachine.updateState(this.currentState, time, delta);
        this.healthbar.draw();
        this.energybar.draw();
        this.status.update(this.currentState, myInput.lastKey);
        this.handleShooting();
        this.updateBoundingBox();
        this.scoreboard.update(this.score);
        
        //SETTING PLAYER Hitbox
        this.lastDirection = this.flipX ? "left" : "right";
        //sword
        this.sword.draw(this);
        //hit effect
        this.hitEffect&& this.hitEffect.updatePosition(this);
    }
}

