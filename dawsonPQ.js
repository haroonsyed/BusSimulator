class PriorityQueue {
    constructor(){
        this.heap = [];
        this.head = 0;
        this.tail = -1;
    }
    size(){
        return this.heap.length;
    }
    peek(){
        return this.heap[this.head];
    }
    //adds new node to the heap and calls shift
    push(node){
        this.heap.push(node);
        this.tail = this.tail + 1;
        if(this.tail != 0){
            this.shift();
        }
    }
    //this is only called when something new is added so it knows to start with the tail
    shift(){
        let p;
        let c = this.tail;
        //if the tail index is odd then it is a left child
        if(c % 2 != 0){
            //finds parent node
            p = parseInt(Math.floor((c - 1) / 2));
        }
        //if the tail index is even then it is a right child
        else{
            //finds parent node
            p = parseInt(Math.floor((c - 2) / 2));
        }
        while(p >= 0){
            //if child score is less than parent score then swap them
            if(parseInt(this.heap[c].score) < parseInt(this.heap[p].score)){
                this.swap(p, c);
                c = p;
            }
            //else stop since the child is in the right spot
            else{
                break;
            }
            //
            if(p % 2 != 0){
                p = parseInt(Math.floor((p - 1) / 2));
            }
            else{
                p = parseInt(Math.floor((this.tail - 2) / 2));
            }
        }
    }
    //make swap function
    swap(p, c){
        let mover = this.heap[c];
        this.heap[c] = this.heap[p];
        this.heap[p] = mover;
    }
    //clear
    clear(){
        while(this.heap.length > 0){
            this.heap.pop();
        }
    }
    print(){
        for(let j = 0; j < pq.size(); j++){
            console.log(this.heap[j].score);
        }
    }
}
