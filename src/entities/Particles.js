export class ParticleEffect extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, key, source){
        super(scene, x, y, key);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.target = null;
        this.source = source;
        this.body.setSize(this.width-15, this.height-15);
        
        this.on("animationcomplete", (animation)=>{
            this.destroy();
        }, this)
    }
    
    playAnimationOn(target, animationKey){
        if(!target) { return; }
        
        this.target = target;
        this.play(animationKey, true)
    }
    
    preUpdate(time, delta){
        
        super.preUpdate(time, delta);
        this.x = this.target.getCenter().x;
 
        if(!this.source || !this.source.active){
            this.y = this.target.getCenter().y; 
        }else{
            this.y = this.source.getCenter().y; 
        }

    }
    
}