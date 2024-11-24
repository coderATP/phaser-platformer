export class Projectile extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, key){
        super(scene, x, y, key);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.init();
    }
    
    init(){
        this.id = "projectile"
        this.speed = 200;
        this.travelledDistance = 0;
        this.maxDistance = 300;
        this.body.setSize(this.width-13, this.height-20);
        
        //damage
        this.damage = 10;
    }
    
    fire(initiator, anim){
        if(!initiator.body) return;
        const centreX = initiator.getCenter().x;
        const centreY = initiator.getCenter().y;
        this.y = centreY;
        this.setActive(true);
        this.setVisible(true);
        
        if(initiator.lastDirection == Phaser.Physics.Arcade.FACING_RIGHT){
            this.x = centreX + 10;
            this.setVelocityX(this.speed);
            this.setFlipX(false);
        }
        else if(initiator.lastDirection == Phaser.Physics.Arcade.FACING_LEFT){
            this.x = centreX - 10;
            this.setVelocityX(-this.speed);
            this.setFlipX(true)
        }
        this.playAnim(anim);
    }
    
    playAnim(anim){
        anim && this.play(anim, true);
    }
    
    deactivate(){
        this.body.reset(0,0);
        this.setActive(false);
        this.setVisible(false);
    }
    
    hide(){
        this.body.reset(0,0);
        this.setActive(false); 
        this.setVisible(false);
    }
    
    preUpdate(time, delta){
        super.preUpdate(time, delta);
        
        this.travelledDistance+= this.body.deltaAbsX();
        
        if(this.travelledDistance >= this.maxDistance){
            this.deactivate();
            this.travelledDistance = 0;
        }
    }
}