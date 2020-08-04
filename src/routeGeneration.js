//Made by James Horn July 2020
function routeGeneration(start, end, busses, graph,algo){
    //use either A* or dijkstra depending on the passed string
    let aPath;
    if(algo=="aStar"){
        aPath = aStar(graph, start, end).length;
    }
    else{
        aPath = graph.dijkstraPQ(start, end).length;
    }
    if(aPath==0){
        return false;
    }
    //better bus helps weed out busses that are automatically going to be a worse pick than busses we have already found
    let betterBus = false;
    let scorePQ = new MinPriorityQueue();

    //SCORING:
    for(let k = 0; k < busses.length; k++){
        busses[k].score = 1;
        //variables to determine what nodes a bus may already be visiting
        let numStart = 0;
        let numEnd = 0;
        let startIndex = -1;
        let endIndex = -1;
        //scoreFactor calculation (this is a multiplier that will increase scores if that bus has undesired things)
        let scoreFactor = 1;
        for(let j = 0; j < busses[k].path.length; j++){
            //adds up the length of each edge
            if(j != 0){
                scoreFactor += parseInt(Math.sqrt(Math.pow(busses[k].path[j].station.x - busses[k].path[j - 1].station.x, 2) + Math.pow(busses[k].path[j].station.y - busses[k].path[j - 1].station.y, 2)));
            }
            //finds start and end nodes in path of the current bus
            if(busses[k].path[j].station.name  ==  start.name){
                numStart++;
                startIndex = j;
            }
            else if(busses[k].path[j].station.name  ==  end.name){
                numEnd++;
                endIndex = j;
            }
        }
        //score factor is averaged to represent the average edge length of a bus path then multiplied by (passenger count + 1)
        scoreFactor = parseInt(scoreFactor / busses[k].path.length);
        scoreFactor = parseInt(scoreFactor * (busses[k].passengers + 1));

        //see if new request could even fit
        let compare = busses[k].passengers;
	    if(numStart > 0 && numEnd > 0 && startIndex < endIndex){
            for(let i = 0; i < busses[k].path.length; i++){
                if(i < endIndex){
                    compare += busses[k].path[i].change;
                }
            }
        }
        else{
            for(let i = 0; i < busses[k].path.length - 1; i++){
                compare += busses[k].path[i].change;
            }
        }
        if(compare >= busses[k].capacity){
            //console.log("Bus " + busses[k].name + " has not been added to PQ for capacity reasons");
            continue;
        }
        //if start and end are in the bus path (in order)
        if(numStart == 1 && numEnd == 1 && startIndex < endIndex){
            //adjust score
            busses[k].score *= parseInt((busses[k].path.length + 1 + endIndex - startIndex - aPath)  * scoreFactor); //+1 to account for length from aPath being 1 number highter than the index of end
            betterBus = true;
            scorePQ.insert(busses[k], busses[k].score);
        }
        //if only start is in the path
        else if(numStart == 1){
            //adjust score
            busses[k].score *= parseInt(((busses[k].path.length - startIndex) + aPath) * scoreFactor); //how many stations it goes through after the start index + length of start-to-end path
            betterBus = true;
            scorePQ.insert(busses[k], busses[k].score);
        }
        else if(busses[k].path.length > 0){
            //finds path from end of bus path to start station with the selected pathfinding
            let toStart;
            if(algo=="aStar"){
                toStart = aStar(graph, busses[k].path[busses[k].path.length - 1].station, start);
            }
            else{
                toStart = graph.dijkstraPQ(busses[k].path[busses[k].path.length - 1].station, start);
            }
            //adjust the scorefactor if the bus wasn't moving
            if(busses[k].path.length == 1){
                let sum = 0;
                for(let i = 1; i < toStart.length; i++){
                    sum += parseInt(Math.sqrt(Math.pow(toStart[i].x - toStart[i - 1].x, 2) + Math.pow(toStart[i].y - toStart[i - 1].y, 2)));
                }
                scoreFactor *= parseInt(sum / toStart.length);
            }
            //if there is a better bus hurt the score more
            if(betterBus){
                busses[k].score *= parseInt((aPath + (3 * toStart.length) + busses[k].path.length) * scoreFactor);
            }
            else{
                busses[k].score *= parseInt((aPath + (2 * toStart.length) + busses[k].path.length) * scoreFactor);
            }
            scorePQ.insert(busses[k], busses[k].score);
        }
    }
    betterBus = false;

    //ROUTE CHANGE:
    //make sure a best bus is selected
    let best = scorePQ.peek();
    if(typeof best == 'undefined'){
        return "noBest";
    }
    best = best.id;
    if(best.path.length < 1){
        console.log("ERROR: BEST CAR SELECTION HAS A PATH OF < 1");
        return "noBest";
    }
    //find the start and end nodes that may be in the best bus
    let numStart = 0;
    let numEnd = 0;
    let startIndex = -1;
    let endIndex = -1;
    for(let j = 0; j < best.path.length; j++){
        if(best.path[j].station.name  ==  start.name){
            numStart++;
            startIndex = j;
        }
        else if(best.path[j].station.name  ==  end.name){
            if(startIndex != -1){
                numEnd++;
            }
            if(numEnd > 0){
                endIndex = j;
            }
        }
    }
    //if start and end points were already in the path
    if(numStart > 0 && numEnd > 0){
        //sets passenger changes at those stops
        best.path[startIndex].change++;
        best.path[endIndex].change--;
    }
    //only start was in the path
    else if(numStart > 0){
        //add the new part of the path
        let append;
        //use the selected pathfinding
        if(algo=="aStar"){
            append = aStar(graph, best.path[best.path.length - 1].station, end);
        }
        else{
            append = graph.dijkstraPQ(best.path[best.path.length - 1].station, end);
        }
        for(let i = 1; i < append.length; i++){
            let pair = {
                station: append[i],
                change: 0,
            };
            best.path.push(pair);
        }
        //sets passenger changes at those stops
        best.path[startIndex].change++;
        best.path[best.path.length - 1].change--;
    }
    //if only end was in the path or both start and end were not in the path
    else{
        let append1;
        let append2;
        //use the selected pathfinding
        if(algo=="aStar"){
            append1 = aStar(graph, best.path[best.path.length - 1].station, start);
            append2 = aStar(graph, start, end);
        }
        else{
            append1 = graph.dijkstraPQ(best.path[best.path.length - 1].station, start);
            append2 = graph.dijkstraPQ(start, end);
        }
        for(let i = 1; i < append1.length - 1; i++){
            let pair = {
                station: append1[i],
                change: 0,
            };
            best.path.push(pair);
        }
        let temp = best.path.length;
        for(let i = 0; i < append2.length; i++){
            let pair = {
                station: append2[i],
                change: 0,
            };
            best.path.push(pair);
        }
        //sets passenger changes at those stops
        best.path[temp].change++;
        best.path[best.path.length - 1].change--;
    }
    console.log("best bus: " + best.name + "\n\n");
    return best;
}
