//let svgR = document.querySelector('.svg-container');

console.log("loaded svgDraw");
const svg = document.getElementsByTagName('svg')[0]; //Get svg element
const svgC = document.querySelector(".svg-container");
const consoleLog = document.getElementById("console-log");
let elementList = [];
//svg.style.width = window.innerWidth *.9;
//svg.style.height = window.innerWidth *.3;
let svgGraph = new Graph();
let previousGraph = [];
let b = document.getElementById("greenBtn");
let state2 = 0; let redCount2 = 0; let red2 = new Node();

/* Resize SVG (NOT IN USE)
function setSVGSize(){
    console.log("resize");
    let w = window.innerWidth *.9;
    let h = window.innerHeight *.7;
    svg.style.width = w;
    svg.style.height = h;
    //let cont = document.getElementById("svg-container");
    //cont.style.width = w;
   // cont.style.height = h;

}

window.onresize = function(e){
    //setSVGSize();
}
*/
//On button click
b.addEventListener("click", function(){
    if(state2==0){
        toggleButtons2(1,b, "addNode"); state2=1;
    }
    else{
        toggleButtons2(0,b, "addNode"); state2=0;
    }
});

//Enabled/Disabled button feature
function toggleButtons2(value, button, task) {    
    if (value === 1) {
        //console.log("activate " + task);
        button.value = "enabled";
        button.innerHTML= button.innerHTML + " (enabled)";
        if(task=="addNode"){  
            document.getElementById("greenBtn").style.backgroundColor = "#58ee5f";
            svg.addEventListener('click', clickHandler2);
        }
     
    } else {
        //console.log("disable " + task);
        button.value = "disabled";
        button.innerHTML = button.innerHTML.substr(0,button.innerHTML.length-10);
        if(task=="addNode"){
            document.getElementById("greenBtn").style.backgroundColor = "#df2f2f";
            svg.removeEventListener('click', clickHandler2);
        }  
    }
};

//Gets on-click coordinates & draws node correctly
function clickHandler2() {
    let pt = svg.createSVGPoint();
    pt.x = event.clientX; pt.y = event.clientY;
    let svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
    addNode2(svgP.x, svgP.y);
};

//Used to draw circle initially & create node object that is added to graph
function svgCircle(x,y,r,color,svg,graphType){
    let newElement = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
    newElement.setAttribute("r",r);
    newElement.setAttribute("cx",x);
    newElement.setAttribute("cy",y);
    newElement.style.fill = color;
    svg.appendChild(newElement);
    let count = graphType.nodeCount+1;
    //console.log("count: " + count);
    let n = new Node(x,y,20,count.toString(),newElement);
    graphType.addNode(n);
    consoleLog.innerHTML = "CONSOLE LOG: Added Node at x: " + x.toFixed(2) + " y: " + y.toFixed(2);
    //svgGraph.printAllNodes();
}

//Used to draw circle initially & create node object that is added to graph. Modifies nodes passed into it
function svgGenerateCircle(x,y,r,color,svg,node){
    let newElement = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
    newElement.setAttribute("r",r);
    newElement.setAttribute("cx",x);
    newElement.setAttribute("cy",y);
    newElement.style.fill = color;
    svg.appendChild(newElement);
    //console.log("count: " + count);
    node.id = newElement;
    return node;
    //svgGraph.printAllNodes();
}

//Used to redraw circle ontop of edge when edge is created
function svgCircleReplace(x,y,r,color,svg, node){
    svg.removeChild(node.id);
    let newElement = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
    newElement.setAttribute("r",r);
    newElement.setAttribute("cx",x);
    newElement.setAttribute("cy",y);
    newElement.style.fill = color;
    svg.appendChild(newElement);
    node.id = newElement;
}


//Draw line between two nodes
function svgLine(startX, startY, endX, endY, width, color, svg){
    let newElement = document.createElementNS("http://www.w3.org/2000/svg", 'path'); 
    //let ds = "M " + pointFrom[0] + " " + pointFrom[1] + " L " + pointTo[0] + " " + pointTo[1];
    let ds = "M " + startX + " " + startY + " L " + endX + " " + endY;
    newElement.setAttribute("d", ds); 
    newElement.style.stroke = color; 
    newElement.style.strokeWidth = width;
    svg.appendChild(newElement);
}

//Label each node with a number
function svgText(x,y,t){
    let newElement = document.createElementNS("http://www.w3.org/2000/svg", 'text');
    newElement.setAttribute('x', x);
    newElement.setAttribute('y', y);
    newElement.setAttribute('fill', '#fff');
    newElement.style.fontSize = 14;
    newElement.textContent = t;
    svg.appendChild(newElement);
    elementList.push(newElement);
}

//Replace number label after svgCircleReplace
function svgTextReplace(x,y,t,textIndex){
    let textInList = elementList[parseFloat(textIndex)-1];
    elementList.splice(parseFloat(textIndex)-1,1);
    //console.log(textInList);
    svg.removeChild(textInList);
    let newElement = document.createElementNS("http://www.w3.org/2000/svg", 'text');
    newElement.setAttribute('x', x);
    newElement.setAttribute('y', y);
    newElement.setAttribute('fill', '#fff');
    newElement.style.fontSize = 14;
    newElement.textContent = t;
    svg.appendChild(newElement);
    elementList.splice(parseFloat(textIndex)-1,0,newElement);
}

//Check if on-click is in a node or too close to another node
function isIntersect(n,x,y){
    if(Math.sqrt(((x-n.x)**2) + ((y-n.y)**2)) < 20){ //Click is in a node
        return 0;
    }
    else if(Math.sqrt(((x-n.x)**2) + ((y-n.y)**2)) < n.r+35){ //Click is too close to another node (don't draw)
        return 1
    }

    else return 2;
}

//Calculate pixel distance between two nodes
function getWeight(x1,y1,x2,y2){
    //let ans = Math.sqrt((Math.abs(y2-y1)**2 + Math.abs(x2-x1)**2));
    let ans = Math.sqrt(Math.pow(y2-y1,2) + Math.pow(x2-x1,2));
    return ans.toFixed(2);
}

//Properly add node / draw edge based on on-click inputs
function addNode2(x,y){
    console.log("add nodeSVG called");
    let l = svgGraph.nodeList;
    

    for(let i=0; i < l.length; i++){
        let result = isIntersect(l[i],x,y)
        if(result==0 && l.length>1 && l[i].name != red2.name){
            redCount2++;
            if(redCount2==2){
                //Draw line between two nodes
                red2.id.style.fill = "black";
                svgLine(red2.x,red2.y,l[i].x,l[i].y,5,"black",svg);
                svgCircleReplace(red2.x,red2.y,20,"black",svg,red2);
                svgCircleReplace(l[i].x,l[i].y,20,"black",svg,l[i]);
                svgTextReplace(red2.x-3,red2.y+3,(red2.name).toString(),red2.name);
                svgTextReplace(l[i].x-3,l[i].y+3,(l[i].name).toString(),l[i].name);
                let w = getWeight(l[i].x,l[i].y,red2.x,red2.y);
                //console.log("adding edge b/w: " + l[i].name + " & " + red2.name);
                consoleLog.innerHTML = "CONSOLE LOG: Added Edge between Station " +  red2.name + " & Station " + l[i].name;
                svgGraph.insertEdge(l[i],red2,w);
                svgGraph.insertEdge(red2,l[i],w);
                redCount2=0;  red2 = new Node();
                svgGraph.printConnections();
                return;
            }

            consoleLog.innerHTML = "CONSOLE LOG: Edge Connector Enabled";
            red2=l[i];
            l[i].id.style.fill = "red";
            return;
        }
        else if(result==0 && red2.name==l[i].name){
            //console.log("self loop");
            consoleLog.innerHTML = "CONSOLE LOG: Edge Connector Disabled";
            l[i].id.style.fill = "black";
            redCount2=0; red2 = new Node();
            return;
        }
        else if(result>=0 && redCount2==1 && i==l.length-1){
            console.log("one red, second not found");
            return;
        }
        else if(result<=1 && redCount2==0){
            consoleLog.innerHTML = "CONSOLE LOG: Error, new circle is too close to another one!";
            //alert("new circle is too close to another one!");
            return;
        }
        else{}
    }

    svgCircle(x,y,20,"black",svg,svgGraph);
    let t = svgGraph.nodeCount;
    svgText(x-3,y+3,t.toString());
    return;

}

function resetScreen(){
    if(keepRunning == true){
        keepRunning = false;
    }
    setTimeout(function(){
        console.log("reset screen");
        if(previousGraph.length==0){
            previousGraph.push([svgGraph,svg]);
        }
        else{previousGraph[0] = svgGraph;}
        while(svg.lastChild){
            svg.removeChild(svg.lastChild);
        }

        let t = document.getElementById("carInfo");
        while(t.rows.length > 1){
            t.deleteRow(1);
        }
        
        svgGraph = new Graph();
        elementList = [];carList = [];
        newAnimationPath = [];newChunkPath = [];
    }, 2000)
    
}


function loadPreviousGraph(){
    if(previousGraph.length==0){
        consoleLog.innerHTML = "CONSOLE LOG: Last Performance Sim Graph has not been created";
        return;
    }
    else if(lastGraph.value=="enabled"){
        consoleLog.innerHTML = "CONSOLE LOG: Loading last graph feature is disabled";
        return;
    }
    else{
        let reload = previousGraph[0];
        large = reload;
        consoleLog.innerHTML = "CONSOLE LOG: Last Performance Sim Graph has been loaded and is ready for use";
    }
}
