import { audio } from "../audio/AudioControl.js";

export class Coin extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, texture){
        super(scene, x, y, texture);
        this.config = scene.config;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this
            .setOrigin(0)
            .setScale(0.7)
            .setCollideWorldBounds(true)
            .setDepth(scene.player ? scene.player.depth-1 : 200)
        this.init()
    }
    
    addOverlap(otherGameObject, callback){
        this.scene.physics.add.overlap(this, otherGameObject, callback, null, this);
    }
    addCollider(otherGameObject, callback){
        this.scene.physics.add.collider(this, otherGameObject, callback, null, this);
    }
    init(){
        //properties
        this.flightTime = 0;
        this.flightInterval = 512;
        //collider with foreground
        this.addCollider(this.scene.mapLayers.collisionblocks);
        //overlap with player
        this.addOverlap(this.scene.player, this.onCoinCollect);
        //update events
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
        this.speedX = Phaser.Math.Between(-100, 100);
        this.speedY = Phaser.Math.Between(-300, -400);
    
        return this;
    }
    onCoinCollect(source, target){
       // this.destroy();
      this.coinCanFly = true;
      this.initialX = this.body.x;
      this.initialY = this.body.y;
      audio.play(audio.coinCollectedSound);
    }
    
    flyCoin(delta){
        if(!this.coinCanFly || !this.body) return;
        this.body.setAllowGravity(false)
        this.body.x += ( (this.initialX + this.config.width/2) - this.body.x) *0.01;
        this.body.y += ( (this.initialY - this.config.height)- this.body.y) * 0.01;
        
        this.cleanUpAfterFlight(delta);
    }
    
    cleanUpAfterFlight(delta){
        this.flightTime+= delta;
        if(this.flightTime >= this.flightInterval){ this.destroy(true); console.log("deleted") }
    }
    
    updateMotion(){
       if(!this.body) return;
       if(this.body.onFloor()){
           this.setVelocityX(0);
       }
    }
    
    update(time, delta){
        this.updateMotion();
        this.flyCoin(delta);
    }
}