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
    
    this.gameUi = new tddjs.client.ui.gameUiController(null,this.ctx);
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

TestCase("GameUiControllerTests", {
    setUp: gameUiSetup,
    tearDown: gameUiTeardown,
    
    "test gameUi should not be undefined after constructor call": function () {  
        assertObject(this.gameUi);
    },
    
    "test Object of gameUiController should have the needed functions": function (){
        assertFunction(this.gameUi.init);
        assertFunction(this.gameUi.drawGame);
        assertFunction(this.gameUi.addButton);
        assertFunction(this.gameUi.getButtons);
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
        mapGen.setGridSize(50,50);
        var m = mapGen.generateMap();
        var map = m.serializeAsJSON(m);;
        
        assertException(this.gameUi._getCountries(),"Error");
        this.gameUi._initMap(map);
        assertTrue(this.gameUi._getCountries().length !== 0);
    },
    
    "test gameUi button: coord should be on the Button": function () {        
        assert(this.button.isCoordOnButton(170,65));
        assert(this.button.isCoordOnButton(this.buttonW+170,65));
        assert(this.button.isCoordOnButton(170,this.buttonH+65));
        assert(this.button.isCoordOnButton(this.buttonW+170,this.buttonH+65));
    },
    
    "test if _deserialze generates a valid map":function(){
        var mapGen = new tddjs.server.controller.mapGenerator();
        mapGen.setGridSize(50,50);
        var m = mapGen.generateMap();
        m = m.serializeAsJSON(m);
        var map = this.gameUi._deserialize(m);
        
        var continent;
        var country;
        for(var i in map.getContinents()){
            continent=map.getContinents()[i];
            break;
        }
        for(var i in continent.getCountrys()){
            country=continent.getCountrys()[i];
            break;
        }
        
        assertInstanceOf("map should be instance of map",tddjs.client.ui.map,map);
        assertInstanceOf(tddjs.client.ui.continent,continent);
        assertInstanceOf(tddjs.client.ui.country,country);
    },
    
    "test getMap behavior":function(){
        var mapGen = new tddjs.server.controller.mapGenerator();
        mapGen.setGridSize(50,50);
        var m = mapGen.generateMap();
        m = m.serializeAsJSON(m);
        
        assertException(this.gameUi.getMap(),"Error");
        var map = this.gameUi.getMap(m);
        assertTypeOf(map, tddjs.client.map.map);
    },
    
    "test if getRgbaColor return a valid color":function(){
        var color = this.gameUi.getRgbaColor("#C88C00",0.5);
        
        assertEquals(color,"rgba(200,140,0,0.5)");
    }
});