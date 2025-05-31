import { Coin } from "../entities/Coin.js";
import { audio } from "../audio/AudioControl.js";

export class Coins extends Phaser.Physics.Arcade.Group{
    constructor(scene, key){
        super(scene.physics.world, scene);
        
        this.scene = scene;
        this.createMultiple({
            key: key,
            frameQuantity: 5,
            visible: false,
            active: false,
            classType: Coin,
        })
        
        this.init()
    }
    
    init(){
       this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);//update params
    }
    
    
    dropCoins(x, y, anim = "gold-coin") {
        this.getChildren().forEach(coin=>{
            coin.setActive(true)
                .setVisible(true)
                .setGravityY(982)
            coin.x = x;
            coin.y = y;
            coin.play(anim);
            coin.setVelocityX(coin.speedX).setVelocityY(coin.speedY)
        })
        return this;
    }
    
    update(time, delta){
      //  console.log (this.getChildren()[0].initialX )
    }
}