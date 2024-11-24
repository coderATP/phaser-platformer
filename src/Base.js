/**@type {import("../typings/phaser")} */

export class BaseScene extends Phaser.Scene{
    constructor(key, config){
        super(key);
        this.config =  config;
        this.screenCenter= [this.config.width/2, this.config.height/2];
        this.lineHeight = 72;
        this.backButton = null;
    }
    
    createBackButton(){
        const backButtonPos= [this.config.bottomRight.x-10, this.config.bottomRight.y -10];
        const backButton= this.add.image(...backButtonPos, 'backButton')
            .setOrigin(1)
            .setScale(2)
            .setInteractive().setDepth(20)
        backButton.on('pointerup', () =>{
                this.scene.start('MenuScene');
        })
        
        return backButton;
    }
    createMenu(menuItems){
        const levels = this.registry.get("unlocked_levels")
        let menuItemPosY= 0;
        menuItems.forEach(item=>{
            item.textObject= this.add.text(this.screenCenter[0], this.screenCenter[1]+ menuItemPosY, item.text, {font: '52px Serif'})
            .setInteractive()
            .setOrigin(0.5, 1)
            .setStyle({fill: 'brown'}) 
            menuItemPosY +=this.lineHeight;
        })
    }
    
    handleMenuEvents(){
        this.menuItems.forEach(item=>{
            //style texts
          item.textObject.on('pointerover', ()=>{
                item.textObject.setStyle({fill: 'yellow'});
            });
            item.textObject.on('pointerout', ()=>{
                item.textObject.setStyle({fill: 'brown'});
            });
          //move to play scene
            item.textObject.on('pointerup', ()=>{
                this.scene.start(item.scene);
                //destroy game on clicking Exit
                if(item.text=='Exit')this.game.destroy(true);
            })
         })
        
    } 
}