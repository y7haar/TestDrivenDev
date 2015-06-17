/* 
 * 
 */


var controller;

function test(){
    var m=new tddjs.server.controller.mapGenerator()
    m.setGridSize(120,120);
    m.setMaximumCountrySize(200);
    m.setMinimumCountrySize(75);
     canvas = document.getElementById('game');
    if (canvas && canvas.getContext) {
       ctx = canvas.getContext("2d");
       if (ctx) {
           controller = new tddjs.client.ui.gameUiController(null,ctx);
           controller._getMap(m.generateMap());
           controller._initMap();
           
           canvas.addEventListener('mousemove', onCanvasMouseMove, false);
           window.requestAnimationFrame(mainloop);
       }
   }
}

function mainloop(){
    controller.drawGame();
}

function onCanvasMouseMove(oEvent){
    mainloop();
    //console.log(oEvent.offsetX);
    ctx.strokeStyle="#000";
    ctx.fillStyle = "#552700";
    ctx.lineWidth="1";
    ctx.fillRect(oEvent.offsetX,oEvent.offsetY,50,50);
}
