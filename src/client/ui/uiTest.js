/* 
 * 
 */


var controller;

function test(){
    var m=new tddjs.server.controller.mapGenerator()
    m.setGridSize(75,75);
    m.setMaximumCountrySize(200);
    m.setMinimumCountrySize(75);
     canvas = document.getElementById('game');
    if (canvas && canvas.getContext) {
       ctx = canvas.getContext("2d");
       if (ctx) {
           controller = new tddjs.client.ui.gameUiController(null,ctx);
           controller._getMap(m.generateMap());
           controller.drawGame();
       }
   }
}