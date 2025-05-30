export class Projectile extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, texture){
        super(scene, x, y, texture);
        this.scene = scene;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.init()
    }
    
    init(){
        this.damage = 10;
        this
            .setDepth(11)
            .setScale(0.5)
            .setActive(false)
            .setVisible(false)
            .body.reset(0, -50)
        this.distanceTravelled = 0;
        this.maxDistance = 96;
        this.scene.events.on("update", this.update, this);
    }
    
    fire(initiator, x, y, anim, speed = 120){
        this.speed = speed;
        this.setActive(true);
        this.setVisible(true);
        this.x = x;
        this.y = y;
        this.play(anim);
        if(initiator.lastDirection === "right"){
            this.setVelocityX(this.speed);
            this.setFlipX(false);
        }
        else{
            this.setVelocityX(-this.speed);
            this.setFlipX(true);
        }
    }
    
    deactivate(){
        this.body.reset(0,-50);
        this.setActive(false);
        this.setVisible(false);
    }
    
    update(time, delta){
        if(!this.body) return;
        this.distanceTravelled += this.body.deltaAbsX();
        const bodyPosDiff = Math.abs(this.x - this.body.prev.x)

        if(this.distanceTravelled >= this.maxDistance){
            this.deactivate();
            this.distanceTravelled = 0;
        }
    }
}