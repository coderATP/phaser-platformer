import {myInput} from "../myInput.js";
import { Projectiles } from "../groups/Projectiles.js";
import { PlayerHealthbar } from "../hud/Healthbar.js";


export class Player extends Phaser.Physics.Arcade.Sprite{
    //state design
    static Status = {
            Walking: 1,
            Climbing: 2,
            Jumping: 3,
            Falling: 4
    } 
    constructor(scene, x, y, texture){
        super(scene, x, y, texture);
        
        this.scene = scene;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.init();
        this.status = Player.Status.Walking;
 
    }
    
    init(){
        this.scene.events.on("update", this.update, this);
        this.name = "player";
        this.speedX = 80;
        this.speedY = 300;
        this.onLadder = false;
        this.canClimbDown = false;
        this.canClimbUp = false;
        this.jumpCount = 0;
        this.maxJumps = 3;
        this.maxHealth = 100;
        this.health = this.maxHealth; 
        this.pixelPerHealth = 10;

        this.damage = 10;
        this.lastDirection = "left";
        this.projectiles = new Projectiles(this.scene, "iceball");
        
        this
            .setOrigin(0.5, 1)
            .setSize(15, 40)
            .setOffset(this.width*0.4, this.height*0.4)
            .setScale(0.5)
            .setDepth(100)
            .setGravityY(982)
            .setCollideWorldBounds(true);
            
        this.healthbar = new PlayerHealthbar(this.scene, this); 
    }
    
    addCollider(otherGameObject, callback){
        this.scene.physics.add.collider(this, otherGameObject, callback, null, this);
    }
    
    onEnemyProjectileHit(player, projectile){
        player.health -= projectile.damage;
        
        projectile.deactivate();
    }
    
    setStatus(newStatus){
        this.status = newStatus;
    }
    
    addCollider(otherGameObject, callback){
        this.scene.physics.add.collider(this, otherGameObject, callback, null, this);
    }
    
    addOverlap(otherGameObject, callback){
        this.scene.physics.add.overlap(this, otherGameObject, callback, null, this);
    }
    
   handleAnimations(){
        if(this.body.onFloor() || (this.onLadder && (!this.canClimbDown || !this.canClimbUp))){
            if(this.body.velocity.x === 0 ){
                this.play("player-idle", true);
            }
            else{
                //this.play("player-run", true);
            }
        }
        else if(this.canClimbUp || this.canClimbDown){
            this.play("player-idle", true);
        }
        else{
            if(this.body.velocity.y < 0){
               // this.play("player-jump", true);
            }
            else{
               // this.play("player-fall", true);
            }
        } 
   }
   
   shoot(key, anim){
       const projectile = this.projectiles.getFreeProjectile();
       if(projectile){
           projectile.key = key;
           projectile.fire(this, this.getCenter().x, this.getCenter().y, anim);
       }
   }
   
   handleShooting(){
        //shoot
        if(myInput.keys[0] === "rangedShot" && myInput.keypressed){
            this.shoot("iceball", "ice");
            myInput.keypressed = false;
        }
        else if(myInput.keys[0] === "special" && myInput.keypressed){
            this.shoot("fireball", "fire");
            myInput.keypressed = false;
        }
          
   }
   
    update(time, delta){
        super.update(time, delta );
        
        if(!this.body) return;
        this.healthbar.draw();
        this.handleAnimations();
        this.handleShooting();
        
        switch(this.status){
            case Player.Status.Walking:
                this.body.setAllowGravity(true);
                
                if (myInput.keys[0] === "right"  || myInput.keys[0] === "ArrowRight" || myInput.keys[0] === "d") {
                    this.setFlipX(false)
                    this.setVelocityX(this.speedX)
                    //this.play("player-run", true);
                }
                else if (myInput.keys[0] === "left"  || myInput.keys[0] === "ArrowLeft" || myInput.keys[0] === "a") {
                    this.setFlipX(true)
                    this.setVelocityX(-this.speedX)
                    //this.play("player-run", true);
                }
                else {
                    this.setVelocityX(0)
                    //this.play("player-idle", true);
                }
                
                if(this.body.onFloor()) this.jumpCount = 0;
                if (( myInput.keys[0] === "up"  || myInput.keys[0] === "ArrowUp" || myInput.keys[0] === "w") && myInput.keypressed && this.jumpCount < this.maxJumps) {
                    this.jumpCount ++;
                    this.setVelocityY(-this.speedY)
                    myInput.keypressed = false;
                }
                
                if(this.onLadder && (myInput.keys[0] === "right"  || myInput.keys[0] === "ArrowRight" || myInput.keys[0] === "d"|| myInput.keys[0] === "left"  || myInput.keys[0] === "ArrowLeft" || myInput.keys[0] === "a")){
                    this.setStatus(Player.Status.Climbing)
                }
                //canClimbUp and canClimbDown are derivations of onLadder
                //specific to when player needs to climb up or down, respectively
                if(this.canClimbDown){
                    this.setStatus(Player.Status.Climbing)
                }
                if(this.canClimbUp){
                    this.setStatus(Player.Status.Climbing)
                } 
            break;
            
            case Player.Status.Climbing:
                this.body.setAllowGravity(false);
                
                if (myInput.keys[0] === "right"  || myInput.keys[0] === "ArrowRight" || myInput.keys[0] === "d") {
                    this.setFlipX(false)
                    this.setVelocityX(this.speedX*0.7)
                }
                else if (myInput.keys[0] === "left"  || myInput.keys[0] === "ArrowLeft" || myInput.keys[0] === "a") {
                    this.setFlipX(true)
                    this.setVelocityX(-this.speedX*0.7)
                }
                else {
                    this.setVelocityX(0)
                }
                //jump off ladder
                if(myInput.keys[0]=== "special"){
                    this.flipX ? this.setVelocityX(-1000) : this.setVelocityX(1000)
                }
                if (myInput.keys[0] === "up"  || myInput.keys[0] === "ArrowUp" || myInput.keys[0] === "w") {
                    this.setVelocityY(-40)
                }
                else if (myInput.keys[0] === "down"  || myInput.keys[0] === "ArrowDown" || myInput.keys[0] === "s"){
                    this.setVelocityY(40)
                }
                else{
                    this.setVelocityY(0)
                }
                
                if(!this.onLadder){
                    if(myInput.keys[0] === "up"  || myInput.keys[0] === "ArrowUp" || myInput.keys[0] === "w") this.setVelocityY(-this.speedY*0.5)
                    this.setStatus(Player.Status.Walking);
                }
            break;
            
            default:
                //this.play("player-idle", true);
            break;
        }
        
        //SETTING PLAYER Hitbox
        this.lastDirection = this.flipX ? "left" : "right";
        
    }
}