import { myInput } from "../myInput.js";
import { audio } from "../audio/AudioControl.js";

class PlayerState{
    constructor(player){
        this.player = player;
    }
}

//IDLE
export class PlayerIdle extends PlayerState{
    constructor(player){
        super(player);
        
    }
    
    enter(){
        if(!this.player.body) return;
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
        //jump
        if(this.player.body.onFloor()) this.player.jumpCount = 0;
        if (( myInput.keys[0] === "up"  || myInput.keys[0] === "ArrowUp" || myInput.keys[0] === "w") && myInput.keypressed && this.player.jumpCount < this.player.maxJumps) {
            audio.play(audio.jumpSound);
            this.player.jumpCount ++;
            this.player.setVelocityY(-this.player.speedY)
            myInput.keypressed = false;
        }
        
        //climb
        if(this.onLadder && (myInput.keys[0] === "right"  || myInput.keys[0] === "ArrowRight" || myInput.keys[0] === "d"|| myInput.keys[0] === "left"  || myInput.keys[0] === "ArrowLeft" || myInput.keys[0] === "a")){
            this.player.body.setAllowGravity(false)
        } 
        if (this.player.canClimbUp || this.player.canClimbDown) {
            this.player.body.setAllowGravity(false)
            this.player.stateMachine.setState(new PlayerClimb(this.player))
        } 
    }
}

//WALK
export class PlayerWalk extends PlayerState{
    constructor(player){
        super(player);
        
    }
    
    enter(){
        if(!this.player.body) return;
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
            audio.play(audio.jumpSound);
            this.player.jumpCount ++;
            this.player.setVelocityY(-this.player.speedY)
            this.player.stateMachine.setState(new PlayerJump(this.player))
            myInput.keypressed = false;
        }
        //climb
        if(this.onLadder && (myInput.keys[0] === "right"  || myInput.keys[0] === "ArrowRight" || myInput.keys[0] === "d"|| myInput.keys[0] === "left"  || myInput.keys[0] === "ArrowLeft" || myInput.keys[0] === "a")){
            this.player.body.setAllowGravity(false)
        } 
        if (this.player.canClimbUp || this.player.canClimbDown) {
            this.player.body.setAllowGravity(false)
            this.player.stateMachine.setState(new PlayerClimb(this.player))
        }
    }
}

//JUMP
export class PlayerJump extends PlayerState{
    constructor(player){
        super(player);
        
    }
    
    enter(){
        if(!this.player.body) return;
        this.player.setVelocityY(-this.player.speedY);
        
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
        if (myInput.keys[0] === "left"  || myInput.keys[0] === "ArrowLeft" || myInput.keys[0] === "a") {
            this.player.playWalkSound(delta);
            this.player.setFlipX(true);
            this.player.stateMachine.setState(new PlayerWalk(this.player)); 
        }
        //fall
        if(this.player.speedY >= 0){
            this.player.stateMachine.setState(new PlayerFall(this.player));
        }
    }
}

//FALL
export class PlayerFall extends PlayerState{
    constructor(player){
        super(player);
        
    }
    
    enter(){
        if(!this.player.body) return;
        
    }
    
    update(time, delta){
        if(!this.player.body) return;
        this.player.body.setAllowGravity(true);

        //walk right
        if (myInput.keys[0] === "right" || myInput.keys[0] === "ArrowRight" || myInput.keys[0] === "d") {
            this.player.playWalkSound(delta);
            this.player.setFlipX(false);
            this.player.stateMachine.setState(new PlayerWalk(this.player));
        }
        //walk left
        if (myInput.keys[0] === "left" || myInput.keys[0] === "ArrowLeft" || myInput.keys[0] === "a") {
            this.player.playWalkSound(delta);
            this.player.setFlipX(true);
            this.player.stateMachine.setState(new PlayerWalk(this.player));
        }
        //fall 
        if(this.player.body.onFloor()){
            this.player.stateMachine.setState(new PlayerWalk(this.player));
        }
    }
}

//CLIMB
export class PlayerClimb extends PlayerState{
    constructor(player){
        super(player);
        
    }
    
    enter(){
        if(!this.player.body) return;
    }
    
    update(time, delta){
        if(!this.player.body) return;
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
        //jump off ladder
        if(!this.player.onLadder){
            if(myInput.keys[0] === "up"  || myInput.keys[0] === "ArrowUp" || myInput.keys[0] === "w"){
                this.player.stateMachine.setState(new PlayerJump(this.player))
            }
        }
    }
}

//HURT
export class PlayerHurt extends PlayerState{
    constructor(){
        super();
        
    }
    
    enter(player){
        if(!player.body) return;
        
    }
    
    update(player, time, delta){
        if(!player.body) return;
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
        state.update(time, delta);
        if(this.player.body.onFloor()) this.player.jumpCount = 0;
    }
} 