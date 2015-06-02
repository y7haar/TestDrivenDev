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
        
        this.lobbyController = new tddjs.server.controller.lobbyController();
        
       this.lobby1 = new tddjs.server.model.lobby();
       this.lobby2 = new tddjs.server.model.lobby();
      
      this.player1 = new tddjs.client.player();
      this.player2 = new tddjs.client.player();
      this.player3 = new tddjs.client.player();
      this.player4 = new tddjs.client.player();
      
      this.player1.setId(1);
      this.player2.setId(2);
      this.player3.setId(3);
      this.player4.setId(4);
      
      this.player1.setName("P1");
      this.player2.setName("P2");
      this.player3.setName("P3");
      this.player4.setName("P4");
      
      this.player1.setColor("#000000");
      this.player2.setColor("#111111");
      this.player3.setColor("#222222");
      this.player4.setColor("#333333");
      
      this.lobby1.setId(0);
      this.lobby2.setId(1);
      
      this.lobby1.setName("L1");
      this.lobby2.setName("L2");
      
      this.lobby1.addPlayer(this.player1);
      this.lobby1.addPlayer(this.player2);
      this.lobby2.addPlayer(this.player3);
      this.lobby2.addPlayer(this.player4);
      
      this.lobby1.setLeader(this.player1);
      this.lobby2.setLeader(this.player4);
      
      this.lobby1.setMaxPlayers(2);
      this.lobby2.setMaxPlayers(3);
      
      this.lobbyController.addLobby(this.lobby1);
      this.lobbyController.addLobby(this.lobby2);
        
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
         assertEquals(BASE_URL + "lobbies", this.sandbox.server.requests[0].url);
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
    
     "test requestAllLobbies should update Ui in DOM on success and display lobbies": function () {         
         /*:DOC += <div class = "content" id = "content"><div class = "lobbyWrapper" id = "lobbyWrapper"></div></div> */
        this.lobbyRequestController.requestAllLobbies();

        this.wrapper = document.getElementById("lobbyWrapper");

        assertEquals(0, this.wrapper.childNodes.length);
        assertEquals("", this.wrapper.innerHTML);
        
        this.sandbox.server.requests[0].respond(200, "", this.lobbyController.serialize());
        
        var lobbies = this.wrapper.childNodes;
        assertEquals(2, lobbies.length);
        
        assertTagName("div", lobbies[0]);
        assertTagName("div", lobbies[1]);
        
        
        var lobbyTable1 = lobbies[0].getElementsByTagName("table")[0];
        var lobbyTable2 = lobbies[1].getElementsByTagName("table")[0];
        
        assertTagName("table", lobbyTable1);
        assertTagName("table", lobbyTable2);
        
        assertTagName("tr", lobbyTable1.getElementsByTagName("tr")[0]);
        assertTagName("tr", lobbyTable2.getElementsByTagName("tr")[0]);
        
        var lobbyTrContent1 = lobbyTable1.getElementsByTagName("tr")[0].childNodes;
        var lobbyTrContent2 = lobbyTable2.getElementsByTagName("tr")[0].childNodes;
        
        assertTagName("td", lobbyTrContent1[0]);
        assertTagName("td", lobbyTrContent1[1]);
        assertTagName("td", lobbyTrContent1[2]);
        
        assertTagName("td", lobbyTrContent2[0]);
        assertTagName("td", lobbyTrContent2[1]);
        assertTagName("td", lobbyTrContent2[2]);
        
        
        assertEquals("#0", lobbyTrContent1[0].innerHTML);
        assertEquals("L1", lobbyTrContent1[1].innerHTML);
        assertEquals("2 / 2", lobbyTrContent1[2].innerHTML);
        
        assertEquals("#1", lobbyTrContent2[0].innerHTML);
        assertEquals("L2", lobbyTrContent2[1].innerHTML);
        assertEquals("2 / 3", lobbyTrContent2[2].innerHTML);
    },
    
     "test requestAllLobbies should show an Error message in gui onFailure": function () {         
         /*:DOC += <div class = "content" id = "content"><div class = "lobbyWrapper" id = "lobbyWrapper"></div></div> */
        this.wrapper = document.getElementById("lobbyWrapper");
         
         this.lobbyRequestController.requestAllLobbies();
        
        assertEquals(0, this.wrapper.childNodes.length);
         
         this.sandbox.server.requests[0].respond(500, "", "");
        
        
        assertEquals(1, this.wrapper.childNodes.length);
        assertTagName("p", this.wrapper.childNodes[0]);
        
        assertEquals("Error: Could not get data", this.wrapper.childNodes[0] .innerHTML);
    },
    
    
    "test constroller should have function to request a new lobby": function () {         
        assertFunction(this.lobbyRequestController.requestNewLobby);
    },
    
    "test requestNewLobby should perform POST request to /lobbies": function () {         
        this.lobbyRequestController.requestNewLobby();
         
        assertEquals(1, this.sandbox.server.requests.length);
        assertEquals("POST", this.sandbox.server.requests[0].method);
        assertEquals(BASE_URL + "lobbies", this.sandbox.server.requests[0].url);
    },
    
     "test requestNewLobby should perform POST request with correct data": function () {         
        this.lobbyRequestController.requestNewLobby();
        
        var jsonObj = {
            type: "create",
            lobby: null
        };
        
        var json = JSON.stringify(jsonObj);
        
        assertEquals(json, this.sandbox.server.requests[0].requestBody);
    },
    
    "test requestNewLobby should perform a POST request with correct Content-Type header": function () {         
         this.lobbyRequestController.requestNewLobby();
         
         assertEquals("application/json;charset=utf-8", this.sandbox.server.requests[0].requestHeaders["Content-Type"]);
    },
    
    
    
     "test controller should have function to join an existing lobby": function () {         
        assertFunction(this.lobbyRequestController.requestJoin);
    },
    
    "test requestJoin should have a parameter of type number, otherwise throw TypeError": function () {         
        var controller = this.lobbyRequestController;
        
        assertNoException(function(){ controller.requestJoin(2); });
        assertException(function(){ controller.requestJoin("lobby"); }, "TypeError");
    },
    
     "test requestJoin should perform a POST request to /lobbies/id": function () {         
         this.lobbyRequestController.requestJoin(2);
         
        assertEquals(1, this.sandbox.server.requests.length);
        assertEquals("POST", this.sandbox.server.requests[0].method);
        assertEquals(BASE_URL + "lobbies/2", this.sandbox.server.requests[0].url);
        
         this.lobbyRequestController.requestJoin(42);
         
        assertEquals(2, this.sandbox.server.requests.length);
        assertEquals("POST", this.sandbox.server.requests[1].method);
        assertEquals(BASE_URL + "lobbies/42", this.sandbox.server.requests[1].url);
         
    },
    
    "test requestJoin should have correct Content-Type header": function () {         
         this.lobbyRequestController.requestJoin(2);
         
         assertEquals("application/json;charset=utf-8", this.sandbox.server.requests[0].requestHeaders["Content-Type"]);
    }
});
