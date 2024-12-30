export class Enemies extends Phaser.GameObjects.Group{
    constructor(scene){
        super(scene);
        this.scene = scene;
    }
    
    handleAnimations(){
        this.playAnimation("orc-idle", true);
        
    }
    
    update(){
        if(!this.scene) return;
        this.getChildren().forEach(child=>{
            child.body.velocity.x !== 0 && child.play("orc-run", true);
            
            //add health
            
        })
    }
}