/* 
 *  Test cases for Lobby Requests
 */

TestCase("LobbyRequestControllerTest", {
    setUp: function () {
        this.lobbyRequestController = new tddjs.client.controller.lobbyRequestController();
        
        this.ajax = tddjs.util.ajax;
        this.sandbox = sinon.sandbox.create();
        this.sandbox.useFakeXMLHttpRequest();
        
    }, 
    tearDown: function ()
    {
        delete this.lobbyRequestController;
        this.sandbox.restore();
    },
    
    "test lobbyRequestController should not be undefined after constructor call": function () {  
        assertObject(this.lobbyRequestController);
    },
    
    "test lobbyRequestController should have a method to request all lobbies": function () {  
        assertFunction(this.lobbyRequestController.requestAllLobbies);
    },
    
     "test requestAllLobbies should perform a GET request to /lobbies": function () {         
         assertEquals(1, this.sandbox.server.requests.length);
         assertEquals("GET", this.sandbox.server.requests[0].method);
         assertEquals("/lobbies", this.sandbox.server.requests[0].url);
       
    }
});
