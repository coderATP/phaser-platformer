/**@type {import("../typings/phaser")} */
import { BaseScene } from "./Base.js";


export class LevelScene extends BaseScene {
    constructor(config) {
        super('LevelScene', config);

        this.menuItems =  [
            {scene: "PlayScene", text: "Level 1"},
            {scene: "PlayScene", text: "Level 2"},
            ]
    }

    create() {
        this.add.image(0, 0, 'bg-other')
            .setOrigin(0, 0, )
            .setScale(2.2);
            
        this.createMenu(this.menuItems);
        this.handleMenuEvents()
        this.createBackButton()
            .setPosition(this.config.width-10, this.config.height-10)
    }
    
    handleMenuEvents(){
        super.handleMenuEvents();
        this.menuItems.forEach((item, index)=>{
            item.textObject.on("pointerup", ()=>{
                this.registry.set("level", index+1)
            })
        })
    }

}