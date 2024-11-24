export class Healthbar{
    constructor(scene, healthWidth){
        this.scene = scene;
        this.graphics = new Phaser.GameObjects.Graphics(scene);
        
        this.magnification = 2;
        this.x = scene.config.topLeft.x/this.magnification;
        this.y = scene.config.topLeft.y/this.magnification;

        this.graphics.setScrollFactor(0,0)
            .setScale(this.magnification)
 
        this.width = 40;
        this.height = 8;
        this.pixelPerHealth = this.width/healthWidth;
        
        scene.add.existing(this.graphics);
    }
    
    draw(gameObject){

        const margin = 2;
        this.graphics.clear();
        //purple border
        this.graphics.fillStyle(0x9800ff);
        this.graphics.fillRect(this.x + margin, this.y + margin, this.width + margin, this.height + margin);
        // white background
        this.graphics.fillStyle(0xffffff);
        this.graphics.fillRect(this.x+margin*1.5, this.y+margin*1.5, this.width, this.height);
       
        //green healthbar
        if(gameObject.health >= 0){
            this.graphics.fillStyle(0x00ff00);
            this.graphics.fillRect(this.x+margin*1.5, this.y+margin*1.5, this.pixelPerHealth * gameObject.health, this.height);
        }
 
    }
}