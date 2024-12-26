/**@type {import("../typings/phaser")} */

class EnemyState {
    constructor(){
        
    }
    
}

export class EnemyIdle extends EnemyState{
    constructor(){
        super();
        this.idleDelay = 0;
        this.idleInterval = Phaser.Math.Between(500, 1000);
    }
    
    enter(enemy){
        if(!enemy.body) return;
        enemy.setVelocityX(0);
        
    }
    
    update(enemy, time, delta){
        if(!enemy.body) return;
        this.idleInterval = Phaser.Math.Between(500, 1000);
        this.idleDelay+= delta;
        
        if(this.idleDelay >= this.idleInterval){
            let randomNumber = Math.random ();
            if(randomNumber < 0.33){
                enemy.lastDirection = "right";
            }
            else if(randomNumber < 0.66){
                enemy.lastDirection = "left";
            }
            else{
                enemy.enemyStateMachine.setState(ENEMY_STATES.RUN, enemy);
            }
            this.idleDelay = 0;
        }
    }
}


export class EnemyRun extends EnemyState{
    constructor(){
        super();
        this.distanceCovered = 0;
        this.canIdle = false;
    }
    
    enter(enemy){
        if(!enemy.body) return;
        (enemy.lastDirection === "right") ? enemy.setVelocityX(enemy.speedX) : enemy.setVelocityX(-enemy.speedX);
    }
    
    updateDistanceCovered(enemy){
        if(!enemy.body) return;
        const bodyPosDiff = Math.abs(enemy.x - enemy.body.prev.x);
        
        let maxDistance = Phaser.Math.Between(600, 1000);
        
        if(this.distanceCovered < maxDistance){
            this.distanceCovered += bodyPosDiff;
            this.canIdle = false;
        }
        else{
            maxDistance = Phaser.Math.Between(600, 1200);
            this.distanceCovered = 0;
            this.canIdle = true;
        }
    }
    
    update(enemy, time, delta){
        if(!enemy.body) return;
        this.updateDistanceCovered(enemy);
        
        enemy.turnTimer += delta;
        
        if(this.canIdle){
           enemy.enemyStateMachine.setState(ENEMY_STATES.IDLE, enemy);
        }
        //RAY
        if (!enemy.rayHasHit && enemy.turnTimer > enemy.turnInterval) {
            enemy.speedX *= -1;
            enemy.setVelocityX(enemy.speedX);
            
            enemy.turnTimer = 0;
        }
        
        //SENSOR
        if(enemy.sensorHasHit  && enemy.turnTimer > enemy.turnInterval ){
            enemy.speedX *= -1;
            enemy.setVelocityX(enemy.speedX)
                
            enemy.turnTimer = 0;
        }
        
        //flip appropriately
        if(enemy.body.velocity.x > 0) enemy.lastDirection = "right";
        if(enemy.body.velocity.x < 0) enemy.lastDirection = "left";
    }
}


export const ENEMY_STATES = {
    IDLE: new EnemyIdle(),
    RUN: new EnemyRun()
}

export class EnemyStateMachine{
    constructor(){
        
    }
    
    setState(state, enemy){
        enemy.currentState = state;
        state.enter(enemy);
    }
    
    updateState(state, enemy, time, delta){
        state.update(enemy, time, delta);
    }
} 