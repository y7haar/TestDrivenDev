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
    
    "test respondNewLobby should have parameter of type object, else throw Error": function() {
        var controller = this.lobbyResponseController;

        assertException(function() {
            controller.respondNewLobby(3);
        }, "TypeError");
    },
    
    "test respondNewLobby should throw Error if given data is not valid": function() {
        var controller = this.lobbyResponseController;

        var obj = {type: "create"};
        assertException(function() {
            controller.respondNewLobby(obj);
        }, "Error");

        var obj = {type: "create", player: 6};
        assertException(function() {
            controller.respondNewLobby(obj);
        }, "Error");

        var obj = {type: "create", player: {}};
        assertException(function() {
            controller.respondNewLobby(obj);
        }, "Error");

        var obj = {type: "create", player: {name: 4}};
        assertException(function() {
            controller.respondNewLobby(obj);
        }, "Error");

        var obj = {type: "create", player: {name: "Peter"}};
        assertException(function() {
            controller.respondNewLobby(obj);
        }, "Error");

        var obj = {type: "create", player: {name: "Peter", color: 3}};
        assertException(function() {
            controller.respondNewLobby(obj);
        }, "Error");

        var obj = {type: "create", player: {name: "Peter", color: "#ffffff", type: "human"}};
        assertNoException(function() {
            controller.respondNewLobby(obj);
        });
    },
    
    "test lobbyResponseController should have function to respond to join": function() {
        assertFunction(this.lobbyResponseController.respondJoin);
    },
    
    "test respondJoin should have parameter of type object, else throw Error": function() {
        var controller = this.lobbyResponseController;

        assertException(function() {
            controller.respondJoin(3, 0);
        }, "TypeError");
    },
    
    "test respondJoin should have parameter of type number, else throw Error": function() {
        var controller = this.lobbyResponseController;

        assertException(function() {
            controller.respondJoin({}, {});
        }, "TypeError");
    },
    
    "test respondJoin should throw Error if given data is not valid": function() {
        var controller = this.lobbyResponseController;

        var obj = {type: "join"};
        assertException(function() {
            controller.respondJoin(0, obj);
        }, "Error");

        var obj = {type: "join", player: 6};
        assertException(function() {
            controller.respondJoin(0, obj);
        }, "Error");

        var obj = {type: "join", player: {}};
        assertException(function() {
            controller.respondJoin(0, obj);
        }, "Error");

        var obj = {type: "join", player: {name: 4}};
        assertException(function() {
            controller.respondJoin(0, obj);
        }, "Error");

        var obj = {type: "join", player: {name: "Peter"}};
        assertException(function() {
            controller.respondJoin(0, obj);
        }, "Error");

        var obj = {type: "join", player: {name: "Peter", color: 3}};
        assertException(function() {
            controller.respondJoin(0, obj);
        }, "Error");
        
        // Error because no Lobby exists with Id
        var obj = {type: "join", player: {name: "Peter", color: "#ffffff", type: "human"}};
        assertException(function() {
            controller.respondJoin(0, obj);
        }, "LobbyIdError");
    },
    
    "test lobbyResponseController should have function to respond to a new lobby update": function() {
        assertFunction(this.lobbyResponseController.respondLobbyUpdate);
    },
    
    "test respondLobbyUpdate should have parameter of type object, else throw Error": function() {
        var controller = this.lobbyResponseController;

        assertException(function() {
            controller.respondLobbyUpdate(3, "a");
        }, "TypeError");
    },
    
    "test respondLobbyUpdate should have parameter of type number, else throw Error": function() {
        var controller = this.lobbyResponseController;

        assertException(function() {
            controller.respondLobbyUpdate("a", {});
        }, "TypeError");
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
        
        this.request = {
            type: "create",
            lobby: null,
            player: this.player.serializeAsObject()
        };
        
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
    },
    
    "test respondJoin should join a Lobby with given Player": function() {
        // Must be client
        var player = new tddjs.client.player();
        player.setName("New Player");
        player.setColor("#eeeeee");

        var data = {
            type: "join",
            player: player.serializeAsObject()
        };
        
        // New Lobby
        this.lobbyResponseController.respondNewLobby(this.request);
        
        var id = this.lobbyController.getNextId() - 1;
        
        this.lobbyResponseController.respondJoin(id, data);
        
        var lobby = this.lobbyController.getLobbyById(id);
        assertEquals(2, lobby.getPlayers().length);
        assertEquals("New Player", lobby.getPlayers()[1].getName());
        assertEquals("#eeeeee", lobby.getPlayers()[1].getColor());
    },
    
        
    "test respondLobbyUpdate should update lobby name": function() {
        var data = {
            type: "lobbyUpdate",
            data: {
                name: "NewName"
            }
        };
        
        // New Lobby
        this.lobbyResponseController.respondNewLobby(this.request);
        
        var id = this.lobbyController.getNextId() - 1;
        
        assertNotEquals("NewName", this.lobbyController.getLobbyById(id).getName());
        
        this.lobbyResponseController.respondLobbyUpdate(id, data);
        
        assertEquals("NewName", this.lobbyController.getLobbyById(id).getName());
    },
    
    "test respondLobbyUpdate should update MaxPlayers": function() {
        var data = {
            type: "lobbyUpdate",
            data: {
                maxPlayers: 3
            }
        };
        
        // New Lobby
        this.lobbyResponseController.respondNewLobby(this.request);
        
        var id = this.lobbyController.getNextId() - 1;
        
        assertNotEquals(3, this.lobbyController.getLobbyById(id).getMaxPlayers());
        
        this.lobbyResponseController.respondLobbyUpdate(id, data);
        
        assertEquals(3, this.lobbyController.getLobbyById(id).getMaxPlayers());
    }
});

TestCase("LobbyResponseControllerTypeTest", {
    setUp: function() {
        this.lobbyController = tddjs.server.controller.lobbyController.getInstance();
        
        // Needed because of Singleton
        this.lobbyController.getLobbies().length = 0;
        
        this.lobbyResponseController = new tddjs.server.controller.lobbyResponseController();
        this.sandbox = sinon.sandbox.create();
        this.id = 0;
        
    },
    tearDown: function()
    {
        this.sandbox.restore();
        
        // Hack for removing all lobbies
        this.lobbyController.getLobbies().length = 0;
        delete this.lobbyController;
    },
    
    "test controller should have function to call other functions reliant on type": function() {
        assertFunction(this.lobbyResponseController.switchLobbyPostTypes);
    },
    
    "test switchLobbyPostTypes should call respondLobbyUpdate if type = lobbyUpdate": function() {
      var spy = this.sandbox.stub(this.lobbyResponseController, "respondLobbyUpdate");
      
      var data = {
            type: "lobbyUpdate",
            data: {
                maxPlayers: 3
            }
        };
      
      sinon.assert.notCalled(spy);
      this.lobbyResponseController.switchLobbyPostTypes(this.id, data);
      sinon.assert.calledOnce(spy);
    }
});