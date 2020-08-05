//sets all the heuristic scores for each node upon A* startup and readjusts the g and f values, as may be needed
function calcH(graph, end){
    for(let i = 0; i < graph.nodeList.length; i++){
        graph.nodeList[i].h = Math.sqrt(Math.pow(end.x - graph.nodeList[i].x, 2) + Math.pow(end.y - graph.nodeList[i].y, 2));
        graph.nodeList[i].g = Number.MAX_SAFE_INTEGER;
        graph.nodeList[i].f = Number.MAX_SAFE_INTEGER;
    }
}

//returns the node with the lowest f score in the open list
function lowestF(open){
   
    let ret = open[0];
    //console.log("open length: " + open.length + "open 0 : " + open[0].name);
    for(let i = 1; i < open.length; i++){
        //console.log(open[i].name);
        if(open[i].f < ret.f){
            ret = open[i];
        }
    }
    //console.log("lowestF() ran" + ret.name);
    return ret;
}

function reconstructPath(from, current){
    let path = [];
    path.push(current);
    //comments for debugging
    //console.log(current.name);
    while(from.has(current.name)){
        //console.log(current.name);
        current = from.get(current.name);
        path.unshift(current);
        //console.log(current.name);
    }
    //console.log("reconstructionPath() ran\n");
    return path;
}

//A* shortest path algorithm
function aStar(graph, start, end){
    calcH(graph, end);
    let open = [];
    open.push(start);
    let from = new Map();
    start.g = 0.0;
    start.f = start.h;

    while(open.length > 0){
        let current = lowestF(open);
        if(current == end){
            //this comment is for debugging purposes
            /*
            let graph3 = new Map([...from.entries()].sort());
            graph3.forEach(function(value,key){
                console.log(value.name + ' -> ' + key);
            });
            */
            return reconstructPath(from, current);
        }

        let j = open.indexOf(current);
        open.splice(j, 1);


        for(let i = 0; i < current.neighbors.length; i++){
            //these comments are for debugging purposes
            //console.log("for loop runs\ncurrent: " + current.name + " neighbor: " + current.neighbors[i].toName);
            let neighbor = graph.graph.get(current.neighbors[i].toName);
            //console.log(neighbor.name);
            //console.log(current.g +" " + current.neighbors[i].weight +  " " +neighbor.g);
            if(parseFloat(current.g) + parseFloat(current.neighbors[i].weight) < parseFloat(neighbor.g)){
                //console.log("outer if");
                from.set(neighbor.name, current);
                neighbor.g = parseFloat(current.g) + parseFloat(current.neighbors[i].weight);
                neighbor.f = parseFloat(neighbor.g) + parseFloat(neighbor.h);
                if(open.indexOf(neighbor) == -1){
                    //console.log("push neighbor");
                    open.push(neighbor);
                }
            }
        }
      
    }
    console.log("fails\n");
    let fail = [];
    return fail;
}
