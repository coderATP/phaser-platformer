import { Projectile } from "../entities/Projectile.js";

export class Projectiles extends Phaser.Physics.Arcade.Group{
    constructor(scene, key){
        super(scene.physics.world, scene);
        
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
}