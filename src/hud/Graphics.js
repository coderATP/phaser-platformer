export class Graphics extends Phaser.GameObjects.Graphics{
    constructor(scene){
        super(scene);
        this.scene = scene;
        this
            .setScrollFactor(0,0)
            .setDepth(10)
        
        scene.add.existing(this);
    }
    
    drawPlayerHealthbar(x, y, width, height){
        if(!this.scene.player || !this.scene.config) return;
        
        const { lives, maxLives } = this.scene.player;
        const { topLeft } = this.scene.config;
        this.clear();
        //container
        this.fillStyle(0x9800ff);
        this.strokeRect(topLeft.x + x, topLeft.y + y, width, height);
        
        //lives
        var lifeIcon;
        var lifeWidth = width/maxLives;
        var lifeHeight = height*0.8;
        var padding = 1.5;
        const healthbars = [];
        this.fillStyle(0xffffff);
        for(let i = 0; i < lives; ++i){
            const pos  = {
                x: padding/2 + topLeft.x + x + i * lifeWidth,
                y: topLeft.y + y + height*0.1
            }
            
            this.fillRect(pos.x, pos.y, lifeWidth-padding, lifeHeight);
            lifeIcon = this.scene.add.image(pos.x-padding, pos.y, "lifeIcon")
                .setOrigin(0, 0)
                .setScrollFactor(0)
                .setScale(0.8)
                .setDepth(10);
            healthbars.push(lifeIcon);
        }
        return healthbars;
    }
}