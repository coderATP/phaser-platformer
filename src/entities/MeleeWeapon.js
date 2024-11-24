export class MeleeWeapon extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, texture){
        super(scene, x, y, texture);
        this.scene = scene;
        this.texture = texture;
        this.id = "sword"
        this.wielder = null;
        this.damage = 15;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setOrigin(0.5, 1);
        this.setDepth(10);
        this.activate();
        this.initEvents();
        
        this.on("animationcomplete", (animation)=>{
            if(animation.key == "sword-attack"){
                this.deactivate();
            }
        })
    }
    
    initEvents(){
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }
    
    activate(){
        this.setActive(true);
        this.setVisible(true);
    }
    
    deactivate(){
        this.body.reset(0,0);
        this.setActive(false);
        this.setVisible(false); 
    }
    wield(wielder){
        this.activate();
        this.wielder = wielder;
        this.play("sword-attack", true);
    }
    
    hide(){
        this.body.reset(0,0);
        this.setActive(false);
        this.setVisible(false);  
    }
    
    update(time, delta){
        if(!this.active || !this.wielder) return;
        
        if(this.wielder.lastDirection === Phaser.Physics.Arcade.FACING_RIGHT){
            this.setFlipX(false);
            this.body.reset(this.wielder.x + 35, this.wielder.y);
            this.x = this.wielder.x+35; 
        }
        else{
            this.setFlipX(true);
            this.body.reset(this.wielder.x - 35, this.wielder.y) 
            this.x = this.wielder.x - 35
        }
    }
}