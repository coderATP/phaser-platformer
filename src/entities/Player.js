import {myInput} from "../myInput.js";


export class Player extends Phaser.Physics.Arcade.Sprite{
    //state design
    static Status = {
            Walking: 1,
            Climbing: 2,
            Jumping: 3,
            Falling: 4
    } 
    constructor(scene, x, y){
        super(scene, x, y, "player");
        
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
        this
            .setScale(0.5)
            .setPosition(20, 20)
            .setOrigin(0)
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
    
    update(){
        if(!this.body) return;
        //console.log (this.canClimbDown)
        switch(this.status){
            case Player.Status.Walking:
                this.body.setAllowGravity(true)
                if (myInput.keys[0] === "right") {
                    this.setFlipX(false)
                    this.setVelocityX(this.speedX)
                }
                else if (myInput.keys[0] === "left") {
                    this.setFlipX(true)
                    this.setVelocityX(-this.speedX)
                }
                else {
                    this.setVelocityX(0)
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
                this.body.setAllowGravity(false)
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
        }
        
    }
}