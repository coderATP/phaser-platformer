import { myInput } from "../myInput.js";

export class Sword extends Phaser.GameObjects.Graphics{
    constructor(scene, gameObject){
        super(scene);
        this.gameObject = gameObject;
        this.config = scene.config;

        this.swordObject = new Phaser.Geom.Rectangle(
           gameObject.body.center.x,
           gameObject.body.top,
           gameObject.body.width*2,
           gameObject.body.height);
           
        this.swordObject.damage = 15;
        
        this
            .setScrollFactor(1)
            .setDepth(20)
        scene.add.existing(this);
    }
    
    draw(gameObject){
        this.swordObject.y = gameObject.body.top;
        this.swordObject.width = gameObject.body.width*3;
        this.swordObject.height = gameObject.body.height;
           
       if(!gameObject.flipX)
           this.swordObject.x = gameObject.body.right;
       else
           this.swordObject.x = gameObject.body.left - this.swordObject.width;
           
       this.clear();
       this.fillStyle(0xff0000);
       this.strokeRectShape(this.swordObject); 
       
    }
}