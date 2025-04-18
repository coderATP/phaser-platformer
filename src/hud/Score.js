export class Scoreboard {
    constructor(scene) {
        this.scene = scene;
        this.score = 0;
    }
    
    draw() {
        const margin = 2;
        const { x, y } = this.scene.config.topRight;
        this.scoreText = this.scene.add.text( 0, 0, "Score: 0",
            { fontSize: "40px", fontFamily: "myOtherFont", color: "green", } )
            .setInteractive()
            .setOrigin(0)
            .setDepth(20)
            .setScrollFactor(0)
            .setScale(1/this.scene.config.zoomFactor)
            .setText("Score: " + this.score);
            
        this.scoreText
            .setPosition(x-this.scoreText.displayWidth-margin, y)
            
        this.scoreText2 = this.scene.add.text( 0, 0, "Score: 0",
            { fontSize: "40px", fontFamily: "myOtherFont", color: "gold" } )
            .setInteractive()
            .setOrigin(0)
            .setDepth(20)
            .setScrollFactor(0)
            .setScale(1/this.scene.config.zoomFactor)
            .setText("Score: " + score);
            
        this.scoreText2
            .setPosition(this.scoreText.x-1, this.scoreText.y-1) 
    
    }
    
    update(score){
        const margin = 2;
        this.score = score;
        const { x, y } = this.scene.config.topRight; 
        this.scoreText
           .setText("Score: " + score)
           .setPosition(x-this.scoreText.displayWidth-margin, y);
        this.scoreText2
            .setText("Score: " + score)
            .setPosition(this.scoreText.x-1, this.scoreText.y-1)  
    }
}