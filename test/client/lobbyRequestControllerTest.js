/* 
 *  Test cases for Lobby Requests
 */

TestCase("LobbyRequestControllerTest", {
    setUp: function () {
        this.lobbyRequestController = new tddjs.client.controller.lobbyRequestController();
        
        this.ajax = tddjs.util.ajax;
        this.sandbox = sinon.sandbox.create();
        this.sandbox.useFakeXMLHttpRequest();
        this.sandbox.useFakeServer();
        
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
         this.lobbyRequestController.requestAllLobbies();
         
         assertEquals(1, this.sandbox.server.requests.length);
         assertEquals("GET", this.sandbox.server.requests[0].method);
         assertEquals("/lobbies", this.sandbox.server.requests[0].url);
    },
    
     "test requestAllLobbies should perform a GET request with correct Accept header": function () {         
         this.lobbyRequestController.requestAllLobbies();
         
         assertEquals("application/json", this.sandbox.server.requests[0].requestHeaders["Accept"]);
    },
    
    "test requestAllLobbies should call onAllLobbiesSuccess on success": function () {         
        var callback = this.sandbox.stub(this.lobbyRequestController, "onAllLobbiesSuccess");
        sinon.assert.notCalled(callback);
        
        this.lobbyRequestController.requestAllLobbies();
        
        this.sandbox.server.requests[0].respond(200, "", "");
        sinon.assert.calledOnce(callback); 
    },
    
    "test requestAllLobbies should call onAllLobbiesFailure on failure": function () {         
        var callback = this.sandbox.stub(this.lobbyRequestController, "onAllLobbiesFailure");
        sinon.assert.notCalled(callback);
        
        this.lobbyRequestController.requestAllLobbies();
        this.sandbox.server.requests[0].respond(400, "", "");
        sinon.assert.calledOnce(callback); 
    },
    
    "test constroller should have function to request a new lobby": function () {         
        assertFunction(this.lobbyRequestController.requestNewLobby);
    },
    
    "test requestNewLobby should perform POST request to /lobbies": function () {         
        this.lobbyRequestController.requestNewLobby();
         
        assertEquals(1, this.sandbox.server.requests.length);
        assertEquals("POST", this.sandbox.server.requests[0].method);
        assertEquals("/lobbies", this.sandbox.server.requests[0].url);
        
        console.log(this.sandbox);
    },
    
     "test requestNewLobby should perform POST request with correct data": function () {         
        this.lobbyRequestController.requestNewLobby();
        
        var jsonObj = {
            type: "create",
            lobby: null
        };
        
        var json = JSON.stringify(jsonObj);
        console.log(json);
        
        assertEquals(json, this.sandbox.server.requests[0].requestBody);
    },
    
    "test requestNewLobby should perform a POST request with correct Content-Type header": function () {         
         this.lobbyRequestController.requestNewLobby();
         
         assertEquals("application/json", this.sandbox.server.requests[0].requestHeaders["Content-Type"]);
    },
});
