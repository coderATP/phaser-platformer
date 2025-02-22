import { Door } from "../entities/Door.js";

export class Doors extends Phaser.GameObjects.Group{
    constructor(scene){
        super(scene);
        this.scene = scene;
    }
    
    createDoors() {
        if (!this.scene.mapLayers) return;
        this.scene.mapLayers.exit_zone.forEach(zone => {
            this.add(new Door(this.scene, zone.x, zone.y, "exitDoor"));
        })
    }
    
    addOverlap(otherGameObject){
        const overlap = this.scene.physics.add.overlap(this, otherGameObject, (source, target)=>{
            overlap.active = false;
            this.scene.onDoorOverlap(source, target);
        });
    }
    
    update(){
        if(!this.scene) return;
        this.getChildren().forEach(child=>{
            //child.body.velocity.x !== 0 && child.play("orc-run", true);
            
            //add health
            
        })
    }
}