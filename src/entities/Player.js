/**@type {import("../typings/phaser")} */
import { myInput } from "/src/myInput.js";
import { Healthbar } from "/src/hud/Healthbar.js";
import { Projectiles } from "/src/groups/Projectiles.js";
import { MeleeWeapon } from "/src/entities/MeleeWeapon.js";
import { eventEmitter } from "/src/events/EventEmitter.js"

export class Player extends Phaser.Physics.Arcade.Sprite{
    constructor (scene, x, y){
        super(scene, x, y, 'player');
        
        this.scene = scene;
        this.config = scene.config;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.init();
    }
    init(){
        this.sword = new MeleeWeapon(this.scene, 0, 0, "sword-sheet");
        this.maxJumps = 2;
        this.jumpCount = 0;
        this.createAnimKeys();
        this.speedX = 100;
        this.speedY = 250;
        this.bounceVelocity = 400;
        this.hasBeenHit = false;
        this.loseControlTimeout = 1000;
        this.body.setGravityY(982);
        this.projectiles = new Projectiles(this.scene, "iceball");
        //last direction
        this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT;
        //health bar/hp
        this.health = 100;
        this.hp = new Healthbar(this.scene, this.health);
        
        this.setCollideWorldBounds(true);
        this.setOrigin(0.5, 1);
        this.handleAnimations();
        
        //adjust hitbox
        this.setSize(this.width-16, this.height-5);
        this.setOffset(8, 5);
        this.initEvents();
        //score
        this.score = 0;
    }
    //initialise update cycle
    initEvents(){
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }
    
    addCollider(otherGameObject, callback){
        this.scene.physics.add.collider(this, otherGameObject, callback, null, this) 
    }
    addOverlap(otherGameObject, callback){
        this.scene.physics.add.overlap(this, otherGameObject, callback, null, this) 
    }
    handleInput(){
        if(!this.body) { return; }
        //BASIC MOVEMENTS
        if(myInput.keys[0] === "right" || myInput.keys[0] === "ArrowRight" || myInput.keys[0] === "d"){
            this.lastDirection = Phaser.Physics.Arcade.FACING_RIGHT;
            this.setVelocityX(this.speedX);
            this.setFlipX(false)
        }
        else if(myInput.keys[0] === "left" || myInput.keys[0] === "ArrowLeft" || myInput.keys[0] === "a"){
            this.lastDirection = Phaser.Physics.Arcade.FACING_LEFT;
            this.setVelocityX(-this.speedX);
            this.setFlipX(true)
        }
        else this.setVelocityX(0);
        
        if((myInput.keys[0] === "up" || myInput.keys[0] === "ArrowUp" || myInput.keys[0] === "w") && myInput.keypressed && this.jumpCount < this.maxJumps ){
            this.setVelocityY(-this.speedY*2);
            this.jumpCount++;
            myInput.keypressed = false;
        }
        if( (myInput.keys[0] === "down" || myInput.keys[0] === "ArrowDown" || myInput.keys[0] === "s") ) {
            if(this.body.onFloor()){
                this.setSize(this.width-16, this.height/2);
                this.setOffset(8, this.height/2 ); 
            }
        }
        else{
            this.setSize(this.width-16, this.height-5);
            this.setOffset(8, 5);
        }
        
        //handling projectile shot
        if( (myInput.keys[0] === "rangedShot" || myInput.keys[0] === "Enter") && myInput.keypressed){
            this.shoot();
            myInput.keypressed = false;
        }
        //sword 
        if( (myInput.keys[0] === "slash" || myInput.keys[0] === "Shift") && myInput.keypressed ){
            this.sword.wield(this);
            myInput.keypressed = false;
        }
    }
    
    handleAnimations(){
        //BASIC ANIMATIONS
        if(!this.body) { return; }
        //idle, slide and run animations while player is on floor
        if(this.body.onFloor() ){
            this.jumpCount = 0;
            if ((myInput.keys[0] === "down" || myInput.keys[0] === "ArrowDown" || myInput.keys[0] === "s" ) ) {
                if(myInput.keypressed){
                    this.play("slide", true);
                    myInput.keypressed = false
                }
            } 
            else if(myInput.keys[0] === "right" || myInput.keys[0] === "d" || myInput.keys[0] === "ArrowRight" || myInput.keys[0] === "left" || myInput.keys[0] === "a" || myInput.keys[0] === "ArrowLeft"){
                this.play("run", true);
            }
            else{
                this.play("idle", true);
            } 
        }
        //jump animation when player is not on floor 
        else{
            this.play("jump", true);
        } 
    }
    
    createAnimKeys(){
        this.scene.anims.create({
            key: "run",
            frames: this.scene.anims.generateFrameNumbers(
                "player",
                {start: 11, end: 16},
            ),
            frameRate: 8,
            repeat: -1 
        });
        
        this.scene.anims.create({
            key: "idle",
            frames: this.scene.anims.generateFrameNumbers(
                "player",
                {start: 0, end: 8},
            ),
            frameRate: 8,
            repeat: -1 
        }) 

        this.scene.anims.create({
            key: "jump",
            frames: this.scene.anims.generateFrameNumbers(
                "player",
                {start: 17, end: 23},
            ),
            frameRate: 2,
            repeat: 1
        })
        this.scene.anims.create({
            key: "slide",
            frames: this.scene.anims.generateFrameNumbers(
                "player-slide-sheet",
                {start: 0, end: 2},
            ),
            frameRate: 20,
            repeat: 0
        })   
    }
    
    playDamageTween(opponent){
        //player tint
        this.hitAnim = this.scene.tweens.add({
            targets: this,
            tint: '0x000',
            duration: this.loseControlTimeout/4,
            repeat: 4,
            onComplete: ()=>{
                if (this.health <= 0) {
                    eventEmitter.emit("PLAYER_LOSE");
                    return;
                }
                this.hitAnim.stop();
                this.clearTint();
                this.hasBeenHit = false;
            }
        });
        //Healthbar 
        this.healthAnim = this.scene.tweens.add({
            targets: this,
            health: this.health - (opponent.damage ? opponent.damage : opponent.properties.damage),
            repeat: 0,
        })
    }
    
    bounceOffEnemy(){
        this.hasBeenHit = true;
        if(this.body.touching.right || this.body.blocked.right) { this.setVelocityX (-this.speedX)}
        else { this.setVelocityX(this.speedX); }
        
        this.setVelocityY(-this.bounceVelocity);
       
    }

    bounceOffFloor(){
        this.hasBeenHit = true;
        if(this.body.facing.right ) { this.setVelocityX (-this.speedX)}
        else { this.setVelocityX(this.speedX); }
        
        this.setVelocityY(-this.bounceVelocity);
       
    } 
    takesHitFrom(weapon){
        this.playDamageTween(weapon);
        this.bounceOffEnemy();
    }
    
    deactivate(){
        this.hasBeenHit = true;
    }
    
    shoot(){
        const projectile = this.projectiles.getFreeProjectile();
        
        if(!projectile) {
            console.log ("no projectile")
            return; }
        projectile.fire(this, "iceball");
    }
    

    update(time, delta){
        if(this.hasBeenHit) { return; }
        this.handleAnimations();
        this.handleInput();
 
        this.hp.draw(this);
        
    }
    
}