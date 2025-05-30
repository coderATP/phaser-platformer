import { myInput } from "../myInput.js";
import { ENEMY_STATES } from "../states/EnemyStates.js";
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
        this.player.setVelocityY(0)
            .setVelocityX(0)
            .setAlpha(1);
        this.player.immuneToDamage = false;
    }
    
    update(time, delta){
        if(!this.player.body) return;
        //disable gravity when on slope, and vice versa
        this.player.isOnSlope ? this.player.body.setAllowGravity(false) : this.player.body.setAllowGravity(true);
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
        else if ( !this.player.isOnSlope && (myInput.keys[0] === "swipe down"  || myInput.keys[0] === "ArrowSlide") && myInput.keypressed){
            this.player.stateMachine.setState(new PlayerSlide(this.player));
            myInput.keypressed = false;
        }
        //crouch
        else if (myInput.keys[0] === "down" && myInput.keypressed && !this.player.onLadder) {
            this.player.stateMachine.setState(new PlayerCrouch(this.player));
            myInput.keypressed = false;
        }
        //jump
        else if ( ( myInput.keys[0] === "up"  || myInput.keys[0] === "ArrowUp" || myInput.keys[0] === "w") && myInput.keypressed && this.player.jumpCount < this.player.maxJumps) {
            this.player.stateMachine.setState(new PlayerJump(this.player));
            myInput.keypressed = false;
        }
        //slash
        else if (( myInput.keys[0] === "slash"  || myInput.keys[0] === "Enter") && myInput.keypressed) {
            this.player.stateMachine.setState(new PlayerSlashAttack1(this.player));
            myInput.keypressed = false;
        }

        //climb
        if (this.player.canClimbUp || this.player.canClimbDown) {
            this.player.body.setAllowGravity(false)
            this.player.stateMachine.setState(new PlayerClimb(this.player))
        }
        
        if(this.player.body.onFloor() || this.player.isOnSlope) this.player.jumpCount = 0;
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
        this.player.immuneToDamage = false; 
    }
    
    update(time, delta){
        if(!this.player.body) return;
        //player maxVelocity
        if (this.player.body.velocity.x > this.player.speedX){
            this.player.body.velocity.x = this.player.speedX
        }
        if (this.player.body.velocity.x < -this.player.speedX){
            this.player.body.velocity.x = -this.player.speedX
        }
        //climb
        if (this.player.canClimbUp || this.player.canClimbDown) {
            this.player.body.setAllowGravity(false)
            this.player.stateMachine.setState(new PlayerClimb(this.player))
        } 
        //jump
        if(this.player.body.onFloor() || this.player.isOnSlope) this.player.jumpCount = 0;
        if (( myInput.keys[0] === "up"  || myInput.keys[0] === "ArrowUp" || myInput.keys[0] === "w") && myInput.keypressed && this.player.jumpCount < this.player.maxJumps) {
            this.player.stateMachine.setState(new PlayerJump(this.player))
            myInput.keypressed = false;
        }
        //crouch
        else if(myInput.keys[0] === "down"){
            if(!this.player.canClimbDown) this.player.stateMachine.setState(new PlayerCrouch(this.player))
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
        //slash-combo
        else if ((myInput.keys[0] === "slash" || myInput.keys[0] === "Enter") && myInput.keypressed) {
            this.player.stateMachine.setState(new PlayerSlashAttackCombo(this.player));
            myInput.keypressed = false;
        }
        //idle     
        else if(myInput.keys.length === 0 ){
            this.player.stateMachine.setState(new PlayerIdle(this.player));
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
        this.player.immuneToDamage = false;
    }
    
    update(time, delta){
        if(!this.player.body) return;
        
        //jump again (double-jump)
        if ((myInput.keys[0] === "up" || myInput.keys[0] === "ArrowUp" || myInput.keys[0] === "w") && myInput.keypressed && this.player.jumpCount < this.player.maxJumps ) {
            this.player.stateMachine.setState(new PlayerJump(this.player))
            myInput.keypressed = false;
        } 
        //move right
        if(myInput.keys[0] === "right" || myInput.keys[0] === "ArrowRight" || myInput.keys[0] == "d"){
            this.player.setFlipX(false);
            this.player.setVelocityX(this.player.speedX*0.75);
            myInput.keypressed = false;
        }
        //move left
        if(myInput.keys[0] === "left" || myInput.keys[0] === "ArrowLeft" || myInput.keys[0] === "a"){
            this.player.setFlipX(true);
            this.player.setVelocityX(-this.player.speedX*0.75)
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
        //slash-combo
        if ((myInput.keys[0] === "slash" || myInput.keys[0] === "Enter") && myInput.keypressed) {
            this.player.stateMachine.setState(new PlayerSlashAttackCombo(this.player));
            myInput.keypressed = false;
        }
        //fall
        if(this.player.body.velocity.y >= 0){
            if(this.player.currentState.name !== "PlayerSlashAttackCombo")
            this.player.stateMachine.setState(new PlayerFall(this.player));
        }
        //climb
        if (this.player.onLadder) {
            this.player.body.setAllowGravity(false)
            this.player.stateMachine.setState(new PlayerClimb(this.player))
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
        this.player.immuneToDamage = false;
    }
    
    update(time, delta){
        if(!this.player.body) return;
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
        if(this.player.body.onFloor() || this.player.isOnSlope){
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
        //slash
        if ((myInput.keys[0] === "slash" || myInput.keys[0] === "Enter") && myInput.keypressed) {
            this.player.stateMachine.setState(new PlayerSlashAttackCombo(this.player));
            myInput.keypressed = false;
        }
        //climb
        if (this.player.onLadder) {
            this.player.body.setAllowGravity(false)
            this.player.stateMachine.setState(new PlayerClimb(this.player))
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
        this.player.play("player-climb", true);
        this.player.setVelocityX(0);
        this.player.setVelocityX(0);
        this.player.immuneToDamage = false;
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
        this.player.immuneToDamage = true;
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
        this.player.setVelocityX(0);
        this.player.setAlpha(0.3);
        this.player.immuneToDamage = false;
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
        //slash-attack1
        else if ((myInput.keys[0] === "slash" || myInput.keys[0] === "Enter") && myInput.keypressed) {
            this.player.stateMachine.setState(new PlayerSlashAttack1(this.player));
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
        this.player.setAlpha(0.3);
        this.player.flipX ? this.player.setVelocityX(-this.player.speedX*0.35) : this.player.setVelocityX(this.player.speedX*0.35);
        this.player.immuneToDamage = false;
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
        //slash-combo
        else if ((myInput.keys[0] === "slash" || myInput.keys[0] === "Enter") && myInput.keypressed) {
            this.player.stateMachine.setState(new PlayerSlashAttackCombo(this.player));
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
        this.player.flipX ? this.player.setVelocityX(-this.player.speedX*1.5) : this.player.setVelocityX(this.player.speedX*1.5);
        this.player.immuneToDamage = true;
    }
    
    update(time, delta){
        if(!this.player.body) return;
        this.player.once("animationcomplete", (animation)=>{
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
        this.player.flipX ? this.player.setVelocityX(-this.player.speedX*1.5) : this.player.setVelocityX(this.player.speedX*1.5);
        this.player.immuneToDamage = false;
    }
    
    onHitEnemy(){
        const { x, y, width, height} = this.player.body;
        this.player.scene.enemies.getChildren().forEach(enemy=> {
            if(Phaser.Geom.Intersects.RectangleToRectangle(
                new Phaser.Geom.Rectangle(x, y, width, height),
                new Phaser.Geom.Rectangle(enemy.body.x, enemy.body.y, enemy.body.width, enemy.body.height)
            )){
                enemy.decreaseHealth(enemy.scene.player, 1.5);
                enemy.playDamageTween(enemy.scene.player);
                enemy.stateMachine.setState(ENEMY_STATES.FALL, enemy);
            }
        })
    }
    update(time, delta){
        if(!this.player.body) return;
        
        this.onHitEnemy();
        this.player.once("animationcomplete", (animation)=>{
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

//Slash-ATTACK-1
export class PlayerSlashAttack1 extends PlayerState{
    constructor(player){
        super(player);
        this.name = "PlayerSlashAttack1";
        audio.play(audio.slashSound);
        this.hasDealtDamage = false;
    }
    
    enter(){
        if(!this.player.body) return;
        this.player.play("player-attack1", true);
        this.player.flipX ? this.player.setVelocityX(-this.player.speedX*0.3) : this.player.setVelocityX(this.player.speedX*0.3);
        this.player.immuneToDamage = false;
    }
    
    update(time, delta){
        if(!this.player.body) return;
        this.player.once("animationcomplete", (animation) => {
            if (animation.key === "player-attack1"){
                
                this.player.stateMachine.setState(new PlayerIdle(this.player))
            }
        })
        //slash again
        if ((myInput.keys[0] === "slash" || myInput.keys[0] === "Enter") && myInput.keypressed) {
            this.player.stateMachine.setState(new PlayerSlashAttack2(this.player));
            myInput.keypressed = false;
        }
        
        //deal damage
        const attack = this.player.checkSwordIntersection();
        //check if sword is intersecting with victim, once
        if(attack.isIntersecting && !this.hasDealtDamage){
            attack.victim.decreaseHealth(this.player.sword.swordObject)
            this.hasDealtDamage = true
        }
    }
}

//Slash-ATTACK-2
export class PlayerSlashAttack2 extends PlayerState{
    constructor(player){
        super(player);
        this.name = "PlayerSlashAttack2";
        audio.play(audio.slashSound); 
    }
    
    enter(){
        if(!this.player.body) return;
        this.player.play("player-attack2", true);
        this.player.flipX ? this.player.setVelocityX(-this.player.speedX*0.3) : this.player.setVelocityX(this.player.speedX*0.3);
        this.player.immuneToDamage = false;
    }
    
    update(time, delta){
        if(!this.player.body) return;
        
        this.player.once("animationcomplete", (animation) => {
            
            if (animation.key === "player-attack2")
                this.player.stateMachine.setState(new PlayerIdle(this.player))
        })
        //deal damage
        const attack = this.player.checkSwordIntersection();
        //check if sword is intersecting with victim, once
        if(attack.isIntersecting && !this.hasDealtDamage){
            attack.victim.decreaseHealth(this.player.sword.swordObject)
            this.hasDealtDamage = true
        } 
    }
}

//Slash-ATTACK-COMBO
export class PlayerSlashAttackCombo extends PlayerState {
    constructor(player) {
        super(player);
        this.name = "PlayerSlashAttackCombo";
        audio.play(audio.slashSound);
    }
    
    enter() {
        if (!this.player.body) return;
        this.player.play("player-attack-combo", true);
        this.player.setVelocityY(this.player.speedY*0.5)
        this.player.flipX ? this.player.setVelocityX(-this.player.speedX*0.7) : this.player.setVelocityX(this.player.speedX*0.7);
        this.player.immuneToDamage = false;
    }
    
    update(time, delta) {
        if (!this.player.body) return;
        
        this.player.once("animationcomplete", (animation) => {
            
            if (animation.key === "player-attack-combo")
                this.player.stateMachine.setState(new PlayerIdle(this.player))
        })
        //deal damage
        const attack = this.player.checkSwordIntersection();
        //check if sword is intersecting with victim, once
        if(attack.isIntersecting && !this.hasDealtDamage){
            attack.victim.decreaseHealth(this.player.sword.swordObject, 1.5)
            this.hasDealtDamage = true
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
        if(this.player.body.onFloor() || this.player.isOnSlope) this.player.jumpCount = 0;
    }
} 