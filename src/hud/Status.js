export class Status {
    constructor(scene) {
        this.scene = scene;
        this.config = scene.config;
        this.topMargin = 20;
        this.leftMargin = 2;
    }
    
    draw() {
        this.statusText = this.scene.add.text(0,0,"",
            {fontSize: "30px", fontFamily: "myOtherFont"}
        )
            .setOrigin(0)
            .setScale(1/this.config.zoomFactor)
            .setDepth(20)
            .setScrollFactor(0);
        this.statusText
            .setText("State: ")
            .setPosition(this.config.topLeft.x + this.leftMargin,this.config.topLeft.y + this.topMargin);//
        
        this.lastKey = this.scene.add.text(0,0,"",
            {fontSize: "30px", fontFamily: "myOtherFont"} 
        )
            .setOrigin(0)
            .setScale(1/this.config.zoomFactor)
            .setDepth(20)
            .setScrollFactor(0);
        this.lastKey
            .setText("lastKey: ")
            .setPosition(this.config.topLeft.x + this.leftMargin,this.config.topLeft.y + this.topMargin);//
         
    }
    
    update(state, lastKey){
        this.statusText
            .setText("State: " + state.name)
            .setPosition(this.config.topLeft.x + this.leftMargin,this.config.topLeft.y + this.topMargin);//
         
        this.lastKey
            .setText("lastKey: " + lastKey)
            .setPosition(this.config.topLeft.x + this.leftMargin, this.config.topLeft.y + this.topMargin + this.statusText.displayHeight);//
         
    }
}