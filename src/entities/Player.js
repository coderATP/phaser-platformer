import {myInput} from "../myInput.js";


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
    
    createAnimKeys(){
        this.scene.anims.create({
            key: "player-death",
            frames: this.scene.anims.generateFrameNumbers(
                "player-death",
                {start: 0, end: 7},
            ),
            frameRate: 4,
            repeat: -1 
        });
        this.anims.create({
            key: "player-idle",
            frames: this.scene.anims.generateFrameNumbers(
                "player",
                {start: 0, end: 3},
            ),
            frameRate: 4,
            repeat: -1 
        });
        this.scene.anims.create({
            key: "player-run",
            frames: this.scene.anims.generateFrameNumbers(
                "player-run",
                {start: 0, end: 7},
            ),
            frameRate: 8,
            repeat: -1 
        });
        this.scene.anims.create({
            key: "player-attack",
            frames: this.scene.anims.generateFrameNumbers(
                "player-attack",
                {start: 0, end: 7},
            ),
            frameRate: 8,
            repeat: -1 
        });
        
        this.scene.anims.create({
            key: "player-jump",
            frames: this.scene.anims.generateFrameNumbers(
                "player-jump",
                {start: 0, end: 3},
            ),
            frameRate: 3,
            repeat: -1
        });
        this.scene.anims.create({
            key: "player-fall",
            frames: this.scene.anims.generateFrameNumbers(
                "player-run",
                {start: 0, end: 3},
            ),
            frameRate: 3,
            repeat: -1
        });
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
        this.lastDirection = "left";
        this
            .setOrigin(0.5, 1)
            .setSize(15, 40)
            .setOffset(this.width*0.4, this.height*0.4)
            .setScale(0.5)
            .setDepth(100)
            .setGravityY(982)
            .setCollideWorldBounds(true)
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
   
    update(){
        if(!this.body) return;
        this.handleAnimations();
        
        switch(this.status){
            case Player.Status.Walking:
                this.body.setAllowGravity(true);
                
                if (myInput.keys[0] === "right") {
                    this.setFlipX(false)
                    this.setVelocityX(this.speedX)
                    //this.play("player-run", true);
                }
                else if (myInput.keys[0] === "left") {
                    this.setFlipX(true)
                    this.setVelocityX(-this.speedX)
                    //this.play("player-run", true);
                }
                else {
                    this.setVelocityX(0)
                    //this.play("player-idle", true);
                }
                
                if(this.body.onFloor()) this.jumpCount = 0;
                if (myInput.keys[0] === "up" && myInput.keypressed && this.jumpCount < this.maxJumps) {
                    this.jumpCount ++;
                    this.setVelocityY(-this.speedY)
                    myInput.keypressed = false;
                }
                
                if(this.onLadder && (myInput.keys[0] === "right" || myInput.keys[0] === "left")){
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
                
                if (myInput.keys[0] === "right") {
                    this.setFlipX(false)
                    this.setVelocityX(this.speedX*0.7)
                }
                else if (myInput.keys[0] === "left") {
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
                if (myInput.keys[0] === "up") {
                    this.setVelocityY(-40)
                }
                else if (myInput.keys[0] === "down"){
                    this.setVelocityY(40)
                }
                else{
                    this.setVelocityY(0)
                }
                
                if(!this.onLadder){
                    if(myInput.keys[0] === "up") this.setVelocityY(-this.speedY*0.5)
                    this.setStatus(Player.Status.Walking);
                }
            break;
            
            default:
                //this.play("player-idle", true);
            break;
        }
        
        //SETTING PLAYER Hitbox
        this.lastDirection = this.flipX ? "right" : "left";

    }
}