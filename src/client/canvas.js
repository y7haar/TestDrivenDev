/* 
 * Source-Code for Canvas
 */

var canvas;

function init(){
    canvas = document.getElementById('game');
    if (canvas && canvas.getContext) {
       var ctx = canvas.getContext("2d");
       if (ctx) {
          ctx.fillStyle = "#ebebeb";
          ctx.fillRect(0,0,ctx.canvas.width, ctx.canvas.height);
        }
    }
}