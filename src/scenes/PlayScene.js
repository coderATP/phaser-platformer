/**@type {import("../typings/phaser")} */
import { GameState } from "./GameState.js";
import { Player } from "../entities/Player.js";
import { Enemy } from "../entities/Enemy.js";
import { Enemies } from "../groups/Enemies.js";
import { ui } from "../ui.js";
import { myInput } from "../myInput.js";
import { eventEmitter } from "../events/EventEmitter.js";
import { Container } from "../hud/Container.js";


export class PlayScene extends GameState{
    constructor(config){
        super('PlayScene', config);
        this.config = config;
        this.enemies;
    }
    
    //ON ENTERING SCENE, WHAT TO DO FIRST
    enter(){
        this.hideAllScreens();
        this.show(this.playScreen, "grid");
    }
    
    //CREATE GAMEOBJECTS
    create(){
        this.enter();

        //map and its layers
        this.map = this.createMap();
        this.bgLayers = this.createBackgroundLayers(this.map);
        this.mapLayers = this.createMapLayers(this.map);
        
        //end-of-scene zone
        this.endZone = this.createEndZone(this.mapLayers);
        
        //player
        this.player = this.createPlayer(this.mapLayers);
        
        //enemies
        this.enemies = this.createEnemies(this.mapLayers);
        this.enemies.handleAnimations();
        
        //camera
        this.cameraSetup(this.player);
        
        //lighting
        this.light = this.createLighting(this.player);
        
        //head-under-display (HUD) container
        this.container = new Container(this, 0, 0);

        //EVENTS TRANSITIONING
        this.acceptEvents();
        this.processEvents();
        
        //COLLIDERS
        if(!this.player || !this.map) return;
        //player vs platforms
        this.platformCollider = this.physics.add.collider(this.player, this.mapLayers.collisionblocks);
        //enemies vs platforms
        this.physics.add.collider(this.enemies, this.mapLayers.collisionblocks);
        //player vs ladders
        this.ladderCollider = this.physics.add.overlap(this.player, this.mapLayers.ladders, this.checkLadder.bind(this));
        
        //enemy-projectiles
        this.enemies.getChildren().forEach(enemy=>{
            //vs player
            enemy.projectiles.onPlayerHit(); 
            //vs platforms
            enemy.projectiles.onPlatformHit();
        })
        //player vs enemies
        this.physics.add.collider(this.player, this.enemies, (source, target)=>{
            this.player.onEnemyLanded(target);
        });
        
        //player-projectiles vs enemies
        this.player.projectiles.onEnemyHit();
        //player-projectiles vs platforms
        this.player.projectiles.onPlatformHit(); 
        
        this.toNewScene();
    }
    
    createMap(){
        this.setCurrentScene();
        
        const map = this.make.tilemap({key: "map"+this.currentLevel+this.currentScene});
        //tile bleeding/extrusion
        map.addTilesetImage("Assets", "Tileset"+this.currentLevel,16, 16, 0, 0);
        
        this.mapWidth = map.tileWidth * map.width;
        this.mapHeight = map.tileHeight * map.height;
        
        return map;
    }
    
    createMapLayers(map){
        if(!map) return;
        const tileset1 = map.getTileset("Assets");
        
        const collisionblocks = map.createLayer( "collisionblocks", tileset1).setAlpha(0).setCollisionByExclusion(-1, true)
        const mobile_platforms_zones = map.getObjectLayer("mobile_platforms", tileset1).objects;
        const stationary_platforms = map.createLayer( "stationary_platforms", tileset1).setDepth(9);
        
        const foreground = map.createLayer( "foreground", tileset1).setDepth(7);
        
        const traps = map.createLayer("traps", tileset1);
        const decoration = map.createLayer("decoration", tileset1);
        const exit_zone = map.getObjectLayer("exit_zone").objects;
        const player_spawn_zone = map.getObjectLayer("player_spawn_zone").objects;
        
        const enemy_spawn_zones = map.getObjectLayer("enemy_spawn_zones").objects;
        
        const ladders = map.createLayer("ladders", tileset1).setDepth(10).setCollisionByExclusion(-1, true);
        ladders.y = -0.01;
        
        return { collisionblocks, exit_zone, player_spawn_zone, enemy_spawn_zones, ladders, foreground, traps, stationary_platforms, mobile_platforms_zones, decoration };
    }
    
    createBackgroundLayers(map){
        if (!map) return;
        const layers = [];
        for (let i = 7; i >= 3; i--) {
            //const key = this.mapID + "" + i;
            const key = 0+""+i;
            const bg = this.add.tileSprite(0, 0, 1920+this.config.width, 1080, key )
                .setOrigin(0)
                .setScale(0.3)
                .setDepth(-i)
                .setScrollFactor(0,1)
            bg
            .setPipeline('Light2D')
            layers.push(bg);
        }
        return layers;
    }
    
    createPlayer(layers){
        if(!layers) return;
        let player;
        layers.player_spawn_zone.forEach(zone=>{
            player =  new Player(this, zone.x, zone.y, "player")
        })
        return player;
    }
    
    createEnemies(layers){
        if(!layers) return;
        const enemies = new Enemies(this);
        layers.enemy_spawn_zones.forEach((zone, index)=>{
           // if(index > 0) return;
            enemies.add(new Enemy(this, zone.x, zone.y, "orc-base"));
        })
        return enemies;
    }
    
    createLighting(player){
        if(!player.body) return;
        var radius = 100, color = 0xff00ff;
        var light = this.lights
            .enable()
            .addLight(player.body.center.x, player.body.center.y, radius)
            .setIntensity(1);
        
        return light;
    }
    
    createEndZone(layers){
        if(!layers) return;
        layers.exit_zone.forEach(zone=>{
        this.endOfSceneImage = this.physics.add.image(zone.x, zone.y, "exitSign")
                .setOrigin(1)
                .setSize(5, this.config.height);
        })
    }
    
    //COLLISION CHECK
    checkLadder(){
        const tile = this.map.getTileAtWorldXY(this.player.body.center.x, this.player.body.bottom, true);
        const tile2 = this.map.getTileAtWorldXY(this.player.body.center.x, this.player.body.top, true);
        
        this.player.onLadder = (tile&& tile.index > -1) || (tile2&& tile2.index > -1) ? true : false;
        this.player.canClimbDown = (tile&& tile.index > -1 && (myInput.keys[0] === "down" || myInput.keys[0] === "ArrowDown" || myInput.keys[0] === "s")) ? true : false;
        this.player.canClimbUp = (tile2&& tile2.index > -1 && (myInput.keys[0] === "up"  || myInput.keys[0] === "ArrowUp" || myInput.keys[0] === "w") )? true : false;

    }
    
    togglePlatformCollider(){
        const tile = this.map.getTileAtWorldXY(this.player.body.center.x, this.player.body.bottom, true);
        const tile2 = this.map.getTileAtWorldXY(this.player.body.center.x, this.player.body.top, true);
        
        if( (tile&& tile.index > -1 && (myInput.keys[0]==="down"  || myInput.keys[0] === "ArrowDown" || myInput.keys[0] === "s") ) ||
            (tile2&& tile2.index > -1 && (myInput.keys[0] ==="up"  || myInput.keys[0] === "ArrowUp" || myInput.keys[0] === "w"))
            ){
            this.platformCollider.active = false;
        }
        else this.platformCollider.active = true;
    }
    
    //SCENE TRANSITION
    toNewScene(){
        const eolOverlap = this.physics.add.overlap(this.player, this.endOfSceneImage, ()=>{
            eolOverlap.active = false;
            
            this.registry.inc("currentScene", 1);
            this.scene.start("TransitionToPlayScene");

        })
        
    }
    
    //CAMERA SETUP
    cameraSetup(cameraPerson){
        if(!this.map || !cameraPerson) return;
        const cam = this.cameras.main;
        
        cam.startFollow(cameraPerson);
        cam.pan(0, 0, 1000, 'Linear');
        cam.zoomTo(this.cameraZoomFactor, 2000);
        //world bounds
        this.physics.world.setBounds(0, 0, this.mapWidth, this.mapHeight);
        //camera bounds
        cam.setBounds(0, 0, this.mapWidth, this.mapHeight);
        //smooth px, also solved issue with tiles bleeding
        cam.roundPixels = false; 
        //lerp
        cam.setLerp(0.1, 0.1);

       // cam.rotateTo(0.1)
    }
    
    //EVENT TRIGGERS
    acceptEvents() {
        ui.play_pauseBtn.addEventListener("click", (e)=>{
            eventEmitter.emit("PLAY_TO_PAUSE");
        })
        ui.pause_resumeBtn.addEventListener("click", (e)=>{
            eventEmitter.emit("PAUSE_TO_RESUME");
        })
        ui.pause_restartBtn.addEventListener("click", (e)=>{
            eventEmitter.emit("PAUSE_TO_RESTART");
        })
        ui.pause_menuBtn.addEventListener("click", (e)=>{
            eventEmitter.emit("PAUSE_TO_MENU");
        })
        ui.restart_yesBtn.addEventListener("click", ()=>{
            eventEmitter.emit("RESTART_TO_PLAY");
        })
        ui.restart_noBtn.addEventListener("click", ()=>{
            eventEmitter.emit("RESTART_TO_PAUSE");
        })  
    }
    processEvents(){
        //play
        eventEmitter.on("PLAY_TO_PAUSE", ()=>{
            if(!this.scene.isPaused() )this.scene.pause("PlayScene");
            this.hide(this.playScreen)
            this.show(this.pauseScreen, "grid");
        })
        //pause
        eventEmitter.on("PAUSE_TO_RESUME", ()=>{
            this.show(this.playScreen, "grid");
            this.hide(this.pauseScreen);
            this.scene.resume("PlayScene");
        })
        eventEmitter.on("PAUSE_TO_RESTART", ()=>{
            this.hide(this.pauseScreen);
            this.show(this.restartConfirmScreen, "grid");
        })
        eventEmitter.on("PAUSE_TO_MENU", ()=>{
            this.registry.set("currentScene", 1);
            this.registry.set("currentLevel", 1);
            this.scene.start("MenuScene");
        })
        eventEmitter.on("RESTART_TO_PAUSE", () => {
            this.hide(this.restartConfirmScreen);
            this.show(this.pauseScreen, "grid");
        })
        //restart
        eventEmitter.once("RESTART_TO_PLAY", () => {
            this.scene.start("TransitionToPlayScene");
        })
    }
    
    
    //UPDATE LOOP
    update(time, delta ){
        
        if(!this.bgLayers) return;
        
        this.light.x = this.player.body.center.x;
        this.light.y = this.player.body.center.y;
        
        this.bgLayers.forEach((layer, index)=>{
            layer.tilePositionX = this.cameras.main.scrollX * 0.3 * (index+1);
        })
        this.togglePlatformCollider();
    }
}