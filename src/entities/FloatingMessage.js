export class FloatingMessage{
    constructor(scene){
        this.scene = scene;
        this.config = scene.config;
        this.value = undefined;
        this.x  = undefined; 
        this.y = undefined;
        this.dx = undefined;
        this.dy = undefined;
        this.timer = 0;
        this.markedForDeletion = false;
        this.msg = this.scene.add.text( 0, 0, "",
            { fontSize: "20px", fontFamily: "myOtherFont", color: "white", } )
            .setScrollFactor(0)
            .setOrigin(0)
            .setDepth(30)
            .setScale(1/this.scene.config.zoomFactor)
          
    }
    
    draw(value, x, y, dx, dy) {
        this.value = value;
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        
        return this;
    }
    
    update(){
        
        this.timer++;
        /*this.x+= (this.dx - this.x) * 0.03;
        this.y+= (this.dy - this.y) * 0.03;
        */
        //if(this.timer > 100) this.markedForDeletion = true;  
        
        this.scene.tweens.add({
            targets: this,
            x: this.dx,
            duration: 1000,
            onComplete: ()=>{
                this.markedForDeletion = true;
            }
        })
        this.scene.tweens.add({
            targets: this,
            y: this.dy,
            duration: 1000,
            onComplete: ()=>{
                this.markedForDeletion = true;
            }
        }) 
        
        const margin = 2;
        this.msg
           .setText("+" + this.value)
           .setPosition(this.x, this.y);
        
        return this;
    }
}