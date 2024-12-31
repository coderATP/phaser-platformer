class HitEffect extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, texture){
        super(scene, x, y, texture);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }
}

export class ImageEffect extends HitEffect{
    constructor(scene, x, y, texture){
        super(scene, x, y, texture);
        
        this.setScale(0.5);
        this.on("animationcomplete", (animation)=>{
            if(animation.key === "ice-impact" ||
               animation.key === "fire-impact"){
                   this.destroy();
           }
        })
    }
    
    playAnimationOn(target, source, anim){
        /*
        TARGET is the GameObject that received a hit...
        and on which this animation will be played
        
        SOURCE is the initiator of the animation:
        the initiator is usually a weapon wielded or thrown by an opponent
        
        ANIM is the animation itself (fire-impact or ice-impact)
        */
        this
            .setDepth(target.depth+1)
            .setFlipX(source.flipX)
            .play(anim, true);
    }
    
    updatePosition(target){
        //Make sure animation stays on target until either of them dies
        if(!target.body) return;
        this.x = target.body.center.x;
        this.y = target.body.center.y; 
    }
}