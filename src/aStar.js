//Made by James Horn July 2020
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
    for(let i = 1; i < open.length; i++){
        if(open[i].f < ret.f){
            ret = open[i];
        }
    }
    return ret;
}

//retraces the best path and adds it to a list in order
function reconstructPath(from, current){
    let path = [];
    path.push(current);
    while(from.has(current.name)){
        current = from.get(current.name);
        path.unshift(current);
    }
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
        //sets current to the best f score node in open[] and ends the algorithm if that node happens to be the end
        let current = lowestF(open);
        if(current == end){
            return reconstructPath(from, current);
        }
        //remove current from the open list since it has been checked
        let j = open.indexOf(current);
        open.splice(j, 1);
        //for each neighbor of current calculate the f score and add them to open[]
        for(let i = 0; i < current.neighbors.length; i++){
            let neighbor = graph.graph.get(current.neighbors[i].toName);
            if(parseFloat(current.g) + parseFloat(current.neighbors[i].weight) < parseFloat(neighbor.g)){
                from.set(neighbor.name, current);
                neighbor.g = parseFloat(current.g) + parseFloat(current.neighbors[i].weight);
                neighbor.f = parseFloat(neighbor.g) + parseFloat(neighbor.h);
                if(open.indexOf(neighbor) == -1){
                    open.push(neighbor);
                }
            }
        }
      
    }
    console.log("fails\n");
    let fail = [];
    return fail;
}
