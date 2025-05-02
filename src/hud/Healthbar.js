export class Healthbar{
    constructor(scene, gameObject){
        this.scene = scene;
        this.config = scene.config;
        this.gameObject = gameObject;
        this.graphics = scene.add.graphics()
            .setDepth(20);
        this.originalHealth = gameObject.health;
        this.x = scene.config.topLeft.x;
        this.y = scene.config.topLeft.y;
            
        scene.add.existing(this.graphics);
    }
    
}

export class PlayerHealthbar extends Healthbar{
    constructor(scene, gameObject){
        super(scene, gameObject)
        this.graphics.setScrollFactor(0);
        this.width = 50;
        this.height = 5;
        this.pixelPerHealth = this.width/gameObject.health;
    }
    
    draw(){

        const margin = 2;
        this.graphics.clear();
        //purple border
        this.graphics.fillStyle(0x9800ff);
        this.graphics.fillRect(this.x + margin, this.y + margin, this.width + margin, this.height + margin);
        // white background
        this.graphics.fillStyle(0xffffff);
        this.graphics.fillRect(this.x+margin*1.5, this.y+margin*1.5, this.width, this.height);
       
        //multi-chromatic healthbar
        if(this.gameObject.health <= this.originalHealth*0.3){
            this.graphics.fillStyle(0xff0000);
        }
        
        else if(this.gameObject.health <= this.originalHealth*0.6){
            this.graphics.fillStyle(0xffff00);
        }
        else this.graphics.fillStyle(0x00ff00);
        if(this.gameObject.health > 0)this.graphics.fillRect(this.x+margin*1.5, this.y+margin*1.5, this.pixelPerHealth * this.gameObject.health, this.height);
 
    }

}

export class PlayerEnergybar extends Healthbar{
    constructor(scene, gameObject){
        super(scene, gameObject)
        this.graphics.setScrollFactor(0);
        this.width = 50;
        this.height = 5;
        this.pixelPerHealth = this.width/gameObject.health;
        this.topMargin = 12;
        this.leftMargin = 2;
    }
    
    draw(){
        const padding = 1;
        this.graphics.clear();
        //blue border
        this.graphics.fillStyle(0x0000ff);
        const borderRect = new Phaser.Geom.Rectangle(
            this.config.topLeft.x + this.leftMargin,
            this.config.topLeft.y + this.topMargin,
            this.width + padding,
            this.height + padding);
        this.graphics.strokeRectShape(borderRect);
        //light blue energy
        this.graphics.fillStyle(0x00ffff);
        const energybar = new Phaser.Geom.Rectangle(
            this.config.topLeft.x + this.leftMargin + padding/2,
            this.config.topLeft.y + this.topMargin + padding/2,
            this.width,
            this.height);
        this.graphics.fillRectShape(energybar);
    }

}
export class EnemyHealthbar extends Healthbar{
    constructor(scene, gameObject){
        super(scene, gameObject);
        this.graphics.setScrollFactor(1);
        this.width =  gameObject.body.width*1.4;
        this.height = 1.8;
        this.pixelPerHealth = this.width/gameObject.health;
        if(this.config.debug) this.statusText = this.scene.add.text(0,0,gameObject.name,
            { fontSize: "20px", fontFamily: "myOtherFont"}
        ).setOrigin(0).setDepth(22).setScale(1/this.config.zoomFactor);
    }
    
    draw(){
        
        this.x = this.gameObject.body.center.x - this.width * 0.5;
        this.y = this.gameObject.body.y - this.height - 4;
        if(this.config.debug) this.statusText.setPosition(this.gameObject.body.left, this.gameObject.body.top);
        
        this.graphics.clear();
        // white background
        this.graphics.fillStyle(0xffffff);
        this.graphics.fillRect(this.x, this.y, this.width, this.height);
       
        //multi-chromatic healthbar
        if(this.gameObject.health <= this.originalHealth*0.3){
            this.graphics.fillStyle(0xff0000);
        }
        
        else if(this.gameObject.health <= this.originalHealth*0.6){
            this.graphics.fillStyle(0xffff00);
        }
        else this.graphics.fillStyle(0x00ff00);
        if(this.gameObject.health > 0) this.graphics.fillRect(this.x, this.y, this.pixelPerHealth * this.gameObject.health, this.height); 
    }

}  