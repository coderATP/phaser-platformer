import { ParticleEffect } from "/src/entities/Particles.js";


export class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, key) {
        super(scene, x, y, key);
        this.scene = scene;
        this.config = scene.config;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        
        this.init();
    }

    init() {
        this.speed = 85;
        this.gravity = 980;
        this.rayGraphics = this.scene.add.graphics({lineStyle: { width: 1, color: "0xaa00aa"}});
        this.hasHit = false;
        this.bodyPositionDiff = 0;
        this.platformCollidersLayer = null;
        this.turnTimer = 0;
        this.turnInterval = 100; //ms
        
        this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT;
        
        this.setOrigin(0.5, 1);
        this.body.setGravityY(this.gravity);
        this.body.setVelocityX(this.speed);
        
        this.setCollideWorldBounds(true);
        this.setImmovable();
        //adjust hitbox
        this.setSize(this.width - 18, this.height - 22);
        this.setOffset(12, 22);
        this.initEvents();
        
        //damage / health / hp
        this.health = 20;
        this.damage = 10;
    }
    
    //initialise update cycle
    initEvents(){
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }
    
    //check if a particular animation is currently playing
    isAnimPlaying(animKey) {
        return (this.scene.anims.isPlaying &&
            this.scene.anims.getCurrentKey() == animKey);
    }
    
    addCollider(otherGameObject, callback) {
        this.scene.physics.add.collider(this, otherGameObject, callback, null, this);
    }
    
    castRay(rayLength = 30, steepness = 0.3){
        this.ray = new Phaser.Geom.Line();
        
        //flip ray according to where body is currently facing
        switch (this.body.facing) {
            case Phaser.Physics.Arcade.FACING_RIGHT:
            {
                this.ray.x1 = this.body.x + this.body.width;
                this.ray.y1 = this.body.y + this.body.halfHeight;
                this.ray.x2 = this.body.x + this.body.width + rayLength * steepness;
                this.ray.y2 = this.body.y + this.body.halfHeight + rayLength;
                break;
            }
            case Phaser.Physics.Arcade.FACING_LEFT:
            {
                this.ray.x1 = this.body.x;
                this.ray.y1 = this.body.y + this.body.halfHeight;
                this.ray.x2 = this.body.x - rayLength * steepness;
                this.ray.y2 = this.body.y + this.body.halfHeight + rayLength;
                break;
            }
        }
        if(this.config.debug){
            this.rayGraphics.clear();
            this.rayGraphics.strokeLineShape(this.ray);
        }
    }
    
    detectPlatformCollisionWithRay(){
        this.hasHit = false;
        
        const tilesInCollision = this.scene.layers.platformsColliders.getTilesWithinShape(this.ray);
        
        if(tilesInCollision.length > 0){
            this.hasHit = tilesInCollision.some(tile=> tile.index !== -1);
        }
    }
    
    optimiseRaycast(lagTime = 3){
        this.bodyPositionDiff += Math.abs(this.body.x - this.body.prev.x);
        
        const lagTimeElapsed = this.bodyPositionDiff > lagTime;
        
        if (lagTimeElapsed) { 
            this.bodyPositionDiff = 0;
            this.castRay();
        }
    }
    
    turnAround(delta){
        this.turnTimer += delta;
        if(!this.hasHit  && this.turnTimer > this.turnInterval ){
           this.setVelocityX(this.speed = -this.speed);
           this.body.facing=== Phaser.Physics.Arcade.FACING_LEFT ?
                this.setFlipX(false) : this.setFlipX(true);
           this.turnTimer = 0;
        }
    }
    
    takesHitFrom(weapon){
        this.health -= (weapon.damage ? weapon.damage : weapon.properties.damage);
        const effect = new ParticleEffect(this.scene, this.getCenter().x, weapon.getCenter().y, "projectile-hit-sheet", weapon);
        effect.playAnimationOn(this, "projectile-hit-enemy");
        this.cleanupWhenDead()
    }
    
    cleanupWhenDead(){
        if(this.health <= 0){
            this.rayGraphics.clear();
            this.setVelocity(0, -200);
            this.body.checkCollision.none = true;
            this.setCollideWorldBounds(false);
        }
    }
    
    update(time, delta){

        if(this.getBounds().bottom > 600){
            this.scene.events.removeListener(Phaser.Scenes.Events.UPDATE, this.update, this);
            
            this.setActive(false);
            this.destroy();
        }
        if(this.active){
            this.lastDirection = this.body.facing;
         
            this.optimiseRaycast();
            this.detectPlatformCollisionWithRay();
            this.turnAround(delta); 
        }
    }
    
}