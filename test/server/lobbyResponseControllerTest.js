/* 
 *  Testcases for LobbyResponseController
 *  
 *  This class handles data exchange with the client
 *  
 */

TestCase("LobbyResponseControllerTest", {
    setUp: function () {
        this.lobbyResponseController = new tddjs.server.controller.lobbyResponseController();
        
    }, 
    tearDown: function ()
    {
    },
    
    "test lobbyResponseController should not be undefined after constructor call": function () {  
        assertObject(this.lobbyResponseController);
    }
});


