//MINIMUM priority queue
class MinPriorityQueue{

  //Holds an array of pairs. 
  //The first data in the pairs is its unique ID.
  //The second in the pairs is the data it determines priority from.
  //Implements a binary heap
  //Parent = floor((c-1)/2)
  //lChild = 2p + 1
  //rChild = 2p + 2
  constructor(){
    this.data = [];
  }

  //Insert data pair into PQ
  insert(id, priority){

    let pair = {
      id: id,
      priority: priority,
    }

    this.data.push(pair);

    let child = this.data.length -1;
    let parent = Math.floor((child-1) / 2);

    //heapify up until heap properties are met
    while((parent >= 0) && (this.data[child]["priority"] < this.data[parent]["priority"])){

      let tmp = this.data[parent];
      this.data[parent] = this.data[child];
      this.data[child] = tmp;

      //Recalculate child and parent positions
      child = parent;
      parent = Math.floor((child - 1) / 2);

    }

  }

  //Find more elegant solution. Don't wanna use recursion for performance though.
  pop(){

    //Assumes there is data in here
    //Pops the data
    let returnVal = this.data[0];

    //Heapify down (iterative)
    let parent = 0;
    let lChild = 2 * parent + 1;
    let isSorted = false;
    this.data[parent] = this.data[this.data.length -1];
    this.data.pop();

    while(!isSorted){

      //If at leaf node
      if(lChild >= this.data.length){
        isSorted = true;
      }
      //If only a left child exists
      else if(lChild+1 >= this.data.length && lChild < this.data.length){
        //smaller
        if(this.data[lChild]["priority"] < this.data[parent]["priority"]){
          let tmp = this.data[lChild];
          this.data[lChild] = this.data[parent];
          this.data[parent] = tmp;
          parent = lChild;
        }
        isSorted = true;
      }
      //If both children exist
      else{
        //lChild is smaller than/equal to rChild
        if(this.data[lChild]["priority"] <= this.data[lChild +1]["priority"] && this.data[parent]["priority"] > this.data[lChild]["priority"]){
          let tmp = this.data[lChild];
          this.data[lChild] = this.data[parent];
          this.data[parent] = tmp;
          parent = lChild;
        }
        //rChild is smaller
        else if(this.data[lChild+1]["priority"] < this.data[lChild]["priority"] && this.data[parent]["priority"] > this.data[lChild+1]["priority"]){
          let tmp = this.data[lChild+1];
          this.data[lChild+1] = this.data[parent];
          this.data[parent] = tmp;
          parent = lChild+1;
        }
        //Sorted
        else{
          isSorted = true;
        }
      }

      //Recalculate Child
      lChild = 2* parent + 1;

    }

    return returnVal;

  }

  peek(){
    return this.data[0];
  }

  length(){
    return this.data.length;
  }

}
