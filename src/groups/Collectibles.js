/**@type {import("../typings/phaser")} */
import {Collectible} from "/src/entities/Collectible.js"

export class Collectibles extends Phaser.Physics.Arcade.StaticGroup{
    constructor(scene){
        super(scene.physics.world, scene);

        this.scene = scene;
        this.createFromConfig({
            classType: Collectible
        })

        this.defaultProperties = [
            {name: "score", type: "int", value: 1}
        ]
        
        const properties = this.mapProperties();
    }

    mapProperties(){
        //if a collectible zone on the tilemap has not been assigned a property, then assign a default property to such
        
        const collectiblesZones = this.scene.layers.collectibles.objects;
        const scores = [];
        
        collectiblesZones.forEach((zone, i)=>{
            if(!zone.properties) zone.properties = this.defaultProperties;
            scores.push(zone.properties[0].value)
 
            this.getChildren().forEach((child, j)=>{
                if(i===j){
                    //assign each child custom-tilemap-properties
                    child.properties = zone.properties
                    //give each child an index
                    child.index = i;
                }
            })
        })
        return{ scores };

    }
}