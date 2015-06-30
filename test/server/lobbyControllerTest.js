/* 
 * Testcases for LobbyController
 */

TestCase("LobbyControllerTest", {
    setUp: function() {
        var controllerInstance = new tddjs.server.controller.lobbyController();
        this.realGetInstance = tddjs.server.controller.lobbyController.getInstance;
        
        tddjs.server.controller.lobbyController.getInstance = function()
        {
            return controllerInstance;
        };
        
        this.lobbyController = tddjs.server.controller.lobbyController.getInstance();
        this.lobby1 = new tddjs.server.model.lobby();
        this.lobby2 = new tddjs.server.model.lobby();
        this.lobby5 = new tddjs.server.model.lobby();

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
        this.lobby5.setId(5);

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
    },
    tearDown: function() {
        this.lobbyController.removeLobby(this.lobby1);
        this.lobbyController.removeLobby(this.lobby2);
        this.lobbyController.removeLobby(this.lobby5);

        delete this.lobby1;
        delete this.lobby2;
        delete this.lobby5;
        delete this.lobbyController;
        
        tddjs.server.controller.lobbyController.getInstance = this.realGetInstance;
    },
    "test object of LobbyController should not be undefined": function() {
        assertObject(this.lobbyController);
    },
    "test lobbyController should store lobby1 and lobby2, Exception if parameter is not a Lobby": function() {
        assertEquals(0, this.lobbyController.getLobbyCount());
        this.lobbyController.addLobby(this.lobby1);
        assertEquals(1, this.lobbyController.getLobbyCount());
        this.lobbyController.addLobby(this.lobby2);
        assertEquals(2, this.lobbyController.getLobbyCount());

        var lobbyController = this.lobbyController;
        assertException(function() {
            lobbyController.addLobby("asd");
        }, "TypeError");
    },
    "test lobbyController should return a specific Lobby by Id": function() {
        this.lobbyController.addLobby(this.lobby1);
        this.lobbyController.addLobby(this.lobby2);

        assertSame(this.lobby1, this.lobbyController.getLobbyById(0));
        assertSame(this.lobby2, this.lobbyController.getLobbyById(1));
    },
    "test lobbyController should throw Exception if lobbyController does not store an element with the given id ": function() {
        var lobbyController = this.lobbyController;
        
        assertNull(lobbyController.getLobbyById(5));
    },
    "test lobbyController should throw Exception if parameter is no number ": function() {
        var lobbyController = this.lobbyController;
        assertException(function() {
            lobbyController.getLobbyById("asd");
        }, "TypeError");
    },
    "test lobbyController should hold a reference to lobby1 and lobby2 and store elements at given index (id)": function() {
        assertNotSame(this.lobby1, this.lobbyController.getLobbies()[0]);
        assertNotSame(this.lobby1, this.lobbyController.getLobbies()[5]);
        assertNotSame(this.lobby5, this.lobbyController.getLobbies()[0]);
        assertNotSame(this.lobby5, this.lobbyController.getLobbies()[5]);

        this.lobbyController.addLobby(this.lobby1);
        assertSame(this.lobby1, this.lobbyController.getLobbies()[0]);

        this.lobbyController.addLobby(this.lobby5);
        assertSame(this.lobby5, this.lobbyController.getLobbies()[5]);
    },
    "test lobbyController should throw an Exception when adding a Lobby at an existent index": function() {
        var lobbyController = this.lobbyController;
        var lobby1 = this.lobby1;

        lobbyController.addLobby(lobby1);
        assertException(function() {
            lobbyController.addLobby(lobby1);
        }, "Error");
    },
    "test lobbyController should hold a reference to lobby1 and remove lobby2, Exception at removing if parameter is no Lobby": function() {
        assertNotSame(this.lobby1, this.lobbyController.getLobbies()[0]);
        assertNotSame(this.lobby1, this.lobbyController.getLobbies()[1]);
        assertNotSame(this.lobby2, this.lobbyController.getLobbies()[0]);
        assertNotSame(this.lobby2, this.lobbyController.getLobbies()[1]);

        this.lobbyController.addLobby(this.lobby1);
        assertSame(this.lobby1, this.lobbyController.getLobbies()[0]);

        this.lobbyController.addLobby(this.lobby2);
        assertSame(this.lobby2, this.lobbyController.getLobbies()[1]);

        assertEquals(2, this.lobbyController.getLobbyCount());

        this.lobbyController.removeLobby(this.lobby2);
        assertNotSame(this.lobby2, this.lobbyController.getLobbies()[1]);
        assertEquals(1, this.lobbyController.getLobbyCount());

        var lobbyController = this.lobbyController;
        assertException(function() {
            lobbyController.removeLobby("asd");
        }, "TypeError");
    },
    "test lobbyController should manage and provide the next available Id": function() {
        assertEquals(0, this.lobbyController.getNextId());
        assertEquals(1, this.lobbyController.getNextId());

        this.lobbyController.addLobby(this.lobby1);
        this.lobbyController.addLobby(this.lobby2);

        assertEquals(2, this.lobbyController.getNextId());

        this.lobbyController.removeLobby(this.lobby2);

        assertEquals(3, this.lobbyController.getNextId());
        assertEquals(4, this.lobbyController.getNextId());
    },
    "test lobbyController should provide a getInstance-method and always return the same Object": function() {
        this.lobbyController1 = tddjs.server.controller.lobbyController.getInstance();
        this.lobbyController2 = tddjs.server.controller.lobbyController.getInstance();

        assertSame(this.lobbyController1, this.lobbyController2);
        this.lobbyController1.addLobby(this.lobby1);
        assertEquals(this.lobbyController1.getLobbyCount(), this.lobbyController2.getLobbyCount());
    },
    "test lobbyController should provide a serialize-method and return an array of serialized lobbies": function() {
        // cleanup because of singleton
        this.lobbyController.getLobbies().length = 0;

        this.lobbyController.addLobby(this.lobby1);
        this.lobbyController.addLobby(this.lobby2);

        assertFunction(this.lobbyController.serialize);

        var json = this.lobbyController.serialize();
        json = JSON.parse(json);

        assertArray(json);
        assertEquals(2, json.length);
        assertObject(json[0]);
        assertObject(json[1]);

        // No tests for type --> is already tested in lobby / player tests

        // L1
        assertEquals("L1", json[0].name);
        assertEquals(0, json[0].id);
        assertEquals(2, json[0].maxPlayers);
        assertEquals(1, json[0].leader);

        // P1
        assertEquals("P1", json[0].players[0].name);
        assertEquals(1, json[0].players[0].id);
        assertEquals("#000000", json[0].players[0].color);

        // P2
        assertEquals("P2", json[0].players[1].name);
        assertEquals(2, json[0].players[1].id);
        assertEquals("#111111", json[0].players[1].color);

        // L2
        assertEquals("L2", json[1].name);
        assertEquals(1, json[1].id);
        assertEquals(3, json[1].maxPlayers);
        assertEquals(4, json[1].leader);

        // P1
        assertEquals("P3", json[1].players[0].name);
        assertEquals(3, json[1].players[0].id);
        assertEquals("#222222", json[1].players[0].color);

        // P2
        assertEquals("P4", json[1].players[1].name);
        assertEquals(4, json[1].players[1].id);
        assertEquals("#333333", json[1].players[1].color);
    },
    
    "test lobbyController should provide a serialize-method and return an array of all unstarted serialized lobbies": function() {
        // cleanup because of singleton
        this.lobbyController.getLobbies().length = 0;

        this.lobbyController.addLobby(this.lobby1);
        this.lobbyController.addLobby(this.lobby2);
        
        this.lobby2.setStarted(true);
        
        assertFunction(this.lobbyController.serializeUnstartedAsArray);

        var json = this.lobbyController.serializeUnstartedAsArray();

        assertArray(json);
        assertEquals(1, json.length);
        assertObject(json[0]);

        // No tests for type --> is already tested in lobby / player tests

        // L1
        assertEquals("L1", json[0].name);
        assertEquals(0, json[0].id);
        assertEquals(2, json[0].maxPlayers);
        assertEquals(1, json[0].leader);

        // P1
        assertEquals("P1", json[0].players[0].name);
        assertEquals(1, json[0].players[0].id);
        assertEquals("#000000", json[0].players[0].color);

        // P2
        assertEquals("P2", json[0].players[1].name);
        assertEquals(2, json[0].players[1].id);
        assertEquals("#111111", json[0].players[1].color);
    }
});


