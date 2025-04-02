/**@type {import("../typings/phaser")} */

class Boss1State {
    constructor(boss){
        this.boss = boss;
        this.strikeCounter = 0;
        this.strikeInterval = 1000;
        this.isTimeToStrike = false;
    }
    
    updateStrike(delta){
        if(this.strikeCounter < this.strikeInterval){
            this.strikeCounter+= delta;
            this.isTimeToStrike = false;
        }
        else{
            this.strikeCounter = 0;
            this.isTimeToStrike = true;
        }
    }
    
    update(){
        //flip player and update hitbox
        if(this.boss.toTheRightOfPlayer()){
            this.boss.setFlipX(false)
            this.boss.setOffset(46, 56)
        }
        else{
            this.boss.setFlipX(true)
            this.boss.setOffset(16, 56)
        } 
    }
}

export class Boss1Idle extends Boss1State{
    constructor(boss){
        super(boss)
        
    }
    enter(){
        if(!this.boss.body) return;
        this.boss.setVelocityX(0);
        this.boss.damage = 0;
        this.boss.play("boss1-idle", true);
    }
    update(time, delta){
        if(!this.boss.body) return;
        this.updateStrike(delta);
        
        super.update();
        //can switch between walk and run
        if(this.boss.withinBattleRange() && !this.boss.withinStrikeRangeX()){
            const randomNumber = Math.random();
            if(randomNumber < 0.01){
                this.boss.stateMachine.setState(new Boss1Walk(this.boss))
            }
            else{
                this.boss.stateMachine.setState(new Boss1Run(this.boss));
            }
        }
        
        //to strike 
        if(this.boss.withinStrikeRangeX() && this.boss.withinStrikeRangeY()){
            const randomNumber = Math.random(); 
            //if it's time to strike
            if(this.isTimeToStrike){
                if(randomNumber < 0.5) this.boss.stateMachine.setState(new Boss1BlueHeadStrike(this.boss));
                else this.boss.stateMachine.setState(new Boss1PurpleHeadStrike(this.boss))
            }
        } 
    }
}

export class Boss1Walk extends Boss1State{
    constructor(boss){
        super(boss)
        
    }
    enter(){
        if(!this.boss.body) return;
        this.boss.damage = 0;
        this.boss.play("boss1-walk", true); 
    }
    update(time, delta){
        if(!this.boss.body) return;
        super.update();
        if(this.boss.toTheRightOfPlayer() ){
            this.boss.setVelocityX(-this.boss.speedX);
        }
        else{
            this.boss.setVelocityX(this.boss.speedX);
        }
        
        //to idle 
        if(this.boss.withinStrikeRangeX() && this.boss.withinStrikeRangeY()) this.boss.stateMachine.setState(new Boss1Idle(this.boss));
        if(!this.boss.withinBattleRange()) this.boss.stateMachine.setState(new Boss1Idle(this.boss))
        if(this.boss.withinStrikeRangeX() && !this.boss.withinStrikeRangeY()) this.boss.stateMachine.setState(new Boss1Idle(this.boss)) 
    }
}
export class Boss1Run extends Boss1State{
    constructor(boss){
        super(boss)
        
    }
    enter(){
        if(!this.boss.body) return;
        this.boss.damage = 0;
        this.boss.play("boss1-run", true);
    }
    update(time, delta){
        if(!this.boss.body) return;
        super.update();
        if(this.boss.toTheRightOfPlayer() ){
            this.boss.setVelocityX(-this.boss.speedX*1.8);
        }
        else{
            this.boss.setVelocityX(this.boss.speedX*1.8);
        }

        //to running-strike
        if(this.boss.withinStrikeRangeX() && this.boss.withinStrikeRangeY()) this.boss.stateMachine.setState(new Boss1RunningStrike(this.boss));
        //to idle
        if(!this.boss.withinBattleRange()) this.boss.stateMachine.setState(new Boss1Idle(this.boss))
        if(this.boss.withinStrikeRangeX() && !this.boss.withinStrikeRangeY()) this.boss.stateMachine.setState(new Boss1Idle(this.boss))
    }
}
export class Boss1BlueHeadStrike extends Boss1State{
    constructor(boss){
        super(boss)

    }
    enter(){
        if(!this.boss.body) return;
        this.boss.damage = 15;
        this.boss.play("boss1-blue-head-strike", true);

    }
    update(time, delta){
        if(!this.boss.body) return;
        super.update();
        
        //to idle
       this.boss.once("animationcomplete", (animation)=>{
           if( /*animation.key === "boss1-purple-head-strike" */ true){
               this.boss.play("boss1-run", true);
               this.boss.scene.tweens.add({
                   targets: this.boss.body.velocity,
                   x: !this.boss.flipX ? this.boss.speedX*3 : -this.boss.speedX*3,
                   duration: 800,
                   ease: "Expo.easeOut",
                   onComplete: ()=>{
                       this.boss.stateMachine.setState(new Boss1Idle(this.boss));
                   }
                   
               })
           }
       })
        //to idle
        if(!this.boss.withinStrikeRangeX()){
            this.boss.stateMachine.setState(new Boss1Idle(this.boss))
        }
    }
} 
export class Boss1PurpleHeadStrike extends Boss1State{
    constructor(boss){
        super(boss)

    }
    enter(){
        if(!this.boss.body) return;
        this.boss.damage = 15;
        this.boss.play("boss1-purple-head-strike", true);

    }
    update(time, delta){
        if(!this.boss.body) return;
        super.update();
        
        //to idle
       this.boss.once("animationcomplete", (animation)=>{
           if( /*animation.key === "boss1-purple-head-strike" */ true){
               this.boss.play("boss1-run", true);
               this.boss.scene.tweens.add({
                   targets: this.boss.body.velocity,
                   x: !this.boss.flipX ? this.boss.speedX*3 : -this.boss.speedX*3,
                   duration: 800,
                   ease: "Expo.easeOut",
                   onComplete: ()=>{
                       this.boss.stateMachine.setState(new Boss1Idle(this.boss));
                   }
                   
               })
           }
       })
        //to idle
        if(!this.boss.withinStrikeRangeX()){
            this.boss.stateMachine.setState(new Boss1Idle(this.boss))
        }
    }
}
export class Boss1RunningStrike extends Boss1State{
    constructor(boss){
        super(boss)
        
    }
    enter(){
        if(!this.boss.body) return;
        this.boss.damage = 20;
        this.boss.play("boss1-running-strike", true);
    }
    update(time, delta){
        if(!this.boss.body) return;
        if(this.boss.toTheRightOfPlayer() ){
            this.boss.setVelocityX(-this.boss.speedX*2);
        }
        else{
            this.boss.setVelocityX(this.boss.speedX*2);
        }
        
       //to idle
       this.boss.once("animationcomplete", (animation)=>{
           if( animation.key === "boss1-running-strike"){
               this.boss.stateMachine.setState(new Boss1Bite(this.boss));
           }
       }) 
    }
}
export class Boss1Dead extends Boss1State{
    constructor(boss){
        super(boss)
        
    }
    enter(){
        if(!this.boss.body) return;
        this.boss.setVelocityX(0);
        this.boss.play("boss1-death", true);
        //flip player and update hitbox
        if(this.boss.toTheRightOfPlayer()){
            this.boss.setFlipX(false)
            this.boss.setSize(46, 6)
            this.boss.setOffset(46, 80)
        }
        else{
            this.boss.setFlipX(true)
            this.boss.setSize(46, 6)
            this.boss.setOffset(16, 80)
        }  
    }
    update(time, delta){
        if(!this.boss.body) return;

       //to cleanup
       this.boss.once("animationcomplete", (animation)=>{
           if( animation.key === "boss1-death"){
                this.boss.setVelocity(0, -100);
                this.boss.body.checkCollision.none = true;
                this.boss.setCollideWorldBounds(false);
                //then destroy boss
                this.boss.cleanupAfterDeath();
           }
       })  
    }
}
export class Boss1Hurt extends Boss1State{
    constructor(boss){
        super(boss)
        
    }
    enter(){
        if(!this.boss.body) return;
        this.boss.play("boss1-hurt", true);
    }
    update(time, delta){
        if(!this.boss.body) return;
        //to idle
        this.boss.once("animationcomplete", (animation) => {
            if (animation.key === "boss1-hurt") {
                this.boss.stateMachine.setState(new Boss1Idle(this.boss));
            }
        })
    }
}
export class Boss1Bite extends Boss1State{
    constructor(boss){
        super(boss)
        
    }
    enter(){
        if(!this.boss.body) return;
        this.boss.play("boss1-bite", true);
        this.boss.damage = 10;
    }
    update(time, delta){
        if(!this.boss.body) return;
        
        //to idle
        this.boss.once("animationcomplete", (animation)=>{
           if( animation.key === "boss1-bite"){
               this.boss.stateMachine.setState(new Boss1Run(this.boss));
           }
        })  
    }
}

export class Boss1StateMachine{
    constructor(boss){
        this.boss = boss;
    }
    
    setState(state){
        this.boss.currentState = state;
        state.enter();
    }
    
    updateState(state, time, delta){
        state.update(time, delta);
    }
} 