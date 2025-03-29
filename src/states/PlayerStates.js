import { myInput } from "../myInput.js";
import { audio } from "../audio/AudioControl.js";

class PlayerState{
    constructor(player){
        this.player = player;
        this.name;
    }
}

//IDLE
export class PlayerIdle extends PlayerState{
    constructor(player){
        super(player);
        this.name = "PlayerIdle"
    }
    
    enter(){
        if(!this.player.body) return;
        this.player.play("player-idle", true);
        this.player.setVelocityX(0);
        this.player.setVelocityY(0)
    }
    
    update(time, delta){
        if(!this.player.body) return;
        this.player.body.setAllowGravity(true);

        //walk right
        if (myInput.keys[0] === "right"  || myInput.keys[0] === "ArrowRight" || myInput.keys[0] === "d") {
            this.player.playWalkSound(delta);
            this.player.setFlipX(false);
            this.player.stateMachine.setState(new PlayerWalk(this.player));
        }
        //walk left
        else if (myInput.keys[0] === "left"  || myInput.keys[0] === "ArrowLeft" || myInput.keys[0] === "a") {
            this.player.playWalkSound(delta);
            this.player.setFlipX(true);
            this.player.stateMachine.setState(new PlayerWalk(this.player)); 
        } 
        //roll right
        else if ( (myInput.keys[0] === "swipe right"  || myInput.keys[0] === "r") && myInput.keypressed){
            this.player.setFlipX(false);
            this.player.stateMachine.setState(new PlayerRoll(this.player));
            myInput.keypressed = false;
        }
        //roll left
        else if ( (myInput.keys[0] === "swipe left"  || myInput.keys[0] === "l") && myInput.keypressed){
            this.player.setFlipX(true);
            this.player.stateMachine.setState(new PlayerRoll(this.player));
            myInput.keypressed = false;
        }
        //slide
        else if ( (myInput.keys[0] === "swipe down"  || myInput.keys[0] === "ArrowSlide") && myInput.keypressed){
            this.player.stateMachine.setState(new PlayerSlide(this.player));
            myInput.keypressed = false;
        }
        //crouch
        else if (myInput.keys[0] === "down" && myInput.keypressed && !this.player.onLadder) {
            this.player.stateMachine.setState(new PlayerCrouch(this.player));
            myInput.keypressed = false;
        }
        //jump
        else if (( myInput.keys[0] === "up"  || myInput.keys[0] === "ArrowUp" || myInput.keys[0] === "w") && myInput.keypressed && this.player.jumpCount < this.player.maxJumps) {
            this.player.stateMachine.setState(new PlayerJump(this.player));
            myInput.keypressed = false;
        }
        //climb
        if (this.player.canClimbUp || this.player.canClimbDown) {
            this.player.body.setAllowGravity(false)
            this.player.stateMachine.setState(new PlayerClimb(this.player))
        }
        
        if(this.player.body.onFloor()) this.player.jumpCount = 0;
    }
}

//WALK
export class PlayerWalk extends PlayerState{
    constructor(player){
        super(player);
        this.name = "PlayerWalk"
    }
    
    enter(){
        if(!this.player.body) return;
        this.player.play("player-run", true); 
        this.player.flipX ? this.player.setVelocityX(-this.player.speedX) : this.player.setVelocityX(this.player.speedX);
    }
    
    update(time, delta){
        if(!this.player.body) return;
        this.player.body.setAllowGravity(true);

        //idle     
        if(myInput.keys.length === 0 ){
            this.player.stateMachine.setState(new PlayerIdle(this.player));
        }
        //jump
        if(this.player.body.onFloor()) this.player.jumpCount = 0;
        if (( myInput.keys[0] === "up"  || myInput.keys[0] === "ArrowUp" || myInput.keys[0] === "w") && myInput.keypressed && this.player.jumpCount < this.player.maxJumps) {
            this.player.stateMachine.setState(new PlayerJump(this.player))
            myInput.keypressed = false;
        }
        //climb
        if (this.player.canClimbUp || this.player.canClimbDown) {
            this.player.body.setAllowGravity(false)
            this.player.stateMachine.setState(new PlayerClimb(this.player))
        }
        //crouch
        if(!this.player.canClimbDown){
            if(myInput.keys[0] === "down") this.player.stateMachine.setState(new PlayerCrouch(this.player))
        }
        //slide
        else if ( (myInput.keys[0] === "swipe down"  || myInput.keys[0] === "ArrowSlide") && myInput.keypressed){
            this.player.stateMachine.setState(new PlayerSlide(this.player));
            myInput.keypressed = false;
        } 
        //roll right
        else if ( (myInput.keys[0] === "swipe right"  || myInput.keys[0] === "r") && myInput.keypressed){
            this.player.setFlipX(false);
            this.player.stateMachine.setState(new PlayerRoll(this.player));
            myInput.keypressed = false;
        }
        //roll left
        else if ( (myInput.keys[0] === "swipe left"  || myInput.keys[0] === "l") && myInput.keypressed){
            this.player.setFlipX(true);
            this.player.stateMachine.setState(new PlayerRoll(this.player));
            myInput.keypressed = false;
        } 
    }
}

//JUMP
export class PlayerJump extends PlayerState{
    constructor(player){
        super(player);
        this.name = "PlayerJump"
    }
    
    enter(){
        if(!this.player.body) return;
        this.player.jumpCount++;
        audio.play(audio.jumpSound);
        this.player.play("player-jump", true);
        this.player.setVelocityY(-this.player.speedY);
    }
    
    update(time, delta){
        if(!this.player.body) return;
        this.player.body.setAllowGravity(true);
        
        //move right
        if(myInput.keys[0] === "right" || myInput.keys[0] === "ArrowRight" || myInput.keys[0] == "d"){
            this.player.setFlipX(false);
            this.player.setVelocityX(this.player.speedX);
            myInput.keypressed = false;
        }
        //move left
        if(myInput.keys[0] === "left" || myInput.keys[0] === "ArrowLeft" || myInput.keys[0] === "a"){
            this.player.setFlipX(true);
            this.player.setVelocityX(-this.player.speedX)
            myInput.keypressed = false;
        }
        //roll right
        else if ((myInput.keys[0] === "swipe right" || myInput.keys[0] === "r") && myInput.keypressed) {
            this.player.setFlipX(false);
            this.player.stateMachine.setState(new PlayerRoll(this.player));
            myInput.keypressed = false;
        }
        //roll left
        else if ((myInput.keys[0] === "swipe left" || myInput.keys[0] === "l") && myInput.keypressed) {
            this.player.setFlipX(true);
            this.player.stateMachine.setState(new PlayerRoll(this.player));
            myInput.keypressed = false;
        }
        //fall
        if(this.player.body.velocity.y >= 0){
            this.player.stateMachine.setState(new PlayerFall(this.player));
        }
    }
}

//FALL
export class PlayerFall extends PlayerState{
    constructor(player){
        super(player);
        this.name = "PlayerFall";
    }
    
    enter(){
        if(!this.player.body) return;
        this.player.play("player-fall", true);
    }
    
    update(time, delta){
        if(!this.player.body) return;
        this.player.body.setAllowGravity(true);
        //move right
        if( (myInput.keys[0] === "right" || myInput.keys[0] === "ArrowRight" || myInput.keys[0] == "d") && myInput.keypressed){
            this.player.setFlipX(false);
            this.player.setVelocityX(this.player.speedX*0.8);
            myInput.keypressed = false;
        }
        //move left
        if( (myInput.keys[0] === "left" || myInput.keys[0] === "ArrowLeft" || myInput.keys[0] === "a") && myInput.keypressed){
            this.player.setFlipX(true);
            this.player.setVelocityX(-this.player.speedX*0.8);
            myInput.keypressed = false;
        }
        //jump again (double-jump)
        if ((myInput.keys[0] === "up" || myInput.keys[0] === "ArrowUp" || myInput.keys[0] === "w") && myInput.keypressed && this.player.jumpCount < this.player.maxJumps ) {
            this.player.stateMachine.setState(new PlayerJump(this.player))
            myInput.keypressed = false;
        }
        //idle 
        if(this.player.body.onFloor()){
            this.player.stateMachine.setState(new PlayerIdle(this.player));
        }
        //roll right
        else if ((myInput.keys[0] === "swipe right" || myInput.keys[0] === "r") && myInput.keypressed) {
            this.player.setFlipX(false);
            this.player.stateMachine.setState(new PlayerRoll(this.player));
            myInput.keypressed = false;
        }
        //roll left
        else if ((myInput.keys[0] === "swipe left" || myInput.keys[0] === "l") && myInput.keypressed) {
            this.player.setFlipX(true);
            this.player.stateMachine.setState(new PlayerRoll(this.player));
            myInput.keypressed = false;
        }
    }
}

//CLIMB
export class PlayerClimb extends PlayerState{
    constructor(player){
        super(player);
        this.name = "PlayerClimb";
    }
    
    enter(){
        if(!this.player.body) return;
        this.player.play("player-climb", true)
    }
    
    update(time, delta){
        if(!this.player.body) return;
        //while player is on ladder
        if(this.player.onLadder){
            this.player.body.setAllowGravity(false);
            //move sideways on ladder
            if (myInput.keys[0] === "right"  || myInput.keys[0] === "ArrowRight" || myInput.keys[0] === "d") {
                this.player.setFlipX(false)
                this.player.setVelocityX(this.player.speedX*1)
            }
            else if (myInput.keys[0] === "left"  || myInput.keys[0] === "ArrowLeft" || myInput.keys[0] === "a") {
                    this.player.setFlipX(true)
                    this.player.setVelocityX(-this.player.speedX*1)
            }
            else {
                this.player.setVelocityX(0)
             }
            //move up ladder      
            if (myInput.keys[0] === "up"  || myInput.keys[0] === "ArrowUp" || myInput.keys[0] === "w") {
                this.player.setVelocityY(-40)
            }
            //move down ladder
            else if (myInput.keys[0] === "down"  || myInput.keys[0] === "ArrowDown" || myInput.keys[0] === "s"){
                this.player.setVelocityY(40)
            }
            //stop moving when no key is pressed
            else{
                this.player.setVelocityY(0)
            } 
        }
        //if player is off ladder
        else{
            //jump up
            this.player.body.setAllowGravity(true);
            if(myInput.keys[0] === "up"  || myInput.keys[0] === "ArrowUp" || myInput.keys[0] === "w"){
                this.player.stateMachine.setState(new PlayerJump(this.player))
            }
            //go to walk mode
            if (myInput.keys[0] === "right"  || myInput.keys[0] === "ArrowRight" || myInput.keys[0] === "d") {
                this.player.stateMachine.setState(new PlayerWalk(this.player));
            }
            else if (myInput.keys[0] === "left"  || myInput.keys[0] === "ArrowLeft" || myInput.keys[0] === "a") {
                this.player.stateMachine.setState(new PlayerWalk(this.player));
            }
            //fall down with gravity
            else if (myInput.keys[0] === "down"  || myInput.keys[0] === "ArrowDown" || myInput.keys[0] === "s") {
                this.player.stateMachine.setState(new PlayerFall(this.player));
            } 
        }

    }
}

//HURT
export class PlayerHurt extends PlayerState{
    constructor(player){
        super(player);
        this.name = "PlayerHurt";
    }
    
    enter(){
        if(!this.player.body) return;
        
    }
    
    update(time, delta){
        if(!this.player.body) return;
    }
}

//CROUCH
export class PlayerCrouch extends PlayerState{
    constructor(player){
        super(player);
        this.name = "PlayerCrouch";
    }
    
    enter(){
        if(!this.player.body) return;
        this.player.play("player-crouch", true);
        this.player.setVelocityX(0)
    }
    
    update(time, delta){
        if(!this.player.body) return;
        //crouch walk right
        if (myInput.keys[0] === "right"  || myInput.keys[0] === "ArrowRight" || myInput.keys[0] === "d") {
            this.player.setFlipX(false);
            this.player.stateMachine.setState(new PlayerCrouchWalk(this.player));
        }
        //crouch walk left
        else if (myInput.keys[0] === "left"  || myInput.keys[0] === "ArrowLeft" || myInput.keys[0] === "a") {
            this.player.setFlipX(true)
            this.player.stateMachine.setState(new PlayerCrouchWalk(this.player)); 
        }
        //roll right
        else if ((myInput.keys[0] === "swipe right" || myInput.keys[0] === "r") && myInput.keypressed) {
            this.player.setFlipX(false);
            this.player.stateMachine.setState(new PlayerRoll(this.player));
            myInput.keypressed = false;
        }
        //roll left
        else if ((myInput.keys[0] === "swipe left" || myInput.keys[0] === "l") && myInput.keypressed) {
            this.player.setFlipX(true);
            this.player.stateMachine.setState(new PlayerRoll(this.player));
            myInput.keypressed = false;
        }
        //slide
        else if ((myInput.keys[0] === "swipe down" || myInput.keys[0] === "ArrowSlide") && myInput.keypressed) {
            this.player.stateMachine.setState(new PlayerSlide(this.player));
            myInput.keypressed = false;
        }
        //stand idle
        else if( (myInput.keys[0] === "up" ) && myInput.keypressed) {
            this.player.stateMachine.setState(new PlayerIdle(this.player));
            myInput.keypressed = false;
        }
        //climb ladder
        if(this.player.canClimbUp || this.player.canClimbDown){
            this.player.stateMachine.setState(new PlayerClimb(this.player));
        }
    }
}

//CROUCH-WALK
export class PlayerCrouchWalk extends PlayerState{
    constructor(player){
        super(player);
        this.name = "PlayerCrouchWalk";
    }
    
    enter(){
        if(!this.player.body) return;
        this.player.play("player-crouch-walk", true);
        this.player.flipX ? this.player.setVelocityX(-this.player.speedX*0.35) : this.player.setVelocityX(this.player.speedX*0.35);
    }
    
    update(time, delta){
        if(!this.player.body) return;
        if(myInput.keys[0]==="right"){
            this.player.play("player-crouch-walk", true);
            this.player.setFlipX(false);
        }
        else if(myInput.keys[0]==="left"){
            this.player.play("player-crouch-walk", true);
            this.player.setFlipX(true);
        }
        else if( (myInput.keys[0] === "up" ) && myInput.keypressed) {
            this.player.stateMachine.setState(new PlayerIdle(this.player));
            myInput.keypressed = false;
        }
        else if(myInput.keys.length === 0) {
            this.player.stateMachine.setState(new PlayerCrouch(this.player));
        }
        //roll right
        else if ((myInput.keys[0] === "swipe right" || myInput.keys[0] === "r") && myInput.keypressed) {
            this.player.setFlipX(false);
            this.player.stateMachine.setState(new PlayerRoll(this.player));
            myInput.keypressed = false;
        }
        //roll left
        else if ((myInput.keys[0] === "swipe left" || myInput.keys[0] === "l") && myInput.keypressed) {
            this.player.setFlipX(true);
            this.player.stateMachine.setState(new PlayerRoll(this.player));
            myInput.keypressed = false;
        }
        //slide
        else if ((myInput.keys[0] === "swipe down" || myInput.keys[0] === "ArrowSlide") && myInput.keypressed) {
            this.player.stateMachine.setState(new PlayerSlide(this.player));
            myInput.keypressed = false;
        }
        
    }
    
}

//ROLL
export class PlayerRoll extends PlayerState{
    constructor(player){
        super(player);
        this.name = "PlayerRoll";
    }
    
    enter(){
        if(!this.player.body) return;
        this.player.play("player-roll", true);
        this.player.flipX ? this.player.setVelocityX(-this.player.speedX) : this.player.setVelocityX(this.player.speedX);
    }
    
    update(time, delta){
        if(!this.player.body) return;
        this.player.on("animationcomplete", (animation)=>{
            if(animation.key=== "player-roll")
            this.player.stateMachine.setState(new PlayerIdle(this.player))
        })
        //slide
        if ((myInput.keys[0] === "swipe down" || myInput.keys[0] === "ArrowSlide") && myInput.keypressed) {
            this.player.stateMachine.setState(new PlayerSlide(this.player));
            myInput.keypressed = false;
        }
        //crouch
        else if (myInput.keys[0] === "down" && myInput.keypressed && !this.player.onLadder) {
            this.player.stateMachine.setState(new PlayerCrouch(this.player));
            myInput.keypressed = false;
        }
    }
}

//SLIDE
export class PlayerSlide extends PlayerState{
    constructor(player){
        super(player);
        this.name = "PlayerSlide";
    }
    
    enter(){
        if(!this.player.body) return;
        this.player.play("player-slide", true);
        this.player.flipX ? this.player.setVelocityX(-this.player.speedX) : this.player.setVelocityX(this.player.speedX);
    }
    
    update(time, delta){
        if(!this.player.body) return;
        this.player.on("animationcomplete", (animation)=>{
            if(animation.key === "player-slide")
            this.player.stateMachine.setState(new PlayerIdle(this.player))
        })
        //crouch
        if (myInput.keys[0] === "down" && myInput.keypressed && !this.player.onLadder) {
            this.player.stateMachine.setState(new PlayerCrouch(this.player));
            myInput.keypressed = false;
        }
        //roll right
        else if ((myInput.keys[0] === "swipe right" || myInput.keys[0] === "r") && myInput.keypressed) {
            this.player.setFlipX(false);
            this.player.stateMachine.setState(new PlayerRoll(this.player));
            myInput.keypressed = false;
        }
        //roll left
        else if ((myInput.keys[0] === "swipe left" || myInput.keys[0] === "l") && myInput.keypressed) {
            this.player.setFlipX(true);
            this.player.stateMachine.setState(new PlayerRoll(this.player));
            myInput.keypressed = false;
        }
        //jump
        else if (( myInput.keys[0] === "up"  || myInput.keys[0] === "ArrowUp" || myInput.keys[0] === "w") && myInput.keypressed && this.player.jumpCount < this.player.maxJumps) {
            this.player.stateMachine.setState(new PlayerJump(this.player));
            myInput.keypressed = false;
        } 
    }
}


export class PlayerStateMachine{
    constructor(player){
        this.player = player;
    }
    
    setState(state){
        this.player.currentState = state;
        state.enter(this.player);
    }
    
    updateState(state, time, delta){
        if(this.player.hasBeenHit) return;
        state.update(time, delta);
        if(this.player.body.onFloor()) this.player.jumpCount = 0;
    }
} 