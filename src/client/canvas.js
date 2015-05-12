/* 
 * Source-Code for Canvas
 */

var canvas;
var ctx;




var mainloop = function() {
        updateGame();
        drawGame();
        window.requestAnimationFrame(mainloop);
    };

function updateGame(){
    
}
function drawGame(){
    clear();
    drawMap();
    drawUI();
}

function drawMap(){
    ctx.fillStyle = "#0f0";
    ctx.fillRect(ctx.canvas.width/2-50,ctx.canvas.height/2-50,100,100);
}

function drawUI(){
    ctx.fillStyle = "#f00";
    ctx.fillRect(0,ctx.canvas.height-15,ctx.canvas.width,15);
}

function clear(){
    ctx.fillStyle = "#ebebeb";
    ctx.fillRect(0,0,ctx.canvas.width, ctx.canvas.height);
}


function init(){
    canvas = document.getElementById('game');
    if (canvas && canvas.getContext) {
       ctx = canvas.getContext("2d");
       if (ctx) {
            clear();
            window.requestAnimationFrame(mainloop);
        }
    }
}