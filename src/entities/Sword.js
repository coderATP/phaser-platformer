export class Sword extends Phaser.GameObjects.Graphics{
    constructor(scene){
        super(scene);
        this.config = scene.config;
        this
            .setScrollFactor(1)
            .setDepth(20)
        scene.add.existing(this);
    }
    
    draw(gameObject){
        const sword = new Phaser.Geom.Rectangle(
           gameObject.body.center.x,
           gameObject.body.top,
           gameObject.body.width*2,
           gameObject.body.height);
           if(!gameObject.flipX)
               sword.x = gameObject.body.right;
           else
               sword.x = gameObject.body.left - sword.width;
           
       this.clear();
       this.fillStyle(0xff0000);
       this.strokeRectShape(sword);
    }
}