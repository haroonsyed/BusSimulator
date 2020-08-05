//Contains information about entire graph
class Graph{
    constructor(){
        this.graph = new Map(); //Key: name, Value: Node*
        this.nodeCount = 0;
        this.nodeList = [];
    }
    
    addNode(n){
        this.nodeList.push(n);
        this.nodeCount++;
        if(!this.graph.has(n)){
          this.graph.set(n.name,n);
        }
    }
    printAllNodes(){
        for(let i=0; i < this.nodeList.length; i++){
            console.log(this.nodeList[i]);
        }
    }
    //from & to are from Node Class
    //weight should be pythagorean distance between two nodes (to be changed)
    insertEdge(from, to, weight){ 
        let pair = {
            toName: to.name,
            weight: weight,
        };
        if(!this.graph.has(from.name)){
            this.graph.set(from.name, from);
            let n = this.graph.get(from.name).neighbors;
            n.push(pair);
        }
        
        else{
           let n = this.graph.get(from.name).neighbors;
           n.push(pair);
        }
        
        this.nodeCount = this.nodeList.length;
    }
    printConnections(){
    let graph2 = new Map([...this.graph.entries()].sort());
       graph2.forEach(function(value,key){
           console.log(key + ' -> ');

           for(let i=0; i < value.neighbors.length; i++){
               console.log(value.neighbors[i].toName + ' (' + value.neighbors[i].weight + '),');
           }
           
       });
    }



   //Returns an array with nodes of path to destination.
  //src & destination are NODES
  dijkstraPQ(src, destination){
    //Initialization
    let remaining = new MinPriorityQueue();
    let computed = new Set();
    let shortestDistances = []; //In src to destination
    let predecessors = [];      //In computed path
    let mapper = new Map(); //Maps shortest distances' and predecessors' names to arrayposition


    

    //Initialize values before starting dijkstra's algorithm
    for(const [key, value] of this.graph.entries()){

      let tmpVertex = {
        name: key,
        distance: Number.MAX_SAFE_INTEGER,
      }
      mapper.set(tmpVertex.name, mapper.size);
      
      //Initialize shortest distances
      if(tmpVertex.name == src.name){
        tmpVertex.distance = 0;
        shortestDistances.push(tmpVertex);
      }
      else{
        shortestDistances.push(tmpVertex);
      }


      remaining.insert(tmpVertex.name, tmpVertex.distance);
      //Initialize path predecessors
      let predecessor = {
        name: key,
        predecessor: "-1",
      }
      predecessors.push(predecessor);

    }

    //Perform Dijkstra's iteratively
    while(computed.size < this.graph.size){
      
      //Start with the smallest distance vertex that has not been computed.
      //Store the vertex's position and weight
      let startVertex = {
        name: "",
        distance: Number.MAX_SAFE_INTEGER,
      }
      startVertex.name = remaining.peek()["id"];
      startVertex.distance = remaining.peek()["priority"];
      remaining.pop();
      //Throw value out if already computed
      if(computed.has(startVertex.name)){
        continue;
      }
      else{
        computed.add(startVertex.name);
      }

      //Go through adjacent vertices. Perform relaxation.
      for(let node of this.graph.get(startVertex.name).neighbors){
        //If the stored shortest distance value at vertex + adj is less than stores adj
        //Then set the new shortest distance to the adjacent. And set predecessor to match.
        let sDistancesNodePos = parseInt(mapper.get(node["toName"]));
            //console.log((parseFloat(startVertex.distance) + parseFloat(node["weight"])) + " " +  parseFloat(shortestDistances[sDistancesNodePos]["distance"]));
            if((parseFloat(startVertex.distance) + parseFloat(node["weight"])) < parseFloat(shortestDistances[sDistancesNodePos]["distance"])){
               shortestDistances[sDistancesNodePos]["distance"] = parseFloat(parseFloat(startVertex.distance) + parseFloat(node["weight"]));
               remaining.insert(node["toName"], parseFloat(parseFloat(startVertex.distance) + parseFloat(node["weight"])));
               predecessors[sDistancesNodePos]["predecessor"] = startVertex.name;
               
            }


      }

      //Now repeat
      //console.log(remaining);

    }

    //Now take predecessors and make the path
    let path = [destination];
    let predecessorName = predecessors[mapper.get(path[0]["name"])]["predecessor"];
    if(predecessorName == "-1"){
      console.log("NO PATH");
      return [];
    }
    while(path[0]["name"] != src.name){
       path.unshift(this.graph.get(predecessors[mapper.get(path[0]["name"])]["predecessor"]));
    }

    return path;

  }



} //End graph

