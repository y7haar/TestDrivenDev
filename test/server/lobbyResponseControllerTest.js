/* 
 *  Testcases for LobbyResponseController
 *  
 *  This class handles data exchange with the client
 *  
 */

TestCase("LobbyResponseControllerTest", {
    setUp: function() {
        this.lobbyResponseController = new tddjs.server.controller.lobbyResponseController();

    },
    tearDown: function()
    {
    },
    
    "test lobbyResponseController should not be undefined after constructor call": function() {
        assertObject(this.lobbyResponseController);
    },
    
    "test lobbyResponseController should have function to respond to a new lobby request": function() {
        assertFunction(this.lobbyResponseController.respondNewLobby);
    },
    
    "test respondNewLobby should have parameter of type string, else throw Error": function() {
        var controller = this.lobbyResponseController;

        assertException(function() {
            controller.respondNewLobby(3);
        }, "TypeError");
    },
    
    "test respondNewLobby should throw Error if given data is not valid": function() {
        var controller = this.lobbyResponseController;

        var req = "";
        assertException(function() {
            controller.respondNewLobby(req);
        }, "Error");

        req = "{}";
        assertException(function() {
            controller.respondNewLobby(req);
        }, "Error");

        var obj = {type: "create"};
        req = JSON.stringify(obj);
        assertException(function() {
            controller.respondNewLobby(req);
        }, "Error");

        var obj = {type: "create", player: 6};
        req = JSON.stringify(obj);
        assertException(function() {
            controller.respondNewLobby(req);
        }, "Error");

        var obj = {type: "create", player: {}};
        req = JSON.stringify(obj);
        assertException(function() {
            controller.respondNewLobby(req);
        }, "Error");

        var obj = {type: "create", player: {name: 4}};
        req = JSON.stringify(obj);
        assertException(function() {
            controller.respondNewLobby(req);
        }, "Error");

        var obj = {type: "create", player: {name: "Peter"}};
        req = JSON.stringify(obj);
        assertException(function() {
            controller.respondNewLobby(req);
        }, "Error");

        var obj = {type: "create", player: {name: "Peter", color: 3}};
        req = JSON.stringify(obj);
        assertException(function() {
            controller.respondNewLobby(req);
        }, "Error");

        var obj = {type: "create", player: {name: "Peter", color: "#ffffff"}};
        req = JSON.stringify(obj);
        assertNoException(function() {
            controller.respondNewLobby(req);
        });
    }
});

TestCase("LobbyResponseControllerCallTest", {
    setUp: function() {
        this.lobbyController = tddjs.server.controller.lobbyController.getInstance();
        
        // Needed because of Singleton
        this.lobbyController.getLobbies().length = 0;
        
        this.lobbyResponseController = new tddjs.server.controller.lobbyResponseController();
        
        // Must be client player
        this.player = new tddjs.client.player();
        this.player.setName("Unnamed Player");
        this.player.setColor("#ffffff");
        
        this.data = {
            type: "create",
            lobby: null,
            player: this.player.serializeAsObject()
        };
        
        this.request = JSON.stringify(this.data);
    },
    tearDown: function()
    {
        // Hack for removing all lobbies
        this.lobbyController.getLobbies().length = 0;
        delete this.lobbyController;
    },
    
    "test respondNewLobby should create a new Lobby with player on Success": function() {
        var currentCount = this.lobbyController.getLobbyCount();  
        this.lobbyResponseController.respondNewLobby(this.request);
        
        assertEquals(currentCount + 1, this.lobbyController.getLobbyCount());
        var id = this.lobbyController.getNextId() - 1;
        var lobby = this.lobbyController.getLobbyById(id);
        
        assertEquals("Unnamed Player", lobby.getPlayers()[0].getName());
        assertEquals("#ffffff", lobby.getPlayers()[0].getColor());
    }
});
