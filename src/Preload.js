export class PreloadScene extends Phaser.Scene{
    constructor(){
       super('PreloadScene');
       
    }
    
    preload(){
        //BACK BUTTON
        this.load.image("backButton", "assets/back.png");
 
        //BACKGROUNDS
        //play state
        this.load.image("sky-bg", "assets/background_0.png");
        this.load.image("spikes-bg", "assets/background03_super_dark.png");
        //other scenes
        this.load.image("bg-other", "assets/background01.png");
 
        //TILEMAP JSON
        this.load.tilemapTiledJSON("level-1", "assets/crystal_world_map_level_1.json");
        this.load.tilemapTiledJSON("level-2", "assets/crystal_world_map_level_2.json");
 
        //TILESETS
        this.load.image("tileset1", "assets/main_lev_build_1.png");
        this.load.image("tileset2", "assets/bg_spikes_tileset.png");
        //PLAYER
        this.load.spritesheet('player', "assets/player/move_sprite_1.png", {
            frameWidth: 32, spacing: 32, frameHeight: 38,
        });
        this.load.spritesheet('player-slide-sheet', "assets/player/slide_sheet_002.png", {
            frameWidth: 32, spacing: 32, frameHeight: 38,
        }); 
        //ENEMIES
        this.load.spritesheet('birdman', "assets/enemy/enemy_sheet.png", {
            frameWidth: 32, spacing: 32, frameHeight: 64
        });
        this.load.spritesheet('snaky', "assets/enemy/enemy_sheet_2.png", {
            frameWidth: 32, spacing: 32, frameHeight: 64
        });
        //PROJECTILES
        this.load.image("iceball-1", "assets/weapons/iceball_001.png");
        this.load.image("iceball-2", "assets/weapons/iceball_002.png"); 
        this.load.image("fireball-1", "assets/weapons/improved_fireball_001.png");
        this.load.image("fireball-2", "assets/weapons/improved_fireball_002.png");
        this.load.image("fireball-3", "assets/weapons/improved_fireball_003.png");
        
   
        this.load.spritesheet('projectile-hit-sheet', "assets/weapons/hit_effect_sheet.png", {
            frameWidth: 32, frameHeight: 32,
        });
        
        this.load.spritesheet('sword-sheet', "assets/weapons/sword_sheet_1.png", {
            frameWidth: 62, frameHeight: 32,
        });
        //COLLECTIBLES
        this.load.image("diamond", "assets/collectibles/diamond.png");
        this.load.image("diamond-1", "assets/collectibles/diamond_big_01.png");
        this.load.image("diamond-2", "assets/collectibles/diamond_big_02.png");
        this.load.image("diamond-3", "assets/collectibles/diamond_big_03.png");
        this.load.image("diamond-4", "assets/collectibles/diamond_big_04.png");
        this.load.image("diamond-5", "assets/collectibles/diamond_big_05.png");
        this.load.image("diamond-6", "assets/collectibles/diamond_big_06.png")
        
        //AUDIO
        this.load.audio("theme", "assets/music/theme_music.wav");
        
        this.load.once("complete", ()=>{
            this.registry.set("level", 1);
            this.registry.set("unlocked_levels", 1);
            this.registry.set("final_level", 2);
 
            this.startGame();
        }) 

    }
    
    startGame(){
        this.scene.start('MenuScene') 
    }

}