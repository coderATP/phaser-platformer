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
    
    addCollider(otherGameObject, callback) {
        this.scene.physics.add.collider(this, otherGameObject, callback, null, this);
    }
    
    getFreeProjectile(){
        const projectile = this.getFirstDead(false);
        return projectile;
    }
    
    getProjectiles(){
        const projectiles = new Phaser.GameObjects.Group();
        
        this.getChildren().forEach(enemy=>{
            if(enemy.projectiles){
                projectiles.addMultiple(enemy.projectiles.getChildren());
            }
        })
        
        return projectiles;
    }
    
    onPlatformHit(){
        if(!this.scene) return;
        this.scene.physics.add.collider(this, this.scene.mapLayers.collisionblocks, (source, target)=>{
            source.deactivate();
        })
    }
    
    onPlayerHit(){
        if(!this.scene) return;
        this.scene.physics.add.collider(this, this.scene.player, (source, target)=>{
            this.scene.tweens.add({
                targets: source,
                health: source.health - target.damage,
                duration: 800,
                repeat: 0,
            })
            target.deactivate();
        })
    }

    onEnemyHit(){
        if(!this.scene) return;
        this.scene.enemies.getChildren().forEach(enemy=>{
            this.scene.physics.add.collider(this, enemy, (source, target)=>{
                this.scene.tweens.add({
                    targets: source,
                    health: source.health - target.damage,
                    duration: 800,
                    repeat: 0,
                })
                target.deactivate();
            }) 
        })
    }
     
}