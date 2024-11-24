/**@type {import("../typings/phaser")} */

export class Collectible extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, key){
        super(scene, x, y, key);

        this.scene = scene;
        scene.add.existing(this);

        //anims
        this.play("diamond-shine", true);

        //tween
        scene.tweens.add({
            targets: this,
            y: this.y - Phaser.Math.Between(3, 6),
            yoyo: true,
            duration: Phaser.Math.Between(1500, 4500),
            repeat: -1,
            ease: "linear"
        })
        
        this.init();
    }

    init(){

    }

    
}