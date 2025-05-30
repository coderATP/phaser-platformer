import { ENEMY_STATES, EnemyStateMachine } from "../states/EnemyStates.js";
import { Projectiles } from "../groups/Projectiles.js";
import { EnemyHealthbar } from "../hud/Healthbar.js";
import { ImageEffect } from "../effects/HitEffect.js";


export class Enemy extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, texture){
        super(scene, x, y, texture);
        this.scene = scene;
        this.config = scene.config;
        this.texture = texture;
        this.name = texture;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.init();
    }
    
    init(){
        
        this.health = 30;
        this.maxHealth = this.health;
        this.damage = 5;
        this.gravity = 982;
        this.speedX = 25;
        this.speedY = 300;
        this.rayGraphics = this.scene.add.graphics({lineStyle: { width: 1, color: "0xffffff"}});
        this.sensorGraphics = this.scene.add.graphics({lineStyle: { width: 1, color: "0x0000aa"}});

        this.lastDirection = "right";
        this.hasBeenHit = false;
        this.bodyPositionDiff = 0;
        this.rayHasHit;
        this.immuneToDamage = undefined;
        this.turnTimer = 0;
        this.turnInterval = 100;
        this.shootTimer = 0;
        this.shootInterval = Phaser.Math.Between(1500, 4000);
        this
            .setOrigin(0.5,1)
            .setSize(10, 26)
            .setDepth(20)
            .setGravityY(this.gravity)
            .setImmovable(true)
            .setCollideWorldBounds(true);
            
        //healthbar
        this.healthbar = new EnemyHealthbar(this.scene, this);
        this.healthbar.graphics.depth = this.depth;
        
        //states
        this.stateMachine = new EnemyStateMachine();
        this.currentState = ENEMY_STATES.IDLE;
        //hit effect
        this.hitEffect = null;
        //projectiles
        this.projectiles = new Projectiles(this.scene, "fireball");
        //coins
        this.coins = null;
        this.scene.events.on("update", this.update, this);
    }

    decreaseHealth(source, factor = 1){
        if(!this.body || !this.scene.player) return;
        this.hasBeenHit = true; 
        this.scene.tweens.add({
            targets: this,
            health: this.health - source.damage*factor,
            duration: 100,
            repeat: 0,
            onComplete: ()=>{
                this.hasBeenHit = false;
            }
        })
    }
    
    sendToGrave(){
        this.setVelocity(0, -200);
        this.body.checkCollision.none = true;
        this.setCollideWorldBounds(false); 
    }
    
    playDamageTween(source){
        const target = this;
        if (source.texture.key === "fireball"){
            this.hitEffect = new ImageEffect(this.scene, 0 , 0, "fireball-impact");
            this.hitEffect.playAnimationOn(target, source, "fire-impact"); 
        }
        else if(source.texture.key === "iceball"){
            this.hitEffect = new ImageEffect(this.scene, 0, 0, "iceball-impact");
            this.hitEffect.playAnimationOn(target, source, "ice-impact");
        }

        this.hasBeenHit = true;
        this.scene.tweens.add({
            targets: this,
            tint: 0x0000ff,
            duration: 2000,
            repeat: 0,
            onComplete: ()=>{
                this.clearTint();
                this.hasBeenHit = false;
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
            this.projectiles.getChildren().forEach(projectile=>{
                projectile.destroy();
                projectile = null;
            });
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
            if(projectile) projectile.fire(this, this.body.center.x, this.body.center.y, "fire", 60);
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
        
        this.optimiseRaycast();
        this.detectPlatformCollisionWithRay();
        
        if (this.config.debug&& this.rayGraphics) {
            this.rayGraphics.clear();
            this.rayGraphics.strokeLineShape(this.ray);
            this.rayGraphics.strokeLineShape(this.sensors.horizontal);
        }
        this.stateMachine.updateState(this.currentState, this, time, delta);
        
        this.cleanupAfterDeath();
        this.hitEffect&& this.hitEffect.updatePosition(this);
    }
}