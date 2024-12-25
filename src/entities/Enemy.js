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
        this.gravity = 982;
        this.speedX = 25;
        this.rayGraphics = this.scene.add.graphics({lineStyle: { width: 1, color: "0xffffff"}});
        this.sensorGraphics = this.scene.add.graphics({lineStyle: { width: 1, color: "0x0000aa"}});
         
        this.bodyPositionDiff = 0;
        this.hasHit;
        this.turnTimer = 0;
        this.turnInterval = 100;
        
        this
            .setOrigin(0.5,1)
            .setSize(10, 26)
            .setDepth(10)
            .setVelocityX(-this.speedX)
            .setGravityY(this.gravity)
            .setImmovable()
            
        this.scene.events.on("update", this.update, this);
    }
    
    createSensors(){
        
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
                this.setOffset(this.width*0.3, this.height*0.3);
            }
        }
    }
    
    castSensors(rayLength = 3){
        this.sensors = {
            horizontal: new Phaser.Geom.Line(),
            vertical: new Phaser.Geom.Line()
        };
        
        switch (this.body.facing) {
            case Phaser.Physics.Arcade.FACING_RIGHT:
            {
                this.sensors.horizontal.x1 = this.body.x + this.body.width;
                this.sensors.horizontal.y1 = this.body.y + this.body.halfHeight;
                this.sensors.horizontal.x2 = this.body.x + this.body.width + rayLength;
                this.sensors.horizontal.y2 = this.body.y + this.body.halfHeight;
                break;
            }
            case Phaser.Physics.Arcade.FACING_LEFT:
            {
                this.sensors.horizontal.x1 = this.body.x;
                this.sensors.horizontal.y1 = this.body.y + this.body.halfHeight;
                this.sensors.horizontal.x2 = this.body.x - rayLength;
                this.sensors.horizontal.y2 = this.body.y + this.body.halfHeight;
                break;
            }
        }
    }
    
    //RAY CASTING FOR TURNING
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
    }
     
    detectPlatformCollisionWithRay(){
        if(!this.scene) return;
        
        this.hasHit = false;
        this.sensorHasHit = false;
        
        const tilesInCollisionWithRay = this.scene.mapLayers.collisionblocks.getTilesWithinShape(this.ray);
        const tilesInCollisionWithSensor = this.scene.mapLayers.collisionblocks.getTilesWithinShape(this.sensors.horizontal);
         
        if(tilesInCollisionWithRay.length > 0){
            this.hasHit = tilesInCollisionWithRay.some(tile=> tile.index !== -1);
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
    
    turnAround(delta){
        this.turnTimer += delta;
        //RAY 
        if(!this.hasHit  && this.turnTimer > this.turnInterval ){
           this.setVelocityX(this.speedX = -this.speedX);
           this.body.facing=== Phaser.Physics.Arcade.FACING_LEFT ?
                this.setFlipX(false) : this.setFlipX(true);
           this.turnTimer = 0;
        }
        //SENSOR
        if(this.sensorHasHit  && this.turnTimer > this.turnInterval ){
           this.setVelocityX(this.speedX = -this.speedX);
           this.body.facing=== Phaser.Physics.Arcade.FACING_LEFT ?
                this.setFlipX(false) : this.setFlipX(true);
           this.turnTimer = 0;
        } 
    }
     
    create(){
        
    }
    
    update(time, delta){
        
        this.handleAnimations();
        this.optimiseRaycast();
        this.detectPlatformCollisionWithRay();
        
        if (this.config.debug) {
            this.rayGraphics.clear();
            this.rayGraphics.strokeLineShape(this.ray);
            this.rayGraphics.strokeLineShape(this.sensors.horizontal);
        }
        this.turnAround(delta);
        
    }
}