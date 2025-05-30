import { Enemy } from "./Enemy.js";

export class Skeleton extends Enemy {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        this.scene = scene;
        
    }
}

export class OrcBase extends Skeleton {
    constructor(scene, x, y) {
        super(scene, x, y, "orc-base");
    }
}

export class OrcShaman extends Skeleton {
    constructor(scene, x, y) {
        super(scene, x, y, "orc-shaman");
    }
}

export class OrcRogue extends Skeleton {
    constructor(scene, x, y) {
        super(scene, x, y, "orc-rogue");
    }
}

export class OrcWarrior extends Skeleton {
    constructor(scene, x, y) {
        super(scene, x, y, "orc-warrior");
    }
}