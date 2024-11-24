
/**@type {import("../typings/phaser")} */

import { BaseScene } from "./Base.js"
import { Player } from "/src/entities/Player.js";
import { Birdman } from "/src/entities/Birdman.js";
import { Snaky } from "/src/entities/Snaky.js";
import { Enemies } from "/src/groups/Enemies.js";
import { Collectibles } from "/src/groups/Collectibles.js";
import { Collectible } from "/src/entities/Collectible.js";
import { HUD } from "/src/hud/Container.js"
import { eventEmitter } from "/src/events/EventEmitter.js"

export class PlayScene extends BaseScene{
    constructor(config){
       super('PlayScene', config);
       this.config = config;
       this.enemies = new Enemies(this);
       this.player = null;
       this.diamonds = null;
       
    }
    
    create({gameStatus}){
        //play audio 
        this.playThemeMusic();
        //generic playstate animations
        this.handleAnimations();
        
        //map
        const map = this.createMap();
        
        //bg
        this.createBG(map); 
        //map layers
        this.layers = this.createLayers(map);
        //player start and end zones
        const playerZones = this.getPlayerZones(this.layers.playerZones);
        //player
        this.player = this.createPlayer(playerZones.start.x, playerZones.start.y);
        //collectibles
        //diamonds
        this.diamonds = this.createDiamonds();

        //end of level
        this.createEndOfLevel(playerZones.end, this.player);
        //birdman (enemy)
        this.createEnemies(map);
        
        //hud
        this.hud = new HUD(this, 0, 0);
        
        //back button
        this.backButton = super.createBackButton().setScrollFactor(0)
        
        //NON-BATTLE COLLISIONS
        //collider /player vs platforms
        this.player.addCollider(this.layers.platformsColliders);
        //collider /enemy vs platforms
        this.enemies.addCollider(this.layers.platformsColliders);
        //collider diamonds vs player
        this.player.addOverlap(this.diamonds, (source, target)=>{
            this.onDiamondCollection(source, target);
        })
        //BATTLE COLLISIONS
        //collider /enemy vs player
        this.enemies.addCollider(this.player, (source, target)=>{
            this.onPlayerCollisionWithEnemy(source, target);
        });
        //collider /enemy vs player projectiles
        this.enemies.addCollider(this.player.projectiles, (source, target)=>{
            this.onCollisionWithWeapon(source, target);
        })
        //collider /player vs enemy projectiles
        this.player.addCollider(this.enemies.getProjectiles(), (source, target)=>{
            this.onCollisionWithWeapon(source, target);
        })
        
        //collider /enemy vs player sword
        this.enemies.addOverlap(this.player.sword, (source, target)=>{
            this.onCollisionWithWeapon(source, target);
        }) 
        //collider /traps vs player
        this.player.addCollider(this.layers.traps, (source, target)=>{
            this.onPlayerCollisionWithEnemy(target, source)
        })   
        //camera
        this.cameraFollow(this.player);
        
        //game events
        if(gameStatus !== "PLAYER_LOSE") this.createGameEvents();
         
    }
    
    createDiamonds(){
        const diamonds = new Collectibles(this).setDepth(-1);
        const diamondsZones = this.layers.collectibles.objects;
        diamondsZones.forEach(zone=>{
            diamonds.get(zone.x, zone.y, "diamond");
        });
        //diamonds.playAnimation("diamond-shine");
        return diamonds
    }

    onDiamondCollection(player, diamond){
        this.scores = this.diamonds.mapProperties().scores;
        
        this.scores.forEach((score, index)=>{
            if(index === diamond.index) player.score+= score;
        })
        this.hud.updateScore(player.score);
        diamond.disableBody(true, true);
    }

    handleAnimations(){
        //enemy - birdman
        this.anims.create({
            key: "birdman-idle",
            frames: this.anims.generateFrameNumbers(
                "birdman",
                {start: 0, end: 12},
            ),
            frameRate: 8,
            repeat: -1 
        });
        this.anims.create({
            key: "birdman-hurt",
            frames: this.anims.generateFrameNumbers(
                "birdman",
                {start: 25, end: 26},
            ),
            frameRate: 2,
            repeat: 0
        });
        //enemy - snaky
        this.anims.create({
            key: "snaky-walk",
            frames: this.anims.generateFrameNumbers(
                "snaky",
                {start: 0, end: 8},
            ),
            frameRate: 10,
            repeat: -1 
        });
        this.anims.create({
            key: "snaky-hurt",
            frames: this.anims.generateFrameNumbers(
                "snaky",
                {start: 21, end: 22},
            ),
            frameRate: 2,
            repeat: 0
        });
        //player weapon
        this.anims.create({
            key: "projectile-hit-enemy",
            frames: this.anims.generateFrameNumbers(
                "projectile-hit-sheet",
                {start: 0, end: 4},
            ),
            frameRate: 10,
            repeat: 0
        })
        this.anims.create({
            key: "sword-attack",
            frames: this.anims.generateFrameNumbers(
                "sword-sheet",
                {start: 0, end: 2},
            ),
            frameRate: 8,
            repeat: 0
        })
        //iceball anim
        this.anims.create({
            key: "iceball",
            frames: [
                {key: "iceball-1"},
                {key: "iceball-2"},
                ],
            frameRate: 2,
            repeat: 0
        })   
        
        //fireball anim
        this.anims.create({
            key: "fireball",
            frames: [
                {key: "fireball-1"},
                {key: "fireball-2"},
                {key: "fireball-3"}
                ],
            frameRate: 4,
            repeat: 0
        })
        //diamonds
        this.anims.create({
            key: "diamond-shine",
            frames: [
                {key: "diamond-1"},
                {key: "diamond-2"},
                {key: "diamond-3"},
                {key: "diamond-4"},
                {key: "diamond-5"},
                {key: "diamond-6"}
                ],
            frameRate: 6,
            repeat: -1
        })

    }
    
    onCollisionWithWeapon(enemy, weapon){
        enemy.takesHitFrom(weapon);
        weapon.deactivate();
    }
    
    onPlayerCollisionWithEnemy(enemy, player){
        player.bounceOffEnemy();
        player.playDamageTween(enemy);
    }
    
    createBG(map){
        this.spikesBG = this.add.tileSprite(0, 0, map.tileWidth*map.width, this.config.height, "spikes-bg")
            .setScrollFactor(0,1)
            .setScale(1.1)
            
        this.skyBG = this.add.tileSprite(0, 0, map.tileWidth*map.width, 180, "sky-bg")
            .setScrollFactor(1,1)
            .setDepth(-1)
            .setOrigin(0)
             
    }
    
    getCurrentLevel(){
        return this.registry.get("level");
    }
    
    createMap(){
        const currentLevel =  this.getCurrentLevel() || 1;
        const map = this.make.tilemap({key: "level-"+ currentLevel});
        
        map.addTilesetImage("main_lev_build_1", "tileset1");
        map.addTilesetImage("bg_spikes_tileset", "tileset2"); 
        return map;
        
    }
    
    cameraFollow(cameraPerson){
        const { width, height, offsetX, offsetY} = this.config;
        
        this.cameras.main.startFollow(cameraPerson);
        this.physics.world.setBounds(0, 0, width+offsetX, height+offsetY)
        this.cameras.main.setBounds(0, 0, width+offsetX, height+offsetY).setZoom(1.5);
    }
    
    createLayers(map){
        //get tileset(s)
        const tileset1 = map.getTileset("main_lev_build_1");
        const tileset2 = map.getTileset("bg_spikes_tileset");

        //create tile layers from tileset(s)
        const bgExtension = map.createLayer("distance", tileset2);
        const environment = map.createLayer("environment", tileset1);
        const platformsColliders = map.createLayer("platforms_colliders", tileset1).setAlpha(0);
        const platforms = map.createLayer("platforms", tileset1);
        const traps = map.createLayer("traps", tileset1);
        //create object layers from tilesets
        const playerZones = map.getObjectLayer("player_zones");
        const collectibles = map.getObjectLayer("collectibles");
        //set collision by property (or by exclusion) to specific tile layers
        platformsColliders.setCollisionByExclusion(-1, true);
        traps.setCollisionByExclusion(-1, true);
        return { environment, platforms, platformsColliders, playerZones, collectibles, traps};
    }
    
    playThemeMusic(){
        const themeMusic = this.sound.get("theme");
        if(!themeMusic) this.sound.add("theme", {loop: true, volume: 1}).play()
    }
    
    getPlayerZones(playerZonesLayer){
        const playerZones = playerZonesLayer.objects;
        return {
            start: playerZones.find(zone=> zone.name === "startZone"),
            end: playerZones.find(zone=> zone.name === "endZone")
        }
    }

    createEndOfLevel(end, player){
        const endZone = this.physics.add.sprite(end.x, end.y, "endZone")
            .setOrigin(0.5, 1)
            .setSize(5, this.config.height)
        const eolOverlapFunction = this.physics.add.overlap(player, endZone, ()=>{
            eolOverlapFunction.active = false;
            
            const currentLevel = this.getCurrentLevel();
            const finalLevel = this.registry.get("final_level");
            
            if(currentLevel < finalLevel){
                this.registry.inc("level", 1);
                this.registry.inc("unlocked_levels", 1);
                this.scene.restart({gameStatus: "LEVEL_COMPLETE"})
                console.log("Player has won!");
            }
        })
    }
    createPlayer(x, y){
        return new Player(this, x, y);
    }
    
    createEnemies(map){
        const enemyZones = map.getObjectLayer("enemy_spawns").objects;
        Object.values(enemyZones).forEach( (zone, index)=>{
            //if(index > 0) return;
            if(zone.type == "Birdman"){
                this.enemies.add(new Birdman(this, zone.x, zone.y) );
            }
            else if(zone.type == "Snaky"){
                this.enemies.add(new Snaky(this, zone.x, zone.y) );
            }
        })
    }
    
    createGameEvents(){
        eventEmitter.on("PLAYER_LOSE", ()=>{
            this.scene.restart({gameStatus: "PLAYER_LOSE"});
        })
    }
    
    update(){
        this.spikesBG.tilePositionX = this.cameras.main.scrollX * 0.3;
        this.skyBG.tilePositionX = this.cameras.main.scrollX * 0.1;
    }

}