/* 
 * Source-Code for Canvas
 */

var canvas;
var ctx;
var val=0.0;



var mainloop = function() {
        updateGame();
        drawGame();
    };

function updateGame(){
    
}
function drawGame(){
    clear();
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