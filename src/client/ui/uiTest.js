/* 
 * 
 */


var controller;
var m;
var m2;

function test(){
    m=new tddjs.server.controller.mapGenerator();
    m.setGridSize(120,120);
    m.setMaximumCountrySize(200);
    m.setMinimumCountrySize(75);
    canvas = document.getElementById('game');
    if (canvas && canvas.getContext) {
       ctx = canvas.getContext("2d");
       if (ctx) {
           controller = new tddjs.client.ui.gameUiController(null,ctx);
           
           
           window.requestAnimationFrame(generateMapTOCHANGE);
       }
   }
}
// gernateMap ist schon in globals definiert 
// entwerder testfile nicht global machen oder andern namen verwenden
function generateMapTOCHANGE(){
    ctx.strokeStyle="#000";
    ctx.fillStyle = "#552700";
    ctx.lineWidth="1";
    ctx.font = "30px Arial";
    ctx.fillText("generating map...",10,50);
    
    m2 = m.generateMap();
    m2= m.serializeAsJSON(m2);
    window.requestAnimationFrame(renderMap);
}
function renderMap(){
    ctx.strokeStyle="#000";
    ctx.fillStyle = "#552700";
    ctx.lineWidth="1";
    ctx.font = "30px Arial";
    ctx.fillText("render map...",10,80);
    ctx.fillText("...this can take a while!",80,110);
    
    controller._getMap(m2);
    controller._initMap();
    window.requestAnimationFrame(mainloop);
}

function mainloop(){
    controller.drawGame();
    canvas.addEventListener('mousemove', onCanvasMouseMove, false);
    canvas.addEventListener('mousedown', onCanvasMouseDown, false);
}

function onCanvasMouseMove(oEvent){
    //mainloop();
    //console.log(oEvent.offsetX);
    controller.mouseMove(oEvent);
    /*
    ctx.strokeStyle="#000";
    ctx.fillStyle = "#fbfbfb";
    ctx.lineWidth="1";
    ctx.fillText("UI-Test",oEvent.offsetX+1,oEvent.offsetY+1);
    */
    //ctx.fillRect(oEvent.offsetX,oEvent.offsetY,50,50);
}

function onCanvasMouseDown(oEvent){
    controller.mouseDown(oEvent);
}
