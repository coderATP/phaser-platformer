import { Projectile } from "../entities/Projectile.js";
import { audio } from "../audio/AudioControl.js";

export class Projectiles extends Phaser.Physics.Arcade.Group{
    constructor(scene, key){
        super(scene.physics.world, scene);
        
        this.scene = scene;
        this.createMultiple({
            key: key,
            frameQuantity: 5,
            visible: false,
            active: false,
            classType: Projectile,
        })
    }
    
    getFreeProjectile(){
        const projectile = this.getFirstDead(false);
        return projectile;
    }
    
    onPlatformHit(){
        if(!this.scene) return;
        this.scene.physics.add.collider(this, this.scene.mapLayers.collisionblocks, (source, target)=>{
            source.deactivate();
        })
    }
    
    onPlayerHit(){
        if(!this.scene) return;
        this.scene.physics.add.overlap(this, this.scene.player, (target, source)=>{
            if(!this.scene.player.immuneToDamage){
                target.decreaseHealth(source);
                target.playDamageTween(source);
                audio.play(audio.projectileImpactSound);
                audio.play(audio.playerHitSound);
            }
            source.deactivate();
        })
    }

    onEnemyHit(){
        if(!this.scene) return;
        this.scene.enemies.getChildren().forEach(enemy=>{
            this.scene.physics.add.collider(this, enemy, (target, source)=>{
                if(!enemy.immuneToDamage){
                    target.decreaseHealth(source, 1);
                    target.playDamageTween(source);
                    audio.play(audio.projectileImpactSound);
                }
                source.deactivate();
            })
        })
    }
    
    onBoss1Hit(){
        if(!this.scene) return;
        this.scene.physics.add.collider(this, this.scene.boss1, (target, source)=>{
            target.decreaseHealth(source);
            target.playDamageTween(source);
            audio.play(audio.projectileImpactSound);
           // audio.play(audio.playerHitSound);
            source.deactivate();
        })
    }
}