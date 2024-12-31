import { Projectile } from "../entities/Projectile.js";

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
        this.scene.physics.add.collider(this, this.scene.player, (target, source)=>{
            target.decreaseHealth(source);
            target.playDamageTween(source);
            source.deactivate();
        })
    }

    onEnemyHit(){
        if(!this.scene) return;
        this.scene.enemies.getChildren().forEach(enemy=>{
            this.scene.physics.add.collider(this, enemy, (target, source)=>{
                target.decreaseHealth(source);
                target.playDamageTween(source);
                source.deactivate();
            })
        })
    }
}