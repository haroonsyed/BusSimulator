console.log("loaded animateCar");
let carBtn = document.getElementById("car");
let rBtn = document.getElementById("requestRide");
let aBtn = document.getElementById("aStarPath");
let dBtn = document.getElementById("dijkstraPath");
let cap = document.getElementById("maxPassengers");
let carList = [];
let animateList = [];
let carTable = document.getElementById("carInfo");
let runningAnimation = false; let updatedList = false;
let newAnimationPath = []; let newChunkPath = [];


//Only allow one pathfinding algorithm to be enabled
// at any given time
let aState = 0; let dState = 0;
aBtn.addEventListener("click", function(){
    if(aState==0 && dState==1){
        aBtn.style.backgroundColor = "#58ee5f";
        toggleButtons2(1,aBtn,""); aState = 1;

        dBtn.style.backgroundColor = "#df2f2f";
        toggleButtons2(0,dBtn,""); dState = 0;
    }
    else if(aState==0 && dState==0){
        aBtn.style.backgroundColor = "#58ee5f";
        toggleButtons2(1,aBtn,""); aState = 1;
    }
    else if(aState==1 && dState==0){
        aBtn.style.backgroundColor = "#58ee5f";
        //toggleButtons2(1,aBtn,""); aState = 1;
    }
    else{
        aBtn.style.backgroundColor = "#df2f2f";
        toggleButtons2(0,aBtn,""); aState = 0;
    }
});

dBtn.addEventListener("click", function(){
    if(dState==0 && aState==1){
        dBtn.style.backgroundColor = "#58ee5f";
        toggleButtons2(1,dBtn,""); dState = 1;

        aBtn.style.backgroundColor = "#df2f2f";
        toggleButtons2(0,aBtn,""); aState = 0;
    }
    else if(dState==0 && aState==0){
        dBtn.style.backgroundColor = "#58ee5f";
        toggleButtons2(1,dBtn,""); dState = 1;
    }
    else if(dState==1 && aState==0){
        dBtn.style.backgroundColor = "#58ee5f";
    }
    else{
        dBtn.style.backgroundColor = "#df2f2f";
        toggleButtons2(0,dBtn,""); dState = 0;
    }
});

//Add car button event listener
carBtn.addEventListener("click", function(){
    let carNumID = document.getElementById("carNumInput").value;
    addCar(carNumID);
});

function startRideRequest(c){
    constant = c;
    let fromNum = document.getElementById("startInput").value;
    let toNum = document.getElementById("endInput").value;
    //let carInput = document.getElementById("carAnimateInput").value;
    requestRide(fromNum,toNum);
}

//Not used
function svgtoScreen(x,y){
    let pt = svg.createSVGPoint();
    pt.x = x; pt.y = y;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
}

//Select random light color for car color
function getRandomColor() {
    color = "hsl(" + Math.random() * 360 + ", 50%, 50%)";
    return color;
}

//Create & Draw Car Object, add row to Display Car Table
function svgCar(n,x,y,carNumInput){
    let newElement = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
    newElement.setAttribute('x', x-15);
    newElement.setAttribute('y', y-15);
    newElement.setAttribute('width', 30);
    newElement.setAttribute('height', 30);
    newElement.setAttribute('stroke', "blue");
    let color = getRandomColor();
    newElement.setAttribute('fill', color);
    let num = carList.length + 1;
    let c = new Car(x,y,num.toString(),newElement,cap.value);
    let pair = {
        station: svgGraph.nodeList[carNumInput-1],
        change: 0,
    };
    carList.push(c);
    svg.appendChild(newElement);
    c.path.push(pair); 
    let row = carTable.insertRow(carTable.rows.length);
    let cell1 = row.insertCell(0); cell1.style.backgroundColor = color;
    let cell2 = row.insertCell(1); cell2.innerHTML = num;
    let cell3 = row.insertCell(2); cell3.innerHTML = 0;
    let cell4 = row.insertCell(3); cell4.innerHTML = carNumInput;
    consoleLog.innerHTML = "CONSOLE LOG: Added Car at Station #" + carNumInput;
}

//Take in data from carBtn event listener
//Call svgCar appropriately
function addCar(carNumInput){
    if(carNumInput < 1 || carNumInput > svgGraph.nodeList.length){
        consoleLog.innerHTML = "CONSOLE LOG: Station # Does Not Exist";
        return;
    }    

    let n = svgGraph.nodeList[carNumInput-1];

    svgCar(n,n.x,n.y,carNumInput);

    document.getElementById("carNumInput").value = "";

    //console.log(carNumInput);
}

function resetCars(){
    while(carList.length!=0){
        svg.removeChild(carList[carList.length-1].id);
        carList.splice(carList.length-1,1);
    }
    for(let i=0; i < svgGraph.nodeList.length; i++){
        svgGraph.nodeList[i].waiting=0;
        svgGraph.nodeList[i].id.style.fill = "black";
    }
    let t = document.getElementById("carInfo");
    while(t.rows.length > 1){
        t.deleteRow(1);
    }
}

function updateMaxPassengers(){
    let limit = document.getElementById("maxPassengers").value;
    console.log("update max to: " + limit);
    for(let i=0; i < carList.length; i++){
        carList[i].capcacity = limit;
    }
}

function requestRide(fromNum,toNum){
    let prompted = false; let from=fromNum; let to=toNum; //let car = carInput;
    let a; let algo = ""; 
    let selected;

    if(aBtn.value == "enabled" && dBtn.value == "enabled"
        || (aBtn.value == "disabled" && dBtn.value == "disabled") ){
        consoleLog.innerHTML = "CONSOLE LOG: Please select only one pathfinding algorithm!";
        return;
    }
    if(aBtn.value=="enabled"){
        consoleLog.innerHTML = "CONSOLE LOG: A* Path Finding Selected";
        algo="aStar";
    }
    else{
        consoleLog.innerHTML = "CONSOLE LOG: Dijkstra Path Finding Selected";
        algo="dijkstra";
    }

    while(!prompted){
        if(svgGraph.nodeCount < 2){
            consoleLog.innerHTML = "CONSOLE LOG: not enough stations to request ride!";
            return;
        }
        if(from <= 0 || from > svgGraph.nodeCount){
            consoleLog.innerHTML = "CONSOLE LOG: Please enter valid index!";
        }
        if(from=="X"){return;}
        
        if(to <= 0 || to > svgGraph.nodeCount){
            consoleLog.innerHTML = "CONSOLE LOG: Please enter valid index!";
        }
        if(from=="X"){return;}

        else if(to=="X"){return;}
        else{
            //CALL SCORE FUNCTION
            if(algo=="aStar"){
                selected = routeGeneration(svgGraph.nodeList[from-1],svgGraph.nodeList[to-1],carList,svgGraph,"aStar");
                console.log(selected.name);
                if(selected==false){
                    consoleLog.innerHTML = "CONSOLE LOG: No Valid Path Exists";
                    return;
                }
                if(selected=="noBest"){
                    console.log("no car available, make new one");
                    addCar(from);
                    requestRide(from,to);
                    return;
                }

                if(!selected.runningAnimation){
                    selected.newChunkPath = generatePath(carList[selected.name-1].path);
                    //newChunkPath = generatePath(carList[selected.name-1].path);
                    selected.runningAnimation = true;
                    carTable.rows[selected.name].cells[3].innerHTML = selected.path[0].station.name + " (next:" + selected.path[1].station.name + ")";
                    animateChunk2(selected.path[0].station, selected.path[1].station, selected.newChunkPath[0].w, selected.name,0,selected.newChunkPath);
                }
                else{
                    //selected = routeGeneration(svgGraph.nodeList[from-1],svgGraph.nodeList[to-1],carList,svgGraph,"aStar");
                    selected.newAnimationPath = selected.path;
                    selected.newChunkPath = generatePath(carList[selected.name-1].path);
                    selected.updatedList = true;
                }

                prompted=true; 
            }

            if(algo=="dijkstra"){
                selected = routeGeneration(svgGraph.nodeList[from-1],svgGraph.nodeList[to-1],carList,svgGraph,"dijkstra");
                if(selected==false){
                    consoleLog.innerHTML = "CONSOLE LOG: No Valid Path Exists";
                    return;
                }
                if(selected=="noBest"){
                    console.log("no car available, make new one");
                    addCar(from);
                    requestRide(from,to);
                    return;
                }

                if(!selected.runningAnimation){
                    selected.newChunkPath = generatePath(carList[selected.name-1].path);
                    //newChunkPath = generatePath(carList[selected.name-1].path);
                    selected.runningAnimation = true;
                    carTable.rows[selected.name].cells[3].innerHTML = selected.path[0].station.name + " (next:" + selected.path[1].station.name + ")";
                    animateChunk2(selected.path[0].station, selected.path[1].station, selected.newChunkPath[0].w, selected.name,0,selected.newChunkPath);
                }
                else{
                    //selected = routeGeneration(svgGraph.nodeList[from-1],svgGraph.nodeList[to-1],carList,svgGraph,"aStar");
                    selected.newAnimationPath = selected.path;
                    selected.newChunkPath = generatePath(carList[selected.name-1].path);
                    selected.updatedList = true;
                }

                prompted=true; 
            }

        }
    }

    
    document.getElementById("startInput").value = "";
    document.getElementById("endInput").value = "";
    //document.getElementById("carAnimateInput").value = "";
    /* Timeout function (not used)
    setTimeout(function(){
        //generatePath(from,to,carList[selected.name-1].path,selected.name);
    },1500);
    */
}

function generatePath(carPath){
    //console.log("carpathlength: " + carPath.length);
    let chunks = [];
    //let weightSum = -1;
    let s = "CONSOLE LOG: Shortest Path Found -> " + carPath[0].station.name + " ";
    for(let i=0; i < carPath.length-1; i++){
        let f = carPath[i].station.name; let t = carPath[i+1].station.name;
        s+= t + " ";
        for(let j=0; j < svgGraph.graph.get(f).neighbors.length; j++){
            //console.log("n: " + svgGraph.graph.get(f).neighbors[j].toName + " t: " + t);
            if(svgGraph.graph.get(f).neighbors[j].toName == t){
                let w= svgGraph.graph.get(f).neighbors[j].weight;
                let pair={
                    from: carPath[i].station,
                    to: carPath[i+1].station,
                    w: w,
                    passengerCount: carPath[i].change,
                };
                chunks.push(pair);
            }
        }
    }
    consoleLog.innerHTML = "Requests Left: " + (numRequests-1) +  " | " + s;
    /*for(let i=0; i < chunks.length; i++){
        console.log(chunks[i]);
    }*/
    return chunks;
    //divideChunks(chunks,carNum);
}


/* Not Used
function divideChunks(chunks,carNum){
    //console.log("chunkssize: " + chunks.size());
    //console.log(chunks.front().d + " (" + chunks.front().w  + ")");
    let count = 0; 
    let f = chunks.front().from; let t = chunks.front().to;
    let w = chunks.front().w;

    animateChunk(f,t,w,carNum,count,chunks);
    console.log("reached");
    //console.log(carList[carNum-1].path[0].name);

}
*/

function animateChunk2(from,to,weight,carNum,count,chunks){

    //let inter = document.getElementById("fireInterval").value;
    //let constant = document.getElementById("animationConstant").value * 2 / inter;
    let wDur = (weight/(constant*100)).toString() + "s";
    let carObj = carList[carNum-1];
    //console.log("chunks at: " + from.name + " " + chunks[0].passengerCount);
    carObj.passengers += chunks[0].passengerCount;
    carTable.rows[carNum].cells[2].innerHTML = carObj.passengers;


    chunks.splice(0,1);
    carObj.path.splice(0,1);

    let animation = document.createElementNS("http://www.w3.org/2000/svg", "animate");
    animation.setAttribute("attributeType", "XML");
    animation.setAttribute("attributeName", "x");
    animation.setAttribute("from", from.x-15);
    animation.setAttribute("to", to.x-15);
    animation.setAttribute("dur", wDur);
    animation.setAttribute("fill", "freeze");
    //console.log(carNum + " " + svg.getCurrentTime());
    animation.setAttribute("begin", svg.getCurrentTime());
    carObj.id.appendChild(animation);
    carObj.x = to.x;

    let animation2 = document.createElementNS("http://www.w3.org/2000/svg", "animate");
    animation2.setAttribute("attributeType", "XML");
    animation2.setAttribute("attributeName", "y");
    animation2.setAttribute("from", from.y-15);
    animation2.setAttribute("to", to.y-15);
    animation2.setAttribute("dur", wDur);
    animation2.setAttribute("fill", "freeze");
    //console.log(carNum + " " + svg.getCurrentTime());
    animation2.setAttribute("begin", svg.getCurrentTime());
    carObj.id.appendChild(animation2);
    carObj.y = to.y;  

    animation2.onend = () => {

        //console.log("ended edge");
        if(carObj.path.length==1){
            carTable.rows[carNum].cells[3].innerHTML = to.name;
        }
        else{
            carTable.rows[carNum].cells[3].innerHTML = to.name + " (next: " + carObj.path[1].station.name + ")";
        }
        if(carObj.path.length > 1){

            if(carObj.newAnimationPath != [] && carObj.updatedList){
                carObj.path = carObj.newAnimationPath;
                carObj.newAnimationPath = [];
                chunks = carObj.newChunkPath;
                carObj.newChunkPath = [];
                carObj.updatedList = false;
                
            }

            let f = carObj.path[0].station; let t = carObj.path[1].station;
            let w = chunks[0].w;
            animateChunk2(f,t,w,carNum,count+1,chunks);
        }
        else{
            carObj.runningAnimation = false;
            //console.log("chunks at end: " + carObj.path[carObj.path.length-1].change);
            carObj.passengers += carObj.path[carObj.path.length-1].change;
            carTable.rows[carNum].cells[2].innerHTML = carObj.passengers;

            if(carObj.path.length==1){
                carObj.path[0].change = 0;
            }

            return;
        }
    }
}


