/**@type {import("../typings/phaser")} */
import { FloatingMessage } from "../entities/FloatingMessage.js";
import { Coins } from "../groups/Coins.js";


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
        enemy.shootProjectile(delta);
        enemy.play(enemy.name+"-idle", true);
        enemy.setSize(10, 26);
        enemy.setOffset(enemy.width * 0.35, enemy.height * 0.2);
        
        if(enemy.hasBeenHit) return;
        this.idleInterval = Phaser.Math.Between(500, 1000);
        this.idleDelay+= delta;
        
        //run
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
        //fall
        if(enemy.health <= 0){
            enemy.stateMachine.setState(ENEMY_STATES.FALL, enemy);
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
        const bodyPosDiff = Math.abs(enemy.body.x - enemy.body.prev.x);
        
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
        enemy.shootProjectile(delta)
        enemy.setSize(10, 26);
        (enemy.flipX) ? enemy.setOffset(enemy.width * 0.4, enemy.height * 0.58) : enemy.setOffset(enemy.width * 0.45, enemy.height * 0.58); 
 
        enemy.play(enemy.name+"-run", true); 
        this.updateDistanceCovered(enemy);
        
        enemy.turnTimer += delta;
        //idle
        if(this.canIdle){
           enemy.stateMachine.setState(ENEMY_STATES.IDLE, enemy);
        }
        //fall
        if(enemy.health <= 0){
            enemy.stateMachine.setState(ENEMY_STATES.FALL, enemy);
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
        enemy.immuneToDamage = true;
        enemy.scene.player.flipX ? enemy.setVelocity(-80, -400) : enemy.setVelocity(80, -400);
        enemy.play(enemy.name+"-fall", true);
        enemy.setSize(10, 8);
        enemy.setOffset(enemy.width * 0.43, enemy.height * 0.82);
    }
    
    update(enemy, time, delta){
        if(!enemy || !enemy.body) return;
        this.floatingMessage&& this.floatingMessage.update();
        
        enemy.setDrag(40, 200); //slow down over time
        const { topLeft } = enemy.scene.config;
        if(this.fallTimer < this.fallInterval){
            this.fallTimer+= delta;
        }
        else{
            this.fallTimer = 0;
            //if enemy's health is drained
            if(enemy.health <= 0){
                enemy.sendToGrave(); //disable world bounds (:
                enemy.scene.player.increaseScore(enemy.maxHealth); //increase player score
                enemy.scene.player.playCoinCollectSound(); // play coin_collected sound
                const { topLeft, topRight} = enemy.config;
                //enemy drop coins
                enemy.coins = new Coins(enemy.scene, 'gold-coin')
                    .dropCoins(enemy.body.center.x, enemy.body.center.y-8, 'gold-coin');
                
                return;
            }
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