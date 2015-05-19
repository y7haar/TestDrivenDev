/* 
 * Source-Code for Canvas
 */

var canvas;
var ctx;
//var gameLoop =  new tddjs.client.game.gameLoopController();
var mapGen = new tddjs.server.controller.mapGenerator(); //nur zum testen
var map;

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

var border=50; //25 an jeder seite
var bottom=50; //insg 75 unten frei für menü etc
function drawMap(){
    var w = (ctx.canvas.width-border-map.cellGrid.length)/map.cellGrid.length;
    var h = (ctx.canvas.height-border-bottom-map.cellGrid[0].length)/map.cellGrid[0].length;
    
    for(x=0;x<map.cellGrid.length;x++){
        for(y=0;y<map.cellGrid[0].length;y++){
            ctx.strokeStyle="#f00";
            ctx.fillStyle = "#552700";
            ctx.fillStyle=map.cellGrid[x][y].color;
            ctx.lineWidth="1";
            ctx.fillRect(x+(x*w)+border/2,y+(y*h)+border/2,w,h);
            ctx.strokeRect(x+(x*w)+border/2,y+(y*h)+border/2,w,h);
        }
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
}

function drawButton(x,y,str){ //wird noch entfernt!
    ctx.fillStyle= "#000";
    ctx.strokeStyle="#fff";
    ctx.font = "20px Arial";
    
    if(mouse_x >= x && mouse_x <= ctx.measureText(str).width+x
            && mouse_y >= y && mouse_y <= 20+y)
    {
        ctx.fillStyle = "#0f0";
    }
    
    ctx.fillRect(x,y,ctx.measureText(str).width+10,30);
    ctx.strokeRect(x,y,ctx.measureText(str).width+10,30);
    ctx.fillStyle= "#fff";
    ctx.fillText(str,x+5,y+20);
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
    
    for(x=0;x<map.cellGrid.length;x++){
        for(y=0;y<map.cellGrid[0].length;y++){
            if(oEvent.offsetX>=x+(x*w)+border/2
                    && oEvent.offsetX<=x+(x*w)+border/2+w
                    && oEvent.offsetY>=y+(y*h)+border/2
                    && oEvent.offsetY<=y+(y*h)+border/2+h)
                map.cellGrid[x][y].color="#bbb";
            else
                map.cellGrid[x][y].color="#552700";
            if(map.cellGrid[x][y].selected)
                map.cellGrid[x][y].color="#fff";
                
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
    alert("andere methode...");
}
function init_map(){ //nur zum testen
    mapGen.setGridSize(15,15);
    mapGen.initCountries();
    map = mapGen.getMapGrid();
    
    for(x=0;x<map.cellGrid.length;x++){
        for(y=0;y<map.cellGrid[0].length;y++){
            map.cellGrid[x][y].selected=false;
            map.cellGrid[x][y].color="#552700";
        }
    }
}