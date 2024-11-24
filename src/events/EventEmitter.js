class EventEmitter extends Phaser.Events.EventEmitter{
    constructor(){
        super();
    }
}

export const eventEmitter = new EventEmitter();