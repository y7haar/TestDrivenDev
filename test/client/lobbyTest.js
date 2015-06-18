/* 
 *  Testcases for Lobby
 */

TestCase("LobbyPlayerClientTest", {
    setUp: function() {
        this.lobby = new tddjs.client.model.lobby();
        this.lobby2 = new tddjs.client.model.lobby();
        this.player1 = new tddjs.client.player();
        this.player2 = new tddjs.client.player();
        this.player3 = new tddjs.client.player();
    },
    tearDown: function() {
        this.lobby.getPlayers().length = 0;

        delete this.lobby;
        delete this.lobby2;
        delete this.player1;
        delete this.player2;
        delete this.player3;
    },
    "test object of Lobby should not be undefined": function() {
        assertObject(this.lobby);
    },
    "test Lobby should store Id": function() {
        this.lobby.setId(2);
        assertEquals(2, this.lobby.getId());

        this.lobby2.setId(10);
        assertEquals(2, this.lobby.getId());
        assertEquals(10, this.lobby2.getId());
    },
    "test setting the lobby id should only be allowed once, otherwise throw an exception": function() {
        this.lobby.setId(2);
        assertEquals(2, this.lobby.getId());

        var lobby = this.lobby;

        assertException(function() {
            lobby.setId(3);
        }, "Error");
    },
    "test Lobby should store name": function() {
        this.lobby.setName("TestLobby");
        assertEquals("TestLobby", this.lobby.getName());

        this.lobby2.setName("TestLobby2");
        assertEquals("TestLobby", this.lobby.getName());
        assertEquals("TestLobby2", this.lobby2.getName());
    },
    "test should throw Exception when name is no string": function() {
        assertException(function() {
            this.lobby.setName(3);
        }, "TypeError");
    },
    "test should throw Exception when Id is no Number": function() {
        assertException(function() {
            this.lobby.setId("a");
        }, "TypeError");
    },
    "test Lobby should store player1 and player2 and player 3": function() {
        this.lobby.setMaxPlayers(3);

        assertFalse(this.lobby.getPlayers().indexOf(this.player1) >= 0);
        assertFalse(this.lobby.getPlayers().indexOf(this.player2) >= 0);
        assertFalse(this.lobby.getPlayers().indexOf(this.player3) >= 0);

        this.lobby.addPlayer(this.player1);
        assertTrue(this.lobby.getPlayers().indexOf(this.player1) >= 0);

        this.lobby.addPlayer(this.player2);
        assertTrue(this.lobby.getPlayers().indexOf(this.player1) >= 0);
        assertTrue(this.lobby.getPlayers().indexOf(this.player2) >= 0);

        this.lobby.addPlayer(this.player3);
        assertTrue(this.lobby.getPlayers().indexOf(this.player1) >= 0);
        assertTrue(this.lobby.getPlayers().indexOf(this.player2) >= 0);
        assertTrue(this.lobby.getPlayers().indexOf(this.player3) >= 0);
    }
});


TestCase("LobbyLeaderClientTest", {
    setUp: function() {
        this.lobby = new tddjs.server.model.lobby();
        this.player1 = new tddjs.client.player();
        this.player2 = new tddjs.client.player();
        this.player3 = new tddjs.client.player();
        this.lobby.setMaxPlayers(4);
    },
    tearDown: function() {
        this.lobby.getPlayers().length = 0;
        delete this.lobby;
        delete this.player1;
        delete this.player2;
        delete this.player3;
    },
    "test Lobby should store a lobby leader": function() {
        this.lobby.addPlayer(this.player1);
        this.lobby.setLeader(this.player1);

        assertSame(this.player1, this.lobby.getLeader());
    },
    "test Lobby should throw an Exception if leader is not stored as player": function() {
        var player = this.player1;
        var lobby = this.lobby;

        assertException(function() {
            lobby.setLeader(player);
        }, "Error");
    },
    "test Lobby should set player2 as new leader, after player1 is kicked": function() {
        this.lobby.addPlayer(this.player1);
        this.lobby.addPlayer(this.player2);
        this.lobby.addPlayer(this.player3);

        this.lobby.setLeader(this.player1);
        assertSame(this.player1, this.lobby.getLeader());

        this.lobby.kickPlayer(this.player1);
        assertNotSame(this.player1, this.lobby.getLeader());
        assertSame(this.player2, this.lobby.getLeader());
    },
    "test Lobby should set leader null if all players are kicked": function() {
        this.lobby.addPlayer(this.player1);
        this.lobby.addPlayer(this.player2);

        this.lobby.setLeader(this.player1);
        assertSame(this.player1, this.lobby.getLeader());

        this.lobby.kickPlayer(this.player1);
        this.lobby.kickPlayer(this.player2);
        assertNull(this.lobby.getLeader());
    }

});


TestCase("LobbyClientTest", {
    setUp: function() {
        this.lobby = new tddjs.server.model.lobby();
        this.player1 = new tddjs.client.player();
        this.player2 = new tddjs.client.player();
        this.player3 = new tddjs.client.player();
        this.lobby.setMaxPlayers(4);
    },
    tearDown: function() {
        this.lobby.getPlayers().length = 0;
        delete this.lobby;
        delete this.player1;
        delete this.player2;
        delete this.player3;
    },
    "test Lobby should have a serialize method that returns a json string": function() {
        this.player1.setName("Bob");
        this.player2.setName("Hanswurst");

        this.player1.setId(1);
        this.player2.setId(2);

        this.player1.setColor("#FFFFFF");
        this.player2.setColor("#000000");

        this.lobby.addPlayer(this.player1);
        this.lobby.addPlayer(this.player2);
        this.lobby.setLeader(this.player1);
        this.lobby.setMaxPlayers(2);
        this.lobby.setId(42);
        this.lobby.setName("TestLobby");

        var json = this.lobby.serialize();
        json = JSON.parse(json);

        assertObject(json);

        assertNumber(json.maxPlayers);
        assertEquals(2, json.maxPlayers);

        assertString(json.name);
        assertEquals("TestLobby", json.name);

        assertNumber(json.id);
        assertEquals(42, json.id);

        assertNumber(json.leader);
        assertEquals(1, json.leader);

        assertArray(json.players);
        assertObject(json.players[0]);
        assertObject(json.players[1]);

        assertNumber(json.players[0].id);
        assertEquals(1, json.players[0].id);

        assertString(json.players[0].name);
        assertEquals("Bob", json.players[0].name);

        assertString(json.players[0].color);
        assertEquals("#FFFFFF", json.players[0].color);

        assertNumber(json.players[1].id);
        assertEquals(2, json.players[1].id);

        assertString(json.players[1].name);
        assertEquals("Hanswurst", json.players[1].name);

        assertString(json.players[1].color);
        assertEquals("#000000", json.players[1].color);

    },
    "test Lobby should have a serializeAsObject method that returns an object": function() {
        this.player1.setName("Bob");
        this.player2.setName("Hanswurst");

        this.player1.setId(1);
        this.player2.setId(2);

        this.player1.setColor("#FFFFFF");
        this.player2.setColor("#000000");

        this.lobby.addPlayer(this.player1);
        this.lobby.addPlayer(this.player2);
        this.lobby.setLeader(this.player1);
        this.lobby.setMaxPlayers(2);
        this.lobby.setId(42);
        this.lobby.setName("TestLobby");

        var json = this.lobby.serializeAsObject();

        assertObject(json);

        assertNumber(json.maxPlayers);
        assertEquals(2, json.maxPlayers);

        assertString(json.name);
        assertEquals("TestLobby", json.name);

        assertNumber(json.id);
        assertEquals(42, json.id);

        assertNumber(json.leader);
        assertEquals(1, json.leader);

        assertArray(json.players);
        assertObject(json.players[0]);
        assertObject(json.players[1]);

        assertNumber(json.players[0].id);
        assertEquals(1, json.players[0].id);

        assertString(json.players[0].name);
        assertEquals("Bob", json.players[0].name);

        assertString(json.players[0].color);
        assertEquals("#FFFFFF", json.players[0].color);

        assertNumber(json.players[1].id);
        assertEquals(2, json.players[1].id);

        assertString(json.players[1].name);
        assertEquals("Hanswurst", json.players[1].name);

        assertString(json.players[1].color);
        assertEquals("#000000", json.players[1].color);

    }



});