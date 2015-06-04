/* 
 * Source-Code for Canvas
 */

var canvas;
var ctx;
//var gameLoop =  new tddjs.client.game.gameLoopController();
var mapGen = new tddjs.server.controller.mapGenerator(); //nur zum testen
var map;

var selectedImg = new Image();
selectedImg.src = "client/ui/selectedImg.png";
var hoverImg = new Image();
hoverImg.src = "client/ui/hoverImg.png";

var countryStrHover="NICHTS!";
var countryStrSelected="NICHTS!";

var button=[];




var mainloop = function() {
        updateGame();
        drawGame();
    };

function updateGame(){
    //window.requestAnimationFrame(mainloop);
}
function drawGame(){
    clear();
    drawMap();
    drawUI();
}

/*draw methoden*/
var border=50; //25 an jeder seite
var bottom=50; //insg 75 unten frei für menü etc
function drawMap(){
    var w = (ctx.canvas.width-border-map.cellGrid.length)/map.cellGrid.length;
    var h = (ctx.canvas.height-border-bottom-map.cellGrid[0].length)/map.cellGrid[0].length;
    
    for(x=0;x<map.cellGrid.length;x++){
        for(y=0;y<map.cellGrid[0].length;y++){
            ctx.strokeStyle="#000";
            ctx.fillStyle = "#552700";
            ctx.fillStyle=map.cellGrid[x][y].color;
            ctx.lineWidth="1";
            ctx.fillRect(x+(x*w)+border/2,y+(y*h)+border/2,w+2,h+2);
            
            if(map.cellGrid[x][y].hover){
                //ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
                //ctx.fillRect(x+(x*w)+border/2,y+(y*h)+border/2,w+2,h+2);
                ctx.drawImage(hoverImg, x+(x*w)+border/2,y+(y*h)+border/2,w+2,h+2);

            }
            
            drawMapBorder(x,y,w,h);
            
            if(map.cellGrid[x][y].selected){
                //ctx.fillStyle = "rgba(255, 128, 128, 0.7)";
                //ctx.fillRect(x+(x*w)+border/2,y+(y*h)+border/2,w+2,h+2);
                ctx.drawImage(selectedImg, x+(x*w)+border/2,y+(y*h)+border/2,w+2,h+2);
            }
        }
    }
}
function drawMapBorder(x,y,w,h){
    ctx.lineWidth="2";
    ctx.strokeStyle="#000";
    if(x>0 && y>0){
        ctx.strokeStyle="#00f";
        if(map.cellGrid[x][y].id !== map.cellGrid[x-1][y].id)
        {
            ctx.beginPath();
            ctx.moveTo(x+(x*w)+border/2, y+(y*h)+border/2);
            ctx.lineTo(x+(x*w)+border/2+0, y+(y*h)+border/2+h);
            ctx.stroke();
        }
        if(map.cellGrid[x][y].id !== map.cellGrid[x][y-1].id)
        {
            ctx.beginPath();
            ctx.moveTo(x+(x*w)+border/2, y+(y*h)+border/2);
            ctx.lineTo(x+(x*w)+border/2+w, y+(y*h)+border/2+0);
            ctx.stroke();
        }
    }
    else{
        ctx.strokeStyle="#0f0";
        ctx.beginPath();
        ctx.moveTo(x+(x*w)+border/2, y+(y*h)+border/2);
        ctx.lineTo(x+(x*w)+border/2+w, y+(y*h)+border/2+0);
        ctx.moveTo(x+(x*w)+border/2, y+(y*h)+border/2);
        ctx.lineTo(x+(x*w)+border/2+0, y+(y*h)+border/2+h);
        ctx.stroke();
    }
}
function drawUI(){

    ctx.fillStyle = "#D49B6A";
    ctx.fillRect(0,ctx.canvas.height-border/2,ctx.canvas.width,border/2);
    ctx.fillRect(0,0,ctx.canvas.width,border/2);
    ctx.fillRect(0,0,border/2,ctx.canvas.height);
    ctx.fillRect(ctx.canvas.width-border/2,0,border/2,ctx.canvas.height);
    
    ctx.fillStyle = "#FFD1AA";
    ctx.fillRect(border/2,ctx.canvas.height-border/2-bottom,ctx.canvas.width-border,bottom);
    
    /*draw buttons*/
    //drawButton(ctx.canvas.width-border-90,ctx.canvas.height-border/2-bottom+2,"TEST");
    for (var i in button)
       button[i].draw();
   
   /*Text*/
   ctx.font="20px Georgia";
   ctx.fillStyle = "#000000";
   ctx.fillText(countryStrHover,ctx.canvas.width-border-ctx.measureText(countryStrHover).width,canvas.height-border/2-bottom+20);
   ctx.fillStyle = "#FF0000";
   ctx.fillText(countryStrSelected,ctx.canvas.width-border-ctx.measureText(countryStrSelected).width,canvas.height-border/2-bottom+40);
}
function clear(){
    ctx.fillStyle = "#ebebeb";
    ctx.fillRect(0,0,ctx.canvas.width, ctx.canvas.height);
}

/*Main-Init()*/
function init(){
    canvas = document.getElementById('game');
    if (canvas && canvas.getContext) {
       ctx = canvas.getContext("2d");
       if (ctx) {
            clear();
            init_map();
            button[0]=new tddjs.client.ui.button(30,ctx.canvas.height-65,"button-class",ctx);
            button[0].click=click_test;
            button[1]=new tddjs.client.ui.button(150,ctx.canvas.height-65,"button-class 2",ctx);
            button[1].setText("TEST");
            window.requestAnimationFrame(mainloop);
            canvas.addEventListener('mousemove', onCanvasMouseMove, false);
            canvas.addEventListener('mousedown', onCanvasMouseDown, false);
        }
    }
}

/*Event-Listener*/
function onCanvasMouseMove(oEvent) {
    for (var i in button)
       button[i].isCoordOnButton(oEvent.offsetX,oEvent.offsetY);
    var w = (ctx.canvas.width-border-map.cellGrid.length)/map.cellGrid.length;
    var h = (ctx.canvas.height-border-bottom-map.cellGrid[0].length)/map.cellGrid[0].length;
    
    var cache_id;
    var cache_id_str=[];
    countryStrSelected=" | ";
    for(x=0;x<map.cellGrid.length;x++){
        for(y=0;y<map.cellGrid[0].length;y++){
            if(oEvent.offsetX>=x+(x*w)+border/2
                    && oEvent.offsetX<=x+(x*w)+border/2+w
                    && oEvent.offsetY>=y+(y*h)+border/2
                    && oEvent.offsetY<=y+(y*h)+border/2+h)
            {
                map.cellGrid[x][y].hover=true;
                cache_id=map.cellGrid[x][y].id;
                countryStrHover=map.cellGrid[x][y].getName();
            }
            else
            {
                if(map.cellGrid[x][y].id !== cache_id)
                    map.cellGrid[x][y].hover=false;
            }
            if(map.cellGrid[x][y].selected){
                if(cache_id_str.indexOf(map.cellGrid[x][y].id) === -1)
                    countryStrSelected=countryStrSelected+map.cellGrid[x][y].getName()+" | ";
                cache_id_str.push(map.cellGrid[x][y].id);
            }
        }
    }
    drawGame();
}
function onCanvasMouseDown(oEvent) {
    var w = (ctx.canvas.width-border-map.cellGrid.length)/map.cellGrid.length;
    var h = (ctx.canvas.height-border-bottom-map.cellGrid[0].length)/map.cellGrid[0].length;    
    
    for(x=0;x<map.cellGrid.length;x++){
        for(y=0;y<map.cellGrid[0].length;y++){
            if(oEvent.offsetX>=x+(x*w)+border/2
                    && oEvent.offsetX<=x+(x*w)+border/2+w
                    && oEvent.offsetY>=y+(y*h)+border/2
                    && oEvent.offsetY<=y+(y*h)+border/2+h)
                map.cellGrid[x][y].selected=!map.cellGrid[x][y].selected;
        }
    }
    
    for (var i in button)
       if(button[i].isCoordOnButton(oEvent.offsetX,oEvent.offsetY))
           button[i].click();
    
    drawGame();
}

/*Test*/
function click_test(){
    var count=0;
    var cache_id=[];
    for(x=0;x<map.cellGrid.length;x++){
        for(y=0;y<map.cellGrid[0].length;y++){
            if(map.cellGrid[x][y].selected)
                if(cache_id.indexOf(map.cellGrid[x][y].id) === -1)
                    count++;
                cache_id.push(map.cellGrid[x][y].id);
        }
    }
    console.log(count+" selected!");
}
function init_map(){ //nur zum testen
    mapGen.setGridSize(25,25);
    mapGen.generateMap();
    map = mapGen.getMapGrid();
    
    for(x=0;x<map.cellGrid.length;x++){
        for(y=0;y<map.cellGrid[0].length;y++){
            map.cellGrid[x][y].selected=false;
            map.cellGrid[x][y].hover=false;
            map.cellGrid[x][y].color="#"+Math.floor(Math.random()*10)+Math.floor(Math.random()*10)+Math.floor(Math.random()*10);
            map.cellGrid[x][y].setName("ID: "+map.cellGrid[x][y].id);
        }
    }
    console.log(map);
}