import { ENEMY_STATES, EnemyStateMachine } from "../states/EnemyStates.js";
import { Projectiles } from "../groups/Projectiles.js";
import { EnemyHealthbar } from "../hud/Healthbar.js";
import { ImageEffect } from "../effects/HitEffect.js";

export class Enemy extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, texture){
        super(scene, x, y, texture);
        this.scene = scene;
        this.config = scene.config;
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.init()
    }
    
    init(){
        this.health = 30;
        this.isDead = false;
        this.gravity = 982;
        this.speedX = 25;
        this.rayGraphics = this.scene.add.graphics({lineStyle: { width: 1, color: "0xffffff"}});
        this.sensorGraphics = this.scene.add.graphics({lineStyle: { width: 1, color: "0x0000aa"}});

        this.lastDirection = "right";
        this.hasBeenHit = false;
        this.bodyPositionDiff = 0;
        this.rayHasHit;
        this.turnTimer = 0;
        this.turnInterval = 100;
        this.shootTimer = 0;
        this.shootInterval = Phaser.Math.Between(1500, 4000);
        this
            .setOrigin(0.5,1)
            .setSize(10, 26)
            .setDepth(10)
            .setGravityY(this.gravity)
            .setImmovable(true);
            
        //healthbar
        this.healthbar = new EnemyHealthbar(this.scene, this);
        //states
        this.enemyStateMachine = new EnemyStateMachine();
        this.currentState = ENEMY_STATES.RUN;
        //hit effect
        this.hitEffect;
        //projectiles
        this.projectiles = new Projectiles(this.scene, "fireball");
        
        this.scene.events.on("update", this.update, this);
    }
    

    //ANIMATIONS
    handleAnimations(){
        if(this.body && this.health > 0 ){
            if(this.body.velocity.x !==0){
                this.play("orc-run", true);
                this.flipX ? this.setOffset(this.width*0.4, this.height*0.58) :
                    this.setOffset(this.width*0.45, this.height*0.58);
            }
            else{
                this.play("orc-idle", true);
                this.setOffset(this.width*0.35, this.height*0.2);
            }
        }
    }

    decreaseHealth(source){
        this.hasBeenHit = true; 
        this.scene.tweens.add({
            targets: this,
            health: this.health - source.damage,
            duration: 100,
            repeat: 0,
            onComplete: ()=>{
                this.hasBeenHit = false; 
                if(this.health <= 0){
                    //this.isDead = true;
                    this.setVelocity(0, -200);
                    this.body.checkCollision.none = true;
                    this.setCollideWorldBounds(false);
                }
            }
        })
    }
    playDamageTween(source){
        const target = this;
        this.hitEffect = new ImageEffect(this.scene, 0 , 0, "fireball-impact");
        this.hitEffect.playAnimationOn(target, source, "fire-impact");
        
        this.scene.tweens.add({
            targets: this,
            tint: 0x0000ff,
            duration: 2000,
            repeat: 0,
            onComplete: ()=>{
                this.clearTint();
            }
        })
    }
    cleanupAfterDeath(){
        if(this.body&& this.body.y > this.config.height ){
            this.healthbar.graphics.preDestroy();
            this.healthbar.graphics = null;
            this.rayGraphics.preDestroy();
            this.rayGraphics = null;
            this.sensorGraphics.preDestroy();
            this.sensorGraphics = null;
            this.destroy();
        }
    }
    
    shootProjectile(delta){
        if(!this.body || this.hasBeenHit) return;
        if(this.shootTimer < this.shootInterval){
            this.shootTimer+= delta;
        }
        else{
            this.shootInterval = Phaser.Math.Between(1500, 4000);
            this.shootTimer = 0;
            const projectile = this.projectiles.getFreeProjectile();
            if(projectile) projectile.fire(this, this.body.center.x, this.body.center.y, "fire");
        }
    }
    
    //SENSORS
    castSensors(rayLength = 3){
        this.sensors = {
            horizontal: new Phaser.Geom.Line(),
            vertical: new Phaser.Geom.Line()
        };
        
        switch (this.lastDirection) {
            case "right":
            {
                this.sensors.horizontal.x1 = this.body.x + this.body.width;
                this.sensors.horizontal.y1 = this.body.y + this.body.halfHeight;
                this.sensors.horizontal.x2 = this.body.x + this.body.width + rayLength;
                this.sensors.horizontal.y2 = this.body.y + this.body.halfHeight;
                this.setFlipX(false);
                break;
            }
            case "left":
            {
                this.sensors.horizontal.x1 = this.body.x;
                this.sensors.horizontal.y1 = this.body.y + this.body.halfHeight;
                this.sensors.horizontal.x2 = this.body.x - rayLength;
                this.sensors.horizontal.y2 = this.body.y + this.body.halfHeight;
                this.setFlipX(true);
                break;
            }
        }
    }
    
    //RAY CASTING FOR TURNING
    castRay(rayLength = 30, steepness = 0.3){
        this.ray = new Phaser.Geom.Line();
        
        //flip ray according to where body is currently facing
        switch (this.lastDirection) {
            case "right" :
            {
                this.ray.x1 = this.body.x + this.body.width;
                this.ray.y1 = this.body.y + this.body.halfHeight;
                this.ray.x2 = this.body.x + this.body.width + rayLength * steepness;
                this.ray.y2 = this.body.y + this.body.halfHeight + rayLength;
                break;
            }
            case "left" :
            {
                this.ray.x1 = this.body.x;
                this.ray.y1 = this.body.y + this.body.halfHeight;
                this.ray.x2 = this.body.x - rayLength * steepness;
                this.ray.y2 = this.body.y + this.body.halfHeight + rayLength;
                break;
            }
        }
    }
     
    detectPlatformCollisionWithRay(){
        if(!this.scene || !this.scene.map) return;
        
        this.rayHasHit = false;
        this.sensorHasHit = false;
        
        const tilesInCollisionWithRay = this.scene.mapLayers.collisionblocks.getTilesWithinShape(this.ray);
        const tilesInCollisionWithSensor = this.scene.mapLayers.collisionblocks.getTilesWithinShape(this.sensors.horizontal);
         
        if(tilesInCollisionWithRay.length > 0){
            this.rayHasHit = tilesInCollisionWithRay.some(tile=> tile.index !== -1);
        }
        if(tilesInCollisionWithSensor.length > 0){
            this.sensorHasHit = tilesInCollisionWithSensor.some(tile=> tile.index !== -1);
        } 
    }
    
    optimiseRaycast(lagTime = 3){
        if(!this.body) return;
        this.bodyPositionDiff += Math.abs(this.x - this.body.prev.x);
        
        const lagTimeElapsed = this.bodyPositionDiff > lagTime;
        
        if (lagTimeElapsed) { 
            this.bodyPositionDiff = 0;
            this.castRay();
            this.castSensors();
        }
    }
     
    update(time, delta){
        super.update(time, delta);
        
        if(this.body) this.healthbar.draw();
        
        this.handleAnimations();
        this.optimiseRaycast();
        this.detectPlatformCollisionWithRay();
       
        if (this.config.debug) {
            this.rayGraphics.clear();
            this.rayGraphics.strokeLineShape(this.ray);
            this.rayGraphics.strokeLineShape(this.sensors.horizontal);
        }
        
        this.enemyStateMachine.updateState(this.currentState, this, time, delta);
        this.shootProjectile(delta);
        this.cleanupAfterDeath();
        this.hitEffect&& this.hitEffect.updatePosition(this);
    }
}