

let large = new Graph();



function addEdgeFromCode(from, to, weight){
  let fromNode = new Node(0,0,0,from);
  let toNode = new Node(0,0,0,to);
  large.insertEdge(fromNode, toNode, weight);
}
//Double direction edge
function addDoubleEdge(loc1, loc2, weight){
  addEdgeFromCode(loc1, loc2, weight);
  addEdgeFromCode(loc2, loc1, weight);
}
//Note to self if a-star breaks put it back in here
function bfs(startNode){

  let q = new Queue();
  let visited = new Set();

  q.enqueue(startNode);
  visited.add(startNode["name"]);
  while(q.size() > 0){
      let vertex = q.dequeue();
      for(let neighbor of vertex["neighbors"]){
          if(!visited.has(neighbor["toName"])){
              visited.add(neighbor["toName"]);
              q.enqueue(large.graph.get(neighbor["toName"]));
          }
      }
  }

  return visited.size;

}


   
  //generates square random connected graph with n nodes
  //Node names are integer strings. R is radius
function  generateRandomWalkGraph(numNodes, radius, drawMode){
    //Generate n vertices with random weights
    //Quick Research shows bus stops are .2km to 2km apart.
    //Max connections from one node to other nodes is 4, modelling intersections.
    let visited = new Map();
    let nodeDraw = [];
    while(svg.lastChild && drawMode){
      svg.removeChild(svg.lastChild);
    }

    //Start with random vertex and "walk" from there
    let startVertex = Math.floor(1 + Math.random() * numNodes);

    //Seed graph
    visited.set(startVertex, new Set());
    let startNode = new Node(800,300,radius,startVertex.toString());
    large.addNode(startNode);
    
    let groupStart={
      x:800,
      y:300,
      radius:radius,
      color: "black",
      svg:svg,
      num: startNode.name,
    };
    nodeDraw.push(groupStart);
    

    //Using a random walk algorithm
    while(visited.size != numNodes){
      let neighbor = Math.floor(1 + Math.random() * numNodes);

      //console.log(startVertex + " to " + neighbor);
      //console.log(visited.get(startVertex));
      //console.log(this.graph.get(startVertex.toString()));

      //Add neighbor node in randomly generated direction
      if(!visited.has(neighbor) && visited != neighbor && visited.get(startVertex).size != 4){

        //Choose random direction to go in
        let dir = Math.floor(Math.random()*3);
        let opDir = (dir+2)%4;

        //I would make it walk down the direction. But this severly slows down time complexity
        //Instead, I just increment until the point can be added.
        while(visited.get(startVertex).has(dir)){
          dir = (dir+1)%4;
        }

        if(!visited.get(startVertex).has(dir)){

          visited.get(startVertex).add(dir);
          visited.set(neighbor, new Set([opDir]));

          //X and Y coordinates
          //10 px will be 1 km, change here
          let scale = 150;
          let weight = scale * (0.2 + Math.random() * 1.8);

          let from = large.graph.get(startVertex.toString());
          let x = from.x;
          let y = from.y;
          switch(dir){
            case 0:
              y += weight;
              break;
            case 1:
              x += weight;
              break;
            case 2:
              y -= weight;
              break;
            case 3:
              x -= weight;
              break;
            default:
              console.log("ERROR! Generated impossible direction!");
          }
          
          let to = new Node(x,y,radius,neighbor.toString());

          large.addNode(to);
          let group;
          if(drawMode){
            let group={
              x:x,
              y:y,
              radius:radius,
              color: "black",
              svg:svg,
              num: neighbor.toString(),
            };
            nodeDraw.push(group);
            //svgCircle(x,y,radius,"black",svg,large);
            svgLine(from.x,from.y,x,y,5,"black",svg);
          }
          //Double directional
          large.insertEdge(from, to, weight);
          large.insertEdge(to, from, weight);
        }

      }
      else if(visited.get(startVertex).size == 4){
        //Because it is at a node where all 4 branches are used, tell it to go down a random neighbor
        
        //Choose random neighbor to go down. 
        let neighbors = large.graph.get(startVertex.toString()).neighbors;
        let randNeighbor = Math.floor(Math.random()*neighbors.length);
        neighbor = parseInt(neighbors[randNeighbor].toName);

      }
      startVertex = neighbor;
    }
    if(drawMode){
      large.nodeList = [];
      for(let i=0; i < nodeDraw.length; i++){
        let n = nodeDraw[i];
        large.nodeList.push(svgGenerateCircle(n.x,n.y,n.radius,n.color,n.svg,large.graph.get((i+1).toString())));
        svgText(n.x-3,n.y+3,n.num);
      }
    }
    svgGraph = large;
          
}
  //This version creates a bounding box of size n pixels (scalable) and clicks n nodes randomly in.
  //Based on Erdos Reyni. Radius is radius of nodes (used for display)
  function generateRandomBoundedGraph(n, radius, drawMode){
    //The small number is my pc's constant for the n^2 time complexity. Should give a ballpark for other PCs.
    console.log(n);
    //consoleLog.innerHTML = "CONSOLE LOG: Generating graph. Will take approximately: " + (Math.pow(n, 2)*0.000000006).toString() + " seconds.";
    let nodeDraw = [];
    //Erdos Renyi Model
    //Probability
    let isConnected = false;

    //Use higher constant to increase chance of connectedness at smaller graph sizes. 
    //Finding a good constant meant choosing different graph densities, while ensuring connectedness.
    //ln(n)/n was the tipping point of connectedness for most graphs.
    let p = (1.2 * Math.log(n))/(n);
    large = new Graph();
    while(!isConnected){
      //Wipe graph
      nodeDraw.splice(0,nodeDraw.length);
      large.graph.clear();
      large.nodeList.splice(0,large.nodeList.length);
      large.nodeCount = 0;
      while(svg.lastChild && drawMode){
       svg.removeChild(svg.lastChild);
      }
      //Change this to increase distance between drawn nodes.
      //Multiplies number of pixels per node
      //16:9 aspect ratio for canvas display
      let scale = 120;
      let bounding_box_sizeX = scale * 16;
      let bounding_box_sizeY = scale * 5;
      //console.log(large.graph);
      //Adds unconnected nodes at random x y coordinates in bounding box
      for(let i = 1; i<=n; i++){
        let x = Math.random() * bounding_box_sizeX;
        let y = Math.random() * bounding_box_sizeY;
        let group;
        if(drawMode){
          let group={
            x:x,
            y:y,
            radius:radius,
            color: "black",
            svg:svg,
            num: i.toString(),
          };
          nodeDraw.push(group);
          //svgCircle(x,y,radius,"black",svg,large);
          //svgText(x-3,y+3,i.toString());
        }
        let node = new Node(x,y,radius,i.toString());
        large.addNode(node);
        //large.graph.set(node.name, node);
      }
      console.log(large);
      //Add edges randomly
      for(let i = 1; i<=n; i++){
        for(let j=i+1; j<=n; j++){

          //Random number compared with probability.
          //Distance is hypotenuse
          let r = Math.random();
          if(r <= p){
            let n1 = large.graph.get(i.toString());
            let n2 = large.graph.get(j.toString());
            //console.log(n1); console.log(n2);
            let distance = Math.hypot((n2.x - n1.x),(n2.y - n1.y));
            //distance constraint
            if(distance){

            }
            
            addDoubleEdge(i.toString(), j.toString(), distance);
            if(drawMode){
              svgLine(n1.x,n1.y,n2.x,n2.y,5,"black",svg);
            }
          }

        }
      }

      //Regenrate graph on the small chance it isn't connected.
      isConnected = isGraphConnected();
      console.log(isConnected);
    }
    
    if(drawMode){
      large.nodeList = [];
      for(let i=0; i < nodeDraw.length; i++){
        let n = nodeDraw[i];
        large.nodeList.push(svgGenerateCircle(n.x,n.y,n.radius,n.color,n.svg,large.graph.get((i+1).toString())));
        svgText(n.x-3,n.y+3,n.num);
      }
    }
    svgGraph = large;
    console.log("finished");
  }


  //Checks if graph is connected
    //Assumes nodes are int. strings. Otherwise, use a mapper.
    //Kosaraju BFS Method
   function isGraphConnected(){
        let isConnected = true;
        console.log("called");
        if(large.graph.size == 0){
          return isConnected;
        }
  
        //StartVertex
        let startVertex = large.graph.values().next().value;
  
        //Do BFS one way
        if(this.bfs(startVertex) != large.graph.size){
          isConnected = false;
        }
  
        //Get transpose(graph with all neighbors reversed) and call BFS again
        let transpose = new Graph();
        for(let i=1; i<=large.graph.size; i++){
            //console.log(large.graph.get(i.toString()));
          for(let pair of large.graph.get(i.toString()).neighbors){
            //Pair consists of toName and Weight
            //transpose.addEdgeFromCode(pair.toName, i.toString(), pair.weight);
            let fromNode = new Node(0,0,0,pair.toName);
            let toNode = new Node(0,0,0,i.toString());
            transpose.insertEdge(fromNode, toNode, pair.weight);
          }
        }
        if(bfs(transpose.graph.values().next().value) != large.graph.size){
          isConnected = false;
        }
  
  
        return isConnected;
      }
