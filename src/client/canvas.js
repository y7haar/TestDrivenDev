/* 
 * Source-Code for Canvas
 */

var canvas;
var ctx;
//var gameLoop =  new tddjs.client.gameLoopController();
var mapGen = new tddjs.server.controller.mapGenerator(); //nur zum testen
var map,logicMap;

var selectedImg = new Image();
selectedImg.src = "client/ui/selectedImg.png";
var hoverImg = new Image();
hoverImg.src = "client/ui/hoverImg.png";

var countryStrHover="NICHTS!";
var countryStrSelected="NICHTS!";
var stateStr="";

var countryHover=[];
var countrySelected=[];

var button=[];




var mainloop = function() {
        updateGame();
        drawGame();
        window.requestAnimationFrame(mainloop);
    };

function updateGame(){
    //window.requestAnimationFrame(mainloop);
    //stateStr=gameLoop.getStateName();
    countryStrSelected=" | ";
    countryStrHover=" | ";
    
    for(var i in countryHover){
        countryStrHover=countryHover[i].getName();
        for(var continent in logicMap.getContinents())
            if(logicMap.getContinents()[continent].hasCountryByObject(countryHover[i]))
                countryStrHover=countryStrHover+" ["+logicMap.getContinents()[continent].getName()+"]";
        countryHover[i].hover=true;
    }
    for(var i in countrySelected){
        countryStrSelected=countryStrSelected+countrySelected[i].getName();
        for(var continent in logicMap.getContinents())
            if(logicMap.getContinents()[continent].hasCountryByObject(countrySelected[i]))
                countryStrSelected=countryStrSelected+" ["+logicMap.getContinents()[continent].getName()+"] | ";
        countrySelected[i].selected=true;
    }
}
function drawGame(){
    clear();
    drawMap();
    drawUI();
}

// <editor-fold defaultstate="collapsed" desc="draw-Methoden">
//draw methoden
var border=50; //25 an jeder seite
var bottom=50; //insg 75 unten frei für menü etc
function drawMap(){
    var w = (ctx.canvas.width-border-map.length)/map.length;
    var h = (ctx.canvas.height-border-bottom-map[0].length)/map[0].length;
    
    for(x=0;x<map.length;x++){
        for(y=0;y<map[0].length;y++){
            ctx.strokeStyle="#000";
            ctx.fillStyle = "#552700";
            ctx.fillStyle=map[x][y].color;
            ctx.lineWidth="1";
            ctx.fillRect(x+(x*w)+border/2,y+(y*h)+border/2,w+2,h+2);
            
            if(map[x][y].hover){
                //ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
                //ctx.fillRect(x+(x*w)+border/2,y+(y*h)+border/2,w+2,h+2);
                ctx.drawImage(hoverImg, x+(x*w)+border/2,y+(y*h)+border/2,w+2,h+2);

            }
            
            if(map[x][y].selected){
                //ctx.fillStyle = "rgba(255, 128, 128, 0.7)";
                //ctx.fillRect(x+(x*w)+border/2,y+(y*h)+border/2,w+2,h+2);
                ctx.drawImage(selectedImg, x+(x*w)+border/2,y+(y*h)+border/2,w+2,h+2);
            }
            
            drawMapBorder(x,y,w,h);
        }
    }
}
function drawMapBorder(x,y,w,h){
    var offset=1;
    ctx.lineWidth="2";
    ctx.strokeStyle="#00F";
    if(x>0 && y>0){
        if(map[x][y].id !== map[x-1][y].id)
        {
            ctx.beginPath();
            ctx.moveTo(x+(x*w)+border/2, y+(y*h)+border/2);
            ctx.lineTo(x+(x*w)+border/2+0, y+(y*h)+border/2+h+offset);
            ctx.stroke();
        }
        if(map[x][y].id !== map[x][y-1].id)
        {
            ctx.beginPath();
            ctx.moveTo(x+(x*w)+border/2, y+(y*h)+border/2);
            ctx.lineTo(x+(x*w)+border/2+w+offset, y+(y*h)+border/2+0);
            ctx.stroke();
        }
    }
    else{
        if(x===0 && y>0 )
        {
            if(map[x][y].id !== map[x][y-1].id)
            {
                ctx.beginPath();
                ctx.moveTo(x+(x*w)+border/2, y+(y*h)+border/2);
                ctx.lineTo(x+(x*w)+border/2+w+offset, y+(y*h)+border/2+0);
                ctx.stroke();
            }
        }
        else if(y===0 && x>0 )
        {
            if(map[x][y].id !== map[x-1][y].id)
            {
                ctx.beginPath();
                ctx.moveTo(x+(x*w)+border/2, y+(y*h)+border/2);
                ctx.lineTo(x+(x*w)+border/2+0, y+(y*h)+border/2+h+offset);
                ctx.stroke();
            }
        }
    }
    ctx.beginPath();
    ctx.moveTo(border/2,border/2);
    ctx.lineTo(ctx.canvas.width-border/2, border/2);
    ctx.lineTo(ctx.canvas.width-border/2, ctx.canvas.height-border/2-bottom);
    ctx.lineTo(border/2, ctx.canvas.height-border/2-bottom);
    ctx.lineTo(border/2, border/2);
    ctx.stroke();
}
function drawUI(){
    //draw borders etc
    ctx.fillStyle = "#D49B6A";
    ctx.fillRect(0,ctx.canvas.height-border/2,ctx.canvas.width,border/2);
    ctx.fillRect(0,0,ctx.canvas.width,border/2);
    ctx.fillRect(0,0,border/2,ctx.canvas.height);
    ctx.fillRect(ctx.canvas.width-border/2,0,border/2,ctx.canvas.height);
    
    ctx.fillStyle = "#FFD1AA";
    ctx.fillRect(border/2,ctx.canvas.height-border/2-bottom,ctx.canvas.width-border,bottom);
    
    //draw buttons
    for (var i in button)
       button[i].draw();
   
   //Text
   ctx.font="20px Georgia";
   ctx.fillStyle = "#000000";
   ctx.fillText(stateStr,ctx.canvas.width/2-ctx.measureText(stateStr).width/2,20);
   ctx.fillStyle = "#000000";
   ctx.fillText(countryStrHover,ctx.canvas.width-border-ctx.measureText(countryStrHover).width,canvas.height-border/2-bottom+20);
   ctx.fillStyle = "#FF0000";
   ctx.fillText(countryStrSelected,ctx.canvas.width-border-ctx.measureText(countryStrSelected).width,canvas.height-border/2-bottom+40);
}
function clear(){
    ctx.fillStyle = "#ebebeb";
    ctx.fillRect(0,0,ctx.canvas.width, ctx.canvas.height);
}
// </editor-fold>

//Main-Init()
function init(){
    canvas = document.getElementById('game');
    if (canvas && canvas.getContext) {
       ctx = canvas.getContext("2d");
       if (ctx) {
            clear();
            init_map();
            
            button[0]=new tddjs.client.ui.button(30,ctx.canvas.height-65,"getSelected()",ctx);
            button[0].click=click_test;
            button[1]=new tddjs.client.ui.button(170,ctx.canvas.height-65,"button-class 2",ctx);
            
            window.requestAnimationFrame(mainloop);
            
            canvas.addEventListener('mousemove', onCanvasMouseMove, false);
            canvas.addEventListener('mousedown', onCanvasMouseDown, false);
        }
    }
}

// <editor-fold defaultstate="collapsed" desc="gameSates für EventListener">
// <editor-fold defaultstate="collapsed" desc="gameSates für MouseMove">
//gameSates: MouseMove
function mouseMoveAttackingState(oEvent) {
    for (var i in button)
       button[i].isCoordOnButton(oEvent.offsetX,oEvent.offsetY);
    var w = (ctx.canvas.width-border-map.length)/map.length;
    var h = (ctx.canvas.height-border-bottom-map[0].length)/map[0].length;


    countryHover=[];
    for(x=0; x<map.length; x++){
        for(y=0;y<map[0].length;y++){
            map[x][y].hover=false;
            if(oEvent.offsetX>=x+(x*w)+border/2
                    && oEvent.offsetX<=x+(x*w)+border/2+w
                    && oEvent.offsetY>=y+(y*h)+border/2
                    && oEvent.offsetY<=y+(y*h)+border/2+h)
            {
                if(countryHover.indexOf(map[x][y]) === -1)
                    countryHover.push(map[x][y]);
            }
        }
    }
}
function mouseMoveWaitingState(oEvent) {
    for (var i in button)
       button[i].isCoordOnButton(oEvent.offsetX,oEvent.offsetY);
}
// </editor-fold>
// <editor-fold defaultstate="collapsed" desc="gameSates für MouseDown">
//gameStates: MouseDown
function mouseDownAttackingState(oEvent) {
    var w = (ctx.canvas.width-border-map.length)/map.length;
    var h = (ctx.canvas.height-border-bottom-map[0].length)/map[0].length;    
    
    for(x=0;x<map.length;x++){
        for(y=0;y<map[0].length;y++){
            map[x][y].selected=false;
            if(oEvent.offsetX>=x+(x*w)+border/2
                    && oEvent.offsetX<=x+(x*w)+border/2+w
                    && oEvent.offsetY>=y+(y*h)+border/2
                    && oEvent.offsetY<=y+(y*h)+border/2+h)
                if(countrySelected.indexOf(map[x][y]) === -1)
                    countrySelected.push(map[x][y]);
                else
                    countrySelected.splice(countrySelected.indexOf(map[x][y]),1);
        }
    }
    
    for (var i in button)
       if(button[i].isCoordOnButton(oEvent.offsetX,oEvent.offsetY))
           button[i].click();
}
// </editor-fold>
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="EventListener">
//Event-Listener
function onCanvasMouseMove(oEvent) {
    /*if(gameLoop.getStateName() === "attackingState")
        mouseMoveAttackingState(oEvent);
    else if(gameLoop.getStateName() === "placingState")
        mouseMoveAttackingState(oEvent);
    else if(gameLoop.getStateName() === "waitingState")
        mouseMoveAttackingState(oEvent);*/
    //drawGame();
}
function onCanvasMouseDown(oEvent) {
    /*if(gameLoop.getStateName() === "attackingState")
        mouseDownAttackingState(oEvent);
    else if(gameLoop.getStateName() === "placingState")
        mouseDownAttackingState(oEvent);
    else if(gameLoop.getStateName() === "waitingState")
        mouseDownAttackingState(oEvent);*/
    //drawGame();
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Methoden für die UI-"Tests"">
//Test
function click_test(){
    var count=0;
    var cache_id=[];
    for(x=0;x<map.length;x++){
        for(y=0;y<map[0].length;y++){
            if(map[x][y].selected)
                if(cache_id.indexOf(map[x][y].id) === -1)
                    count++;
                cache_id.push(map[x][y].id);
        }
    }
    console.log(count+" selected!");
}
function init_map(){ //nur zum testen
    mapGen.setGridSize(5,5);
    logicMap = mapGen.generateMap();
    map = mapGen.getMapGrid();
    console.log(map);
    console.log(mapGen.getAllCountries());
    for(x=0;x<map.length;x++){
        for(y=0;y<map[0].length;y++){
            map[x][y].selected=false;
            map[x][y].hover=false;
            map[x][y].color="#"+Math.floor(Math.random()*10)+Math.floor(Math.random()*10)+Math.floor(Math.random()*10);
            //map.cellGrid[x][y].setName("ID: "+map.cellGrid[x][y].id);
        }
    }
}
// </editor-fold>