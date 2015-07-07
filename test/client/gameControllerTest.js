/* 
 * Testcases for GameController
 */


TestCase("GameControllerTests", {
     setUp: function () {                 
        this.sandbox = sinon.sandbox.create();
        this.sandbox.useFakeServer();
        this.gameCon = tddjs.client.controller.gameController();
        
        this.realLoc = window.location;
         window.location = {
            href : BASE_URL
        };
    },
    tearDown: function(){     
        this.sandbox.restore();
        window.location = this.realLoc;
    },
    "test if initGameStates get called afert init": function () {
        var spy = this.sandbox.spy(this.gameCon,"initGameStates");
        
        this.gameCon.init();
        
        sinon.assert.calledOnce(spy);
    },
    "test if init requests a map": function() {
        this.gameCon.init();

        assertEquals(1, this.sandbox.server.requests.length);
        assertEquals("GET", this.sandbox.server.requests[0].method);
        assertEquals(BASE_URL + "map", this.sandbox.server.requests[0].url);
    },
    "test if gameUiController and GameLoopController get createt after init":function(){
        this.gameCon.init();
        
        assertInstanceOf(this.gameCon.getGameUiController,tddjs.client.ui.gameUiController);
        assertInstanceOf(this.gameCon.getGameLoopController,tddjs.client.controller.gameLoopController);
    }
});