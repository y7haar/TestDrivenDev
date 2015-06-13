/* 
 *  Test cases for Lobby Requests
 */

function lobbyRequestSetup()
{
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
      
      this.player = new tddjs.client.player();
      this.player.setName("Peter");
      this.player.setColor("#ffffff");
}

function lobbyRequestTeardown()
{
    delete this.lobbyRequestController;
    this.sandbox.restore();
}

TestCase("LobbyRequestControllerTest", {
    setUp: lobbyRequestSetup,
    
    tearDown: lobbyRequestTeardown,
    
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
    
    "test requestNewLobby must have paramter of type client.player": function () {      
        var controller = this.lobbyRequestController;
        assertException(function() { controller.requestNewLobby(5); }, "TypeError");
    },
    
    "test requestNewLobby should perform POST request to /lobbies": function () {         
        this.lobbyRequestController.requestNewLobby(this.player);
         
        assertEquals(1, this.sandbox.server.requests.length);
        assertEquals("POST", this.sandbox.server.requests[0].method);
        assertEquals(BASE_URL + "lobbies", this.sandbox.server.requests[0].url);
    },
    
     "test requestNewLobby should perform POST request with correct data": function () {         
        this.lobbyRequestController.requestNewLobby(this.player);
        
        var jsonObj = {
            type: "create",
            lobby: null,
            player: {
                name: "Peter",
                color: "#ffffff",
                type: "human"
            }
        };
        
        var json = JSON.stringify(jsonObj);
        
        assertEquals(json, this.sandbox.server.requests[0].requestBody);
    },
    
    "test requestNewLobby should perform a POST request with correct Content-Type header": function () {         
         this.lobbyRequestController.requestNewLobby(this.player);
         
         assertEquals("application/json;charset=utf-8", this.sandbox.server.requests[0].requestHeaders["Content-Type"]);
    },
    
    
    
     "test controller should have function to join an existing lobby": function () {         
        assertFunction(this.lobbyRequestController.requestJoin);
    },
    
     "test controller should have callbacks for requestJoin": function () {         
        assertFunction(this.lobbyRequestController.onJoinSuccess);
        assertFunction(this.lobbyRequestController.onJoinFailure);
    },
    
    "test requestJoin should have a parameter of type number, otherwise throw TypeError": function () {         
        var controller = this.lobbyRequestController;
        var player = this.player;
        
        assertNoException(function(){ controller.requestJoin(2, player); });
        assertException(function(){ controller.requestJoin("lobby", player); }, "TypeError");
    },
    
    "test requestJoin should have a parameter of type tddjs.client.player, otherwise throw TypeError": function () {         
        var controller = this.lobbyRequestController;
        var player = this.player;
        
        assertNoException(function(){ controller.requestJoin(2, player); });
        assertException(function(){ controller.requestJoin(2, 5); }, "TypeError");
    },
    
     "test requestJoin should perform a POST request to /lobbies/id": function () {         
         this.lobbyRequestController.requestJoin(2, this.player);
         
        assertEquals(1, this.sandbox.server.requests.length);
        assertEquals("POST", this.sandbox.server.requests[0].method);
        assertEquals(BASE_URL + "lobbies/2", this.sandbox.server.requests[0].url);
        
         this.lobbyRequestController.requestJoin(42, this.player);
         
        assertEquals(2, this.sandbox.server.requests.length);
        assertEquals("POST", this.sandbox.server.requests[1].method);
        assertEquals(BASE_URL + "lobbies/42", this.sandbox.server.requests[1].url);
         
    },
    
    "test requestJoin should have correct Content-Type header": function () {         
         this.lobbyRequestController.requestJoin(2, this.player);
         
         assertEquals("application/json;charset=utf-8", this.sandbox.server.requests[0].requestHeaders["Content-Type"]);
    },
    
    "test requestJoin should perform POST request with correct data": function () {         
        this.lobbyRequestController.requestJoin(42, this.player);
        
        var jsonObj = {
            type: "join",
            player: {
                name: "Peter",
                color: "#ffffff",
                type: "human"
            }
        };
        
        var json = JSON.stringify(jsonObj);
        
        assertEquals(json, this.sandbox.server.requests[0].requestBody);
    },
    
     "test requestJoin should call onJoinSuccess on success": function () {         
        var callback = this.sandbox.stub(this.lobbyRequestController, "onJoinSuccess");
        sinon.assert.notCalled(callback);
        
        this.lobbyRequestController.requestJoin(1, this.player);
        
        this.sandbox.server.requests[0].respond(200, "", "");
        sinon.assert.calledOnce(callback); 
    },
    
    "test requestJoin should call onJoinFailure on failure": function () {         
        var callback = this.sandbox.stub(this.lobbyRequestController, "onJoinFailure");
        sinon.assert.notCalled(callback);
        
        this.lobbyRequestController.requestJoin(1, this.player);
        
        this.sandbox.server.requests[0].respond(400, "", "");
        sinon.assert.calledOnce(callback); 
    }
});

TestCase("LobbyRequestControllerUpdateTest", {
    setUp: lobbyRequestSetup,
    
    tearDown: lobbyRequestTeardown,
    
    // Lobby Name
    
    "test controller should have function to update lobby name": function () {         
        assertFunction(this.lobbyRequestController.updateLobbyName);
    },
    
    "test updateLobbyName should throw Exception if parameter is no number": function () {         
        var controller = this.lobbyRequestController;
        
        assertException(function() { controller.updateLobbyName("asd", "My Lobby"); }, "TypeError");
        assertNoException(function() { controller.updateLobbyName(1, "My Lobby"); });
    },
    
    "test updateLobbyName should throw Exception if parameter is no string": function () {         
        var controller = this.lobbyRequestController;
        
        assertException(function() { controller.updateLobbyName(1, 12); }, "TypeError");
        assertNoException(function() { controller.updateLobbyName(1, "My Lobby"); });
    },
    
     "test updateLobbyName should perform POST request with correct data": function () {         
        this.lobbyRequestController.updateLobbyName(1, "NewName");
        
        var jsonObj = {
            type: "lobbyUpdate",
            data: {
                name: "NewName"
            }
        };
        
        var json = JSON.stringify(jsonObj);
        
        assertEquals("POST", this.sandbox.server.requests[0].method);
        assertEquals(BASE_URL + "lobbies/1", this.sandbox.server.requests[0].url);
        assertEquals(json, this.sandbox.server.requests[0].requestBody);
    },
    
    "test updateLobbyName should perform a POST request with correct Content-Type header": function () {         
         this.lobbyRequestController.updateLobbyName(1, "Name");
         
         assertEquals("application/json;charset=utf-8", this.sandbox.server.requests[0].requestHeaders["Content-Type"]);
    },
    
    
    // Max Players
    
    "test controller should have function to update max players": function () {         
        assertFunction(this.lobbyRequestController.updateMaxPlayers);
    },
    
    "test updateMaxPlayers should throw Exception if id is no number": function () {         
        var controller = this.lobbyRequestController;
        
        assertException(function() { controller.updateMaxPlayers("eins", 3); }, "TypeError");
        assertNoException(function() { controller.updateMaxPlayers(1, 3); });
    },
    
    "test updateMaxPlayers should throw Exception if parameter is no number": function () {         
        var controller = this.lobbyRequestController;
        
        assertException(function() { controller.updateMaxPlayers(1, "drei"); }, "TypeError");
        assertNoException(function() { controller.updateMaxPlayers(1, 3); });
    },
    
     "test updateMaxPlayers should perform POST request with correct data": function () {         
        this.lobbyRequestController.updateMaxPlayers(1, 3);
        
        var jsonObj = {
            type: "lobbyUpdate",
            data: {
                maxPlayers: 3
            }
        };
        
        var json = JSON.stringify(jsonObj);
        
        assertEquals("POST", this.sandbox.server.requests[0].method);
        assertEquals(BASE_URL + "lobbies/1", this.sandbox.server.requests[0].url);
        assertEquals(json, this.sandbox.server.requests[0].requestBody);
    },
    
    "test updateMaxPlayers should perform a POST request with correct Content-Type header": function () {         
         this.lobbyRequestController.updateMaxPlayers(1, 3);
         
         assertEquals("application/json;charset=utf-8", this.sandbox.server.requests[0].requestHeaders["Content-Type"]);
    },
    
    
    // Player Name
    
    "test controller should have function to update player name": function () {         
        assertFunction(this.lobbyRequestController.updatePlayerName);
    },
    
    "test updatePlayerName should throw Exception if lobbyId is no number": function () {         
        var controller = this.lobbyRequestController;
        
        assertException(function() { controller.updatePlayerName("eins", "eins", "name"); }, "TypeError");
        assertNoException(function() { controller.updatePlayerName(1, 3, "name"); });
    },
    
    "test updatePlayerName should throw Exception if id is no number": function () {         
        var controller = this.lobbyRequestController;
        
        assertException(function() { controller.updatePlayerName(1, "eins", "name"); }, "TypeError");
        assertNoException(function() { controller.updatePlayerName(1, 3, "name"); });
    },
    
     "test updatePlayerName should throw Exception if name is no string": function () {         
        var controller = this.lobbyRequestController;
        
        assertException(function() { controller.updatePlayerName(1, 3, 42); }, "TypeError");
        assertNoException(function() { controller.updatePlayerName(1, 3, "name"); });
    },
    
    "test updatePlayerName should perform POST request with correct data": function () {         
        this.lobbyRequestController.updatePlayerName(1, 3, "NewName");
        
        var jsonObj = {
            type: "playerUpdate",
            data: {
                id: 3,
                name: "NewName"
            }
        };
        
        var json = JSON.stringify(jsonObj);
        
        assertEquals("POST", this.sandbox.server.requests[0].method);
        assertEquals(BASE_URL + "lobbies/1", this.sandbox.server.requests[0].url);
        assertEquals(json, this.sandbox.server.requests[0].requestBody);
    },
    
    "test updatePlayerName should perform a POST request with correct Content-Type header": function () {         
         this.lobbyRequestController.updatePlayerName(1, 3, "Name");
         
         assertEquals("application/json;charset=utf-8", this.sandbox.server.requests[0].requestHeaders["Content-Type"]);
    },
    
    
    // Player Color
    
    "test controller should have function to update player color": function () {         
        assertFunction(this.lobbyRequestController.updatePlayerColor);
    },
    
     "test updatePlayerColor should throw Exception if lobbyId is no number": function () {         
        var controller = this.lobbyRequestController;
        
        assertException(function() { controller.updatePlayerColor("number", 3, "#ffffff"); }, "TypeError");
        assertNoException(function() { controller.updatePlayerColor(1, 3, "ffffff"); });
    },
    
    "test updatePlayerColor should throw Exception if playerId is no number": function () {         
        var controller = this.lobbyRequestController;
        
        assertException(function() { controller.updatePlayerColor(1, "3", "#ffffff"); }, "TypeError");
        assertNoException(function() { controller.updatePlayerColor(1, 3, "ffffff"); });
    },
    
    "test updatePlayerColor should throw Exception if playerColor is no string": function () {         
        var controller = this.lobbyRequestController;
        
        assertException(function() { controller.updatePlayerColor(1, 3, 5); }, "TypeError");
        assertNoException(function() { controller.updatePlayerColor(1, 3, "ffffff"); });
    },
    
     "test updatePlayerColor should perform POST request with correct data": function () {         
        this.lobbyRequestController.updatePlayerColor(1, 3, "#000000");
        
        var jsonObj = {
            type: "playerUpdate",
            data: {
                id: 3,
                color: "#000000"
            }
        };
        
        var json = JSON.stringify(jsonObj);
        
        assertEquals("POST", this.sandbox.server.requests[0].method);
        assertEquals(BASE_URL + "lobbies/1", this.sandbox.server.requests[0].url);
        assertEquals(json, this.sandbox.server.requests[0].requestBody);
    },
    
    "test updatePlayerColor should perform a POST request with correct Content-Type header": function () {         
         this.lobbyRequestController.updatePlayerColor(1, 3, "#000000");
         
         assertEquals("application/json;charset=utf-8", this.sandbox.server.requests[0].requestHeaders["Content-Type"]);
    },
    
    
    // Add Bot
    "test controller should have function to add Bot": function () {         
        assertFunction(this.lobbyRequestController.addBot);
    },
    
    "test addBot should throw Exception if lobbyId is no number": function () {         
        var controller = this.lobbyRequestController;
        
        assertException(function() { controller.addBot("number"); }, "TypeError");
        assertNoException(function() { controller.addBot(1); });
    },
    
    "test addBot should perform POST request with correct data": function () {         
        this.lobbyRequestController.addBot(1);
        
        var jsonObj = {
            type: "botJoin"
        };
        
        var json = JSON.stringify(jsonObj);
        
        assertEquals("POST", this.sandbox.server.requests[0].method);
        assertEquals(BASE_URL + "lobbies/1", this.sandbox.server.requests[0].url);
        assertEquals(json, this.sandbox.server.requests[0].requestBody);
    },
    
    "test addBot should perform a POST request with correct Content-Type header": function () {         
         this.lobbyRequestController.addBot(1);
         assertEquals("application/json;charset=utf-8", this.sandbox.server.requests[0].requestHeaders["Content-Type"]);
    },
    
    
    // Kick Bot
    "test controller should have function to kick Bot": function () {         
        assertFunction(this.lobbyRequestController.kickBot);
    },
    
     "test kickBot should throw Exception if lobbyId is no number": function () {         
        var controller = this.lobbyRequestController;
        
        assertException(function() { controller.kickBot("number", 3); }, "TypeError");
        assertNoException(function() { controller.kickBot(1, 3); });
    },
    
     "test kickBot should throw Exception if playerId is no number": function () {         
        var controller = this.lobbyRequestController;
        
        assertException(function() { controller.kickBot(1, "3"); }, "TypeError");
        assertNoException(function() { controller.kickBot(1, 3); });
    },
    
    "test kickBot should perform POST request with correct data": function () {         
        this.lobbyRequestController.kickBot(1, 3);
        
        var jsonObj = {
            type: "playerKick",
            data: {
                id: 3
            }
        };
        
        var json = JSON.stringify(jsonObj);
        
        assertEquals("POST", this.sandbox.server.requests[0].method);
        assertEquals(BASE_URL + "lobbies/1", this.sandbox.server.requests[0].url);
        assertEquals(json, this.sandbox.server.requests[0].requestBody);
    },
    
    "test kickBot should perform a POST request with correct Content-Type header": function () {         
         this.lobbyRequestController.kickBot(1, 3);
         assertEquals("application/json;charset=utf-8", this.sandbox.server.requests[0].requestHeaders["Content-Type"]);
    },
    
    
    
    // kick Player
     "test controller should have function to kick Player": function () {         
        assertFunction(this.lobbyRequestController.kickPlayer);
    },
    
    "test kickPlayer should throw Exception if lobbyId is no number": function () {         
        var controller = this.lobbyRequestController;
        
        assertException(function() { controller.kickPlayer("number", 3); }, "TypeError");
        assertNoException(function() { controller.kickPlayer(1, 3); });
    },
    
     "test kickPlayer should throw Exception if playerId is no number": function () {         
        var controller = this.lobbyRequestController;
        
        assertException(function() { controller.kickPlayer(1, "3"); }, "TypeError");
        assertNoException(function() { controller.kickPlayer(1, 3); });
    },
    
    "test kickPlayer should perform POST request with correct data": function () {         
        this.lobbyRequestController.kickPlayer(1, 3);
        
        var jsonObj = {
            type: "playerKick",
            data: {
                id: 3
            }
        };
        
        var json = JSON.stringify(jsonObj);
        
        assertEquals("POST", this.sandbox.server.requests[0].method);
        assertEquals(BASE_URL + "lobbies/1", this.sandbox.server.requests[0].url);
        assertEquals(json, this.sandbox.server.requests[0].requestBody);
    },
    
     "test kickPlayer should perform a POST request with correct Content-Type header": function () {         
         this.lobbyRequestController.kickPlayer(1, 3);
         assertEquals("application/json;charset=utf-8", this.sandbox.server.requests[0].requestHeaders["Content-Type"]);
    },
    
    
    // Start game
     "test controller should have function to start game": function () {         
        assertFunction(this.lobbyRequestController.startGame);
    },
    
    "test startGame should throw Exception if lobbyId is no number": function () {         
        var controller = this.lobbyRequestController;
        
        assertException(function() { controller.startGame("number"); }, "TypeError");
        assertNoException(function() { controller.startGame(1); });
    },
    
    "test startGame should perform POST request with correct data": function () {         
        this.lobbyRequestController.startGame(1);
        
        var jsonObj = {
            type: "gameStart"
        };
        
        var json = JSON.stringify(jsonObj);
        
        assertEquals("POST", this.sandbox.server.requests[0].method);
        assertEquals(BASE_URL + "lobbies/1", this.sandbox.server.requests[0].url);
        assertEquals(json, this.sandbox.server.requests[0].requestBody);
    },
    
    "test startGame should perform a POST request with correct Content-Type header": function () {         
         this.lobbyRequestController.startGame(1);
         assertEquals("application/json;charset=utf-8", this.sandbox.server.requests[0].requestHeaders["Content-Type"]);
    }
    
});