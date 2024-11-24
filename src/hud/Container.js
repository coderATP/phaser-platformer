export class HUD extends Phaser.GameObjects.Container{
    constructor(scene, x, y){
        super(scene, x, y);
        
        scene.add.existing(this);
        this.width = 75;
        this.setScrollFactor(0);
        
        this.setPosition(scene.config.topRight.x - this.width, scene.config.topRight.y + 10)
        
        this.createScoreboard();
    }
    
    createScoreboard(){
        const topMargin = 5;
        const diamondIcon = this.scene.add.image(0, topMargin, "diamond")
            .setScale(1).setOrigin(0)
        const scoreText = this.scene.add.text(diamondIcon.width+5, topMargin, "0",
            { fontSize: 20+"px", fill: '#fff'}); 
        
        scoreText.setName("scoreText");
        this.add([scoreText, diamondIcon]);
    }
    
    updateScore(score){
        const scoreText = this.getByName("scoreText");
        scoreText.setText(score);
    }
}