//Node Class, holds x,y,radius, & name
class Node{
    //x;y;r;name;
    //neighbors = [];
    constructor(x,y,r,name,id){
        this.x = x;
        this.y = y;
        this.r = r;
        this.g = Number.MAX_SAFE_INTEGER;
        this.h = 0.0;
        this.f = Number.MAX_SAFE_INTEGER;
        this.name = name;
        this.id = id;
        this.neighbors = [];
    }

    
}
