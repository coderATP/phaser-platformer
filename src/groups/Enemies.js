

export class Enemies extends Phaser.GameObjects.Group{
    constructor(scene){
        super(scene);
    }
    
    addCollider(otherGameObject, callback){
        this.scene.physics.add.collider(this, otherGameObject, callback, null, this) 
    } 
    addOverlap(otherGameObject, callback){
        this.scene.physics.add.overlap(this, otherGameObject, callback, null, this) 
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
}