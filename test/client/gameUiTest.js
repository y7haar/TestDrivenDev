/* 
 *  Test cases for the Game UI
 */

function gameUiSetup()
{
    /*:DOC += <canvas id="game" width="700" height="500"></canvas> */
    
    this.canvas = document.getElementById('game');
    assertObject(this.canvas);
    this.ctx = this.canvas.getContext("2d");
    assertObject(this.ctx);
    
    this.gameUi = new tddjs.client.ui.gameUiController(null);
    this.button = new tddjs.client.ui.button(170,65,"button",this.ctx);
    this.buttonW = this.ctx.measureText("button").width;
    this.buttonH = this.ctx.measureText("button").height;
}

function gameUiTeardown()
{   
    delete this.gameUi;
    delete this.canvas;
    delete this.ctx;
    delete this.button;
}

TestCase("GameUiTest", {
    setUp: gameUiSetup,
    tearDown: gameUiTeardown,
    
    "test gameUi should not be undefined after constructor call": function () {  
        assertObject(this.gameUi);
    },
    
    "test Object of gameUiController should have the needed functions": function (){
        assertFunction(this.gameUi.init);
        assertFunction(this.gameUi.addButton);
        assertFunction(this.gameUi.getButtons);
        
        assertFunction(this.gameUi._initMap);
    },
    
    "test if gameUiController can store Buttons": function (){
        this.gameUi.addButton(this.button);
        var btn = this.gameUi.getButtons();
        
        assertException(this.gameUi.addButton(null),"TypeError");
        assertException(this.gameUi.addButton(),"Error");
        assertTrue(btn.length === 1);
    },
    
    "test if _initMap can store Countrys":function(){
        var mapGen = new tddjs.server.controller.mapGenerator();
        mapGen.setGridSize(10,10);
        mapGen.generateMap();
        var map = mapGen.getMapGrid();
        
        
        assertTrue(this.gameUi._getCountrys().length === 0);
        this.gameUi._initMap(map);
        assertTrue(this.gameUi._getCountrys().length !== 0);
    },
    
    "test gameUi button: coord should be on the Button": function () {        
        assert(this.button.isCoordOnButton(170,65));
        assert(this.button.isCoordOnButton(this.buttonW+170,65));
        assert(this.button.isCoordOnButton(170,this.buttonH+65));
        assert(this.button.isCoordOnButton(this.buttonW+170,this.buttonH+65));
    }
});