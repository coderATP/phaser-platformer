import { audio } from "../audio/AudioControl.js";

export class Coin extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, texture){
        super(scene, x, y, texture);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this
            .setOrigin(0)
            .setScale(0.5)

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
        this.destroy();
        audio.play(audio.coinCollectedSound);
    }
   updateMotion(){
       if(!this.body) return;
       if(this.body.onFloor()){
           this.setVelocityX(0);
       }
   }
    update(time, delta){
        this.updateMotion();
    }
}