/**@type {import("../typings/phaser")} */

class Boss1State {
    constructor(boss){
        this.boss = boss;
    }
    
}

export class Boss1Idle extends Boss1State{
    constructor(boss){
        super(boss)
        this.idleDelay = 0;
        this.idleInterval = Phaser.Math.Between(500, 1000);
    }
    
    enter(){
        if(!this.boss.body || !this.player.body) return;
        this.boss.setVelocityX(0);
        
    }
    
    withinBattleRange(){
        //battle range is 200 viewport width&height to player's position
        const battleRange = { x: 200, y: 200 };
        if(!this.boss.body || !this.player.body) return;
        return( 
            Math.abs(this.boss.body.right + this.player.body.right) < battleRange.x ||
            Math.abs(this.boss.body.bottom + this.player.body.bottom) < battleRange.y
        );
            
    }
    withinAttackRange(){
        //attack range is for melee/sword: 50 viewport width to player's position
        if(!this.boss.body || !this.player.body) return;
        return (Math.abs(this.boss.body.left + this.player.body.right < 50))
    }
    update(time, delta){
        if(!this.boss.body || !this.player.body) return;
        this.boss.idleInterval = Phaser.Math.Between(500, 1000);
        this.boss.idleDelay+= delta;
        
        if(this.boss.idleDelay >= this.boss.idleInterval){
            let randomNumber = Math.random ();
            if(randomNumber < 0.33){
                this.boss.lastDirection = "right";
            }
            else if(randomNumber < 0.66){
                this.boss.lastDirection = "left";
            }
            else{
                this.boss.stateMachine.setState(new BossIWalk(this.boss));
            }
            this.boss.idleDelay = 0;
        }
    }
}


export class Boss1StateMachine{
    constructor(boss){
        this.boss = boss;
    }
    
    setState(state){
        this.boss.currentState = state;
        state.enter(this.boss);
    }
    
    updateState(state, time, delta){
        state.update(time, delta);
        if(this.boss.body.onFloor()) this.boss.jumpCount = 0;
    }
} 