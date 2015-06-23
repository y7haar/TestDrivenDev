/* 
 * 
 */


function startGame(){
    var controller;
    var m;
    var m2;

    m=new tddjs.server.controller.mapGenerator();
    m.setGridSize(150,150);
    m.setMaximumCountrySize(300);
    m.setMinimumCountrySize(200);
    m.setMinimumContinentNumber(6);
    m.setMaximumContinentNumber(10);
    m.setMinimumContinentSize(4);
    m.setMinimumWaterNumber(6);
    m.setMinimumWaterNumber(4);
    canvas = document.getElementById('game');
    if (canvas && canvas.getContext) {
       ctx = canvas.getContext("2d");
       if (ctx) {
            controller = new tddjs.client.ui.gameUiController(null,ctx);
            
            m2 = m.generateMap();
            // nur zur hilfe  mfg Alex
            console.log("MAP: \n"+m2);
            m2 = m.serializeAsJSON(m2);
            //controller._getMap(m2);
            //controller._initMap();
            controller.addButton( new tddjs.client.ui.button(30,canvas.height-60,"TEST",ctx));
            //window.requestAnimationFrame(controller.drawLoading);
            controller.init(m2);
       }
   }
}
// gernateMap ist schon in globals definiert 
// entwerder testfile nicht global machen oder andern namen verwenden
/*
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
    window.requestAnimationFrame(controller.drawLoading);
}
*/
