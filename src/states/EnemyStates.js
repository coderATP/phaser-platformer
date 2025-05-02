/**@type {import("../typings/phaser")} */

class EnemyState {
    constructor(){
        this.name;
    }
    
}

export class EnemyIdle extends EnemyState{
    constructor(){
        super();
        this.idleDelay = 0;
        this.idleInterval = Phaser.Math.Between(500, 1000);
        this.name = "EnemyIdle";
    }
    
    enter(enemy){
        if(!enemy.body) return;
        enemy.immuneToDamage = false;
        enemy.setVelocityX(0);
    }
    
    update(enemy, time, delta){
        if(!enemy.body) return;
        enemy.play(enemy.name+"-idle", true);
        enemy.setSize(10, 26);
        enemy.setOffset(enemy.width * 0.35, enemy.height * 0.2);
        
        if(enemy.hasBeenHit) return;
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
                enemy.stateMachine.setState(ENEMY_STATES.RUN, enemy);
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
        this.name = "EnemyRun";
    }
    
    enter(enemy){
        if(!enemy.body) return;
        enemy.immuneToDamage = false;
        (enemy.lastDirection === "right") ? enemy.setVelocityX(enemy.speedX) : enemy.setVelocityX(-enemy.speedX);
    }
    
    updateDistanceCovered(enemy){
        if(!enemy.body) return;
        if(enemy.hasBeenHit) return;
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
        enemy.setSize(10, 26);
        (enemy.flipX) ? enemy.setOffset(enemy.width * 0.4, enemy.height * 0.58) : enemy.setOffset(enemy.width * 0.45, enemy.height * 0.58); 
 
        enemy.play(enemy.name+"-run", true); 
        this.updateDistanceCovered(enemy);
        
        enemy.turnTimer += delta;
        
        if(this.canIdle){
           enemy.stateMachine.setState(ENEMY_STATES.IDLE, enemy);
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

export class EnemyFall extends EnemyState{
    constructor(){
        super();
        this.fallTimer = 0;
        this.fallInterval = 3000; //ms
        this.name = "EnemyFall";

    }
    enter(enemy){
        if(!enemy.body) return;
        enemy.scene.player.flipX ? enemy.setVelocity(-80, -400) : enemy.setVelocity(80, -400);
    }
    
    update(enemy, time, delta){
        if(!enemy || !enemy.body) return;
        enemy.play(enemy.name+"-death", true);
        enemy.on("animationcomplete", (animation)=>{
            switch(animation.key){
                case "skeleton-base-death" : case "skeleton-mage-death" : case "skeleton-rogue-death":{
                    enemy.setSize(10, 8);
                    enemy.setOffset(enemy.width * 0.43, enemy.height * 0.82);
                break;
                }
                case "skeleton-warrior-death":{
                    enemy.setSize(10, 8);
                    enemy.setOffset(enemy.width * 0.43, enemy.height * 0.76);
                break;
                }
            } 
        });
        
        if(this.fallTimer < this.fallInterval){
            this.fallTimer+= delta;
            enemy.immuneToDamage = true;
        }
        else{
            this.fallTimer = 0;
            enemy.immuneToDamage = false;
            enemy.stateMachine.setState(ENEMY_STATES.IDLE, enemy);
        }
        
    }
}

export const ENEMY_STATES = {
    IDLE: new EnemyIdle(),
    RUN: new EnemyRun(),
    FALL: new EnemyFall()
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