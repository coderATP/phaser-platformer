export class Door extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, texture){
        super(scene, x, y, texture);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this
            .setOrigin(1)
            .setScale(0.5)
            .setDepth(scene.player ? scene.player.depth-1 : 200)
        
        
    }
    

}