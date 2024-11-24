/**@type {import("../typings/phaser")} */
import { BaseScene } from "./Base.js";


export class MenuScene extends BaseScene{
    constructor(config){
        super('MenuScene', config);

        this.menuItems=[
            {scene: 'PlayScene', text: 'Play'},
            {scene: 'LevelScene', text: 'Levels'},
            {scene: null, text: 'Exit'},
       ]
    }
    
    create(){
        this.add.image(0,0,'bg-other')
            .setOrigin(0,0,)
            .setScale(2.2);
        
        this.createMenu(this.menuItems);
        this.handleMenuEvents();
    }

    update(){
        
    }
}