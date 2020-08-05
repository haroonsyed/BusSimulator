    //NOT IN USE!!!!!!!!!!!
    
    const canvas = document.querySelector('.myCanvas');
    //canvas.style.width = "1200px";
   // canvas.style.height = "950px";
    //canvas.width = canvas.height *
    //    (canvas.clientWidth / canvas.clientHeight);
    const width = canvas.width = window.innerWidth*.75 ;
    const height = canvas.height = window.innerHeight*.9;
    const ctx = canvas.getContext('2d');


    function setCanvasSize(){
        //Needs to clear all data of graph
        let w = window.innerWidth *.75;
        let h = window.innerHeight *.9;
     
        canvas.width = w;
        canvas.height = h;
        ctx.fillStyle = "pink";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = 'red';
        ctx.moveTo(canvas.width/2, 0);
        ctx.lineTo(canvas.width/2, canvas.height);
        ctx.moveTo(0, canvas.height/2);
        ctx.lineTo(canvas.width, canvas.height/2);
        ctx.stroke();

    }
 

    window.onresize = function(e){
        setCanvasSize();
    }


    //Adjacency list test (WORKS, to be removed)
    /*let test = new Graph();
    let one = new Node(10,10,20,"one");
    let two = new Node(750,750,20,"two");
    let three = new Node(600,600,20,"three");
    test.addNode(one);test.addNode(two);test.addNode(three);
    test.insertEdge(one,two,25); test.insertEdge(one,three,10);
    test.insertEdge(two,three,5);
    test.insertEdge(three,one,14);
    test.printConnections(); */



    let test2 = new Graph();
    let b = document.getElementById("blackBtn");
    let state = 0; let redCount = 0; let red1 = new Node();

    b.addEventListener("click", function(){
        if(state==0){
            toggleButtons(1,b); state=1;
        }
        else{
            toggleButtons(0,b); state=0;
        }
    });


function toggleButtons(value, button) {    
    if (value === 1) {
        console.log("activate");
        button.value = "enabled";
        button.innerHTML= button.innerHTML + " (enabled)";
        //document.getElementById("svg1").style.zIndex = "-1";  
        canvas.addEventListener('click', clickHandler);
    } else {
        console.log("disable");
        button.value = "disabled";
        button.innerHTML = button.innerHTML.substr(0,button.innerHTML.length-10);
        //document.getElementById("svg1").style.zIndex = "2";
        canvas.removeEventListener('click', clickHandler);  
    }
};
function clickHandler() {
    addNode(ctx,canvas,test2);
};

function canvasCircle(x,y,r,color,ctx){
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2,false);
    ctx.fillStyle = color;
    ctx.closePath();
    ctx.fill();
}

function canvasLine(startX,startY,endX,endY,width,color,ctx){
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.closePath();
    ctx.stroke();
}

//If click is in node, detect second node click
//Draw line connecting two nodes
function isIntersect(n,x,y){
    //console.log("x: " + x + " y: " + y + " centerx: " + n.x + " centery: " + n.y + " rad: " + n.r);
    if(Math.sqrt(((x-n.x)**2) + ((y-n.y)**2)) < n.r){ //Click is in a node
        return 0;
    }
    else if(Math.sqrt(((x-n.x)**2) + ((y-n.y)**2)) < n.r+35){ //Click is too close to another node (don't draw)
        return 1
    }

    else return 2;
}
function getWeight(x1,y1,x2,y2){
    let ans = Math.sqrt((Math.abs(y2-y1)**2 + Math.abs(x2-x1)**2));
    return ans.toFixed(2);
}

//---------------------------------------------------------------------------------------------------------------------
//Actual code (KEEP)
function addNode(ctx,canvas,test2){
    console.log("add node called");
    let black = document.getElementById("blackBtn").value;
    let rect = canvas.getBoundingClientRect();
    let scaleX = canvas.width / rect.width; let scaleY = canvas.height / rect.height;
    let x = (event.clientX - rect.left)*scaleX; let y = (event.clientY - rect.top)*scaleY;
    let l = test2.nodeList;

        for(let i=0; i < l.length; i++){
            let result = isIntersect(l[i],x,y); 
            if(result==0 && l.length>1 && l[i].name != red1.name){ //Click inside a node (start edge detection)
                redCount++;
                if(redCount==2){ //If two nodes are selected, draw a line between the two
                    canvasCircle(l[i].x,l[i].y,20,"black",ctx);
                    canvasCircle(red1.x,red1.y,20,"black",ctx);
                    canvasLine(l[i].x,l[i].y,red1.x,red1.y,5,"black",ctx);
                    ctx.font = '8pt Calibri';
                    ctx.fillStyle = 'white';
                    ctx.textAlign = 'center';
                    ctx.fillText(l[i].name,l[i].x,l[i].y+3);
                    ctx.fillText(red1.name,red1.x,red1.y+3);
                    let w = getWeight(l[i].x,l[i].y,red1.x,red1.y);
                    test2.insertEdge(l[i],red1,w);
                    test2.insertEdge(red1,l[i],w);
                    test2.printConnections();
                    redCount=0; red1 = new Node();
                    return;
                }

                //First node for edge clicked
                alert("circle " + l[i].name + " clicked, select another to draw an edge");
                ctx.beginPath();
                ctx.arc(l[i].x, (l[i].y), 20, 0, Math.PI * 2,false);
                ctx.fillStyle = 'red';
                ctx.fill();
                ctx.font = '8pt Calibri';
                ctx.fillStyle = 'white';
                ctx.textAlign = 'center';
                ctx.fillText(l[i].name,l[i].x,l[i].y+3);
                red1=l[i];
                return;
            }

            //Red node clicked, self loop, cancel edge detection
            else if(result==0 && red1.name == l[i].name){
                console.log("self loop, disable edge");
                canvasCircle(l[i].x,l[i].y,20,"black",ctx);
                ctx.font = '8pt Calibri';
                ctx.fillStyle = 'white';
                ctx.textAlign = 'center';
                ctx.fillText(l[i].name,l[i].x,l[i].y+3);
                redCount = 0; red1 = new Node();
                return;
            }

            //Second node not clicked with red activated
            else if(result>=0 && redCount==1 && i==l.length-1){
                console.log("one red, not in any node");
                return;
            }
            //No red, node is too close to another node to draw
            else if(result==1 && redCount==0){
                alert("new circle is too close!");
                return;
            }
            else{}
        }


        //Draw node & add to nodeList
        canvasCircle(x,y,20,"black",ctx);
        let count = test2.nodeCount + 1;
        let n = new Node(x,y,20,count.toString());
        test2.addNode(n);
        //test2.printAllNodes();

        ctx.font = '8pt Calibri';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText(count.toString(),x,y+3);
        return;
   
}







