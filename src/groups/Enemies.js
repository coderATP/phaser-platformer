export class Enemies extends Phaser.GameObjects.Group{
    constructor(scene){
        super(scene);
        
    }
    
    handleAnimations(){
        this.playAnimation("orc-idle", true);
        
    }
    
    update(){
        this.getChildren().forEach(child=>{
            child.body.velocity.x !== 0 && child.play("orc-run", true);
        })  
    }
}