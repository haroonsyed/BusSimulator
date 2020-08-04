/***
    Triple star is where you have to fill in stuff
 */


let GRAPH_; var interval; let algo;
let tableData = document.getElementById("tableData");
let graphSim = document.getElementById("graphicalSim");
let performSim = document.getElementById("performanceSim");
let n,requests,fireInterval,prob;



//SIM_CONTROLS from UI
var keepRunning = true;
var numRequests = 100;
//Considered as time speedup. Req/sec = 5sec/speed
//var speed = -1;
//Considered as request frequency
var constant;
var probability = 1;
//Considered time "0";
startTime = performance.now();


//Called on clicking runSim button.
function startSim(){
    disableSimButtons();
    setTimeout(function(){
    if(aBtn.value=="enabled"){
        //consoleLog.innerHTML = "CONSOLE LOG: A* Path Finding Selected";
        algo="aStar";
    }
    else if(dBtn.value=="enabled"){
        //consoleLog.innerHTML = "CONSOLE LOG: Dijkstra Path Finding Selected";
        algo="dijkstra";
    }
    else{
        consoleLog.innerHTML = "CONSOLE LOG: Please Select a Path Finding Algorithm";
        return;
    }

    if(graphSim.value=="enabled"){
        console.log("graph button");
        if(svgGraph.nodeList.length < 3){
            consoleLog.innerHTML = "CONSOLE LOG: Error, Graph not created";
            return;
        }
        requests = document.getElementById("numRequests").value;
        fireInterval = document.getElementById("fireInterval").value;
        prob = document.getElementById("probability").value;
        console.log("CONSOLE LOG: Simulation beginning with: " + requests + " requests, " + fireInterval + "ms interval, and " + probability*100 + "% probability firing rate");
        GRAPH_ = svgGraph;
    }
    else if(performSim.value=="enabled"){
        n = document.getElementById("numNodes").value;
        requests = document.getElementById("numRequests").value;
        prob = 1;
        fireInterval = .001;
        if(lastGraph.value=="enabled" && previousGraph.length==1){
            GRAPH_ = previousGraph[0];
            console.log("previous graph has been loaded: ");
            console.log(GRAPH_);
        }
        else{
            console.log("CONSOLE LOG: Generating graph. Will take approximately: " + (Math.pow(n, 2)*0.000000006).toString() +
        " seconds. If pop-ups continue to appear click \"Wait\" to continue graph building");
            generateRandomBoundedGraph(n, 20);
            console.log("CONSOLE LOG: Simulation beginning with: " + requests + " requests on a random graph with "+n+" nodes." );
            GRAPH_ = large;
        }
    }
    else{
        consoleLog.innerHTML = "CONSOLE LOG: Please Select a Simulation Type";
        return;
    }
    //Disable buttons during sim
    document.getElementById("animationConstant").style.disabled = true;
    clearCSVTable();

    //***Set UI controls(bottom of code) from data in other buttons

    numRequests = requests;
    interval = 1000*fireInterval;
    probability = prob;
    constant = document.getElementById("animationConstant").value * 2 / fireInterval;
    console.log("runSim Called");
    startTime = performance.now();
    runSim(GRAPH_);
    },1500);
}

//Takes requests, logs and times them
//if speed is -1, do the requests as fast as possible
function runSim(graph){
    //Default interval is every 5 seconds a request is made.
    //let interval = 5000.00/speed;
    if(interval == 0){
        //I aint dealing with infinity
        return;
    }

    //Stop sim
    else if(numRequests <= 0 || keepRunning == false){
        
        setTimeout(function(){
            for(let i=0; i < carList.length; i++){
                if(carList[i].path.length!=1){
                    runSim(graph);
                    return;
                }
            }
            console.log("timeout called...");
            resetCars();
            console.log("Total time: " + (performance.now() - startTime));
            console.log("Sim finished");
            let avg = averageTable(tableData);
            consoleLog.innerHTML = "CONSOLE LOG: Simulation complete, Average Time Taken per Request= " + avg.toFixed(2) + "ms, View Results by downloading them below";
            document.getElementById("tableToCSV").style.backgroundColor = "#EADE64";
            enableSimButtons();
        },5000);
        return;
    }

    //Performance/Testing Mode
    //Use for large/fast test cases since setTimeout has a 4ms delay.
    else if(performSim.value=="enabled"){
        let randomPair; console.log("performance sim started");
        while(numRequests > 0){

            if(Math.random() <= probability){

                //Data to be added to table
                let newRow = [];

                //Adds current time to table 
                newRow.push((performance.now() - startTime).toString());

                //***Code to run in sim
                randomPair = randomNodePair(graph);
                let t1 = performance.now();
                    //call dijkstra or A* with randomPair.first, randomPair.second.
                    //No animation needed, while loop blocks thread anyway
                    if(algo=="aStar"){
                        aStar(graph, randomPair.first,randomPair.second);
                    }
                    else{
                        graph.dijkstraPQ(randomPair.first, randomPair.second);
                    }


                let t2 = performance.now();


                //from, to, execution time to the table.
                newRow.push(randomPair.first.name);
                newRow.push(randomPair.second.name);
                newRow.push((t2-t1).toString());
                appendTableData(tableData, newRow);
                numRequests--;
            }
        }
        console.log("Total time: " + (performance.now() - startTime));
        let avg = averageTable(tableData);
        //console.log(avg);
        consoleLog.innerHTML = "CONSOLE LOG: Simulation complete, Average Time Taken per Request= " + avg.toFixed(2) + "ms, View Results by downloading them below";
        document.getElementById("tableToCSV").style.backgroundColor = "#EADE64";
        resetCars();
        if(previousGraph.length==0){
            previousGraph.push(graph);
        }
        else{previousGraph[0] = graph;}
        //enableSimButtons();
    }
    
    //GUI mode
    //Probability to make request. Very slow compared to while loop.
    else if(graphSim.value=="enabled"){
        let next = setTimeout(runSim, interval, graph);
      if(Math.random() <= probability){
        //Data to be added to table
        let newRow = [];

        //Adds current time to table 
        newRow.push((performance.now() - startTime).toString());


        //***Code to run in sim
        let randomPair = randomNodePair(graph);
        let t1 = performance.now();
            //call dijkstra or A* with randomPair.first, randomPair.second.
            //Probably need to adjust animation speed based on speed var
            console.log("CONSOLE LOG: Ride requested from " + randomPair.first.name + " to " + randomPair.second.name);
            requestRide(randomPair.first.name,randomPair.second.name);
            


        
        let t2 = performance.now();

        //from, to, execution time to the table.
        newRow.push(randomPair.first.name);
        newRow.push(randomPair.second.name);
        newRow.push((t2-t1).toString());
        appendTableData(tableData, newRow);
        numRequests--;
      }
        
    }

    
}

//Assumes graph holds ints. Graph starts at 1.
function randomNodePair(graph){
    let range = graph.graph.size;
    let randomPair = {
        first: graph.graph.get((Math.floor(Math.random()*range + 1)).toString()),
        second: graph.graph.get((Math.floor(Math.random()*range + 1)).toString()),
    }
    if(randomPair.first.name == randomPair.second.name){
        randomPair = randomNodePair(graph);
    }
    return randomPair;
}


function averageTable(data){
    let total = 0.0;
    for(i=1; i<data.rows.length; i++){
      total += parseFloat(data.rows.item(i).cells.item(3).innerHTML);
    }
    return total/(data.rows.length-1);
}


let last = document.getElementById("lastGraph");
let lState = 0;
last.addEventListener("click", function(){
    if(lState==0 && previousGraph.length==1){
        toggleButtons2(1,last, ""); lState=1;
    }
    else if(lState==1){
        toggleButtons2(0,last, ""); lState=0;
    }
    else{}
});


let gState = 0; let pState = 0;
graphSim.addEventListener("click", function(){
    if(gState==0 && pState==1){
        graphSim.style.backgroundColor = "#58ee5f";
        toggleButtons2(1,graphSim,""); gState = 1;

        performSim.style.backgroundColor = "#df2f2f";
        toggleButtons2(0,performSim,""); pState = 0;
        showGraphical();
    }
    else if(gState==0 && pState==0){
        graphSim.style.backgroundColor = "#58ee5f";
        toggleButtons2(1,graphSim,""); gState = 1;
        showGraphical();
    }
    else if(gState==1 && pState==0){
        graphSim.style.backgroundColor = "#58ee5f";
    }
    else{
        graphSim.style.backgroundColor = "#df2f2f";
        toggleButtons2(0,graphSim,""); gState = 0;
    }
});

performSim.addEventListener("click", function(){
    if(pState==0 && gState==1){
        performSim.style.backgroundColor = "#58ee5f";
        toggleButtons2(1,performSim,""); pState = 1;

        graphSim.style.backgroundColor = "#df2f2f";
        toggleButtons2(0,graphSim,""); gState = 0;
        showPerformance();
    }
    else if(pState==0 && gState==0){
        performSim.style.backgroundColor = "#58ee5f";
        toggleButtons2(1,performSim,""); pState = 1;
        showPerformance();
    }
    else if(pState==1 && gState==0){
        performSim.style.backgroundColor = "#58ee5f";
    }
    else{
        performSim.style.backgroundColor = "#df2f2f";
        toggleButtons2(0,performSim,""); pState = 0;
    }
});


function showGraphical(){
    document.getElementById("numNodes").style.display = "none";
    document.getElementById("numNodes").value = "";
    document.getElementById("numNodesLabel").innerHTML = "";

    document.getElementById("fireInterval").style.display = "inline-block";
    document.getElementById("fireIntervalLabel").innerHTML = "Interval ";
    document.getElementById("probability").style.display = "inline-block";
    document.getElementById("probabilityLabel").innerHTML = "Probability";
}

function showPerformance(){
    document.getElementById("numNodes").style.display = "inline-block";
    document.getElementById("numNodesLabel").innerHTML = "# Nodes ";

    document.getElementById("fireInterval").style.display = "none";
    document.getElementById("fireInterval").value = "";
    document.getElementById("fireIntervalLabel").innerHTML = "";
    document.getElementById("probability").style.display = "none";
    document.getElementById("probability").value = "";
    document.getElementById("probabilityLabel").innerHTML = "";
}

function disableSimButtons(){
    document.getElementById("animationConstant").style.disabled = true;
    document.getElementById("fireInterval").style.disabled = true;
    graphSim.disabled = true;
    performSim.disabled = true;
}

function enableSimButtons(){
    document.getElementById("animationConstant").style.disabled = false;
    document.getElementById("fireInterval").style.disabled = false;
    graphSim.disabled = false;
    performSim.disabled = false;
}

function clearCSVTable(){
    let t = document.getElementById("tableData");
    while(t.rows.length > 1){
        t.deleteRow(1);
    }
}
