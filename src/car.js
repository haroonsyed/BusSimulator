//Car Object Class
class Car{
    constructor(x,y,name,id,capacity){
        this.x = x;
        this.y = y;
        this.name = name;
        this.id = id;
        this.passengers = 0;
        this.path = [];
        this.newAnimation = [];
        this.newChunkPath = [];
        this.runningAnimation = false;
        this.updatedList = false;
        this.passengerAdj = new Map();
        this.capacity = capacity;
        this.score = 0;
    }
}