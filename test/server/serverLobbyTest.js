/* 
 *  Testcases for Lobby
 */

TestCase("LobbyPlayerServerTest", {
    setUp: function() {
        this.lobby = new tddjs.server.model.lobby();
        this.lobby2 = new tddjs.server.model.lobby();

        this.player1 = new tddjs.server.player();
        this.player2 = new tddjs.server.player();
        this.player3 = new tddjs.server.player();
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
    
    "test setMaxPlayers should throw Error if param is not a number": function() {
        var lobby = this.lobby;
        
        assertException(function() { lobby.setMaxPlayers("5"); }, "TypeError");
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
    },
    "test Lobby should only store player1, not store player3 and kick player2 when setter is called": function() {
        this.lobby.setMaxPlayers(2);

        assertFalse(this.lobby.getPlayers().indexOf(this.player1) >= 0);
        assertFalse(this.lobby.getPlayers().indexOf(this.player2) >= 0);
        assertFalse(this.lobby.getPlayers().indexOf(this.player3) >= 0);

        this.lobby.addPlayer(this.player1);
        assertTrue(this.lobby.getPlayers().indexOf(this.player1) >= 0);

        this.lobby.addPlayer(this.player2);
        assertTrue(this.lobby.getPlayers().indexOf(this.player1) >= 0);
        assertTrue(this.lobby.getPlayers().indexOf(this.player2) >= 0);
        
        try
        {
        
            this.lobby.addPlayer(this.player3);
        }
        
        catch(e) {}
        
        assertTrue(this.lobby.getPlayers().indexOf(this.player1) >= 0);
        assertTrue(this.lobby.getPlayers().indexOf(this.player2) >= 0);
        assertFalse(this.lobby.getPlayers().indexOf(this.player3) >= 0);

        this.lobby.setMaxPlayers(1);
        assertTrue(this.lobby.getPlayers().indexOf(this.player1) >= 0);
        assertFalse(this.lobby.getPlayers().indexOf(this.player2) >= 0);
        assertFalse(this.lobby.getPlayers().indexOf(this.player3) >= 0);

    },
    
     "test Lobby should throw Error if player joins but maxPlayers is exceeded": function() {
        this.lobby.setMaxPlayers(2);

        this.lobby.addPlayer(this.player1);
        this.lobby.addPlayer(this.player2);
        
        var lobby = this.lobby;
        var player3 = this.player3;
        assertException(function() { lobby.addPlayer(player3); }, "Error");
    },
    
    "test Lobby should store player1 and kick player2 and player3": function() {
        this.lobby.setMaxPlayers(4);

        assertFalse(this.lobby.getPlayers().indexOf(this.player1) >= 0);

        this.lobby.addPlayer(this.player1);
        assertTrue(this.lobby.getPlayers().indexOf(this.player1) >= 0);

        this.lobby.addPlayer(this.player2);
        assertTrue(this.lobby.getPlayers().indexOf(this.player2) >= 0);

        this.lobby.kickPlayer(this.player1);
        assertFalse(this.lobby.getPlayers().indexOf(this.player1) >= 0);

        this.lobby.kickPlayer(this.player2);
        assertFalse(this.lobby.getPlayers().indexOf(this.player2) >= 0);
    },
    "test Lobby should set player id when player is added": function() {
        assertUndefined(this.player1.getId());
        this.lobby.addPlayer(this.player1);
        assertNotUndefined(this.player1.getId());
    },
    "test when adding multiple players, each player should have a unique Id": function() {
        this.lobby.addPlayer(this.player1);
        this.lobby.addPlayer(this.player2);

        assertNotUndefined(this.player1.getId());
        assertNotUndefined(this.player2.getId());

        assertNotEquals(this.player1.getId(), this.player2.getId());

    },
    
    "test Lobby should have method to get player by id": function() {
        assertFunction(this.lobby.getPlayerById);
    },
    
    "test getPlayerById should return correct player": function() {
        this.player1.setId(1);
        this.player2.setId(2);
        
        this.lobby.addPlayer(this.player1);
        this.lobby.addPlayer(this.player2);
        
        assertSame(this.player1, this.lobby.getPlayerById(1));
        assertSame(this.player2, this.lobby.getPlayerById(2));
    }

});


TestCase("LobbyLeaderServerTest", {
    setUp: function() {
        this.lobby = new tddjs.server.model.lobby();
        this.player1 = new tddjs.server.player();
        this.player2 = new tddjs.server.player();
        this.player3 = new tddjs.server.player();
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


TestCase("LobbyServerTest", {
    setUp: function() {
        this.lobby = new tddjs.server.model.lobby();
        this.player1 = new tddjs.server.player();
        this.player2 = new tddjs.server.player();
        this.player3 = new tddjs.server.player();
        this.lobby.setMaxPlayers(4);
        
        this.sandbox = sinon.sandbox.create();
    },
    tearDown: function() {
        this.lobby.getPlayers().length = 0;
        delete this.lobby;
        delete this.player1;
        delete this.player2;
        delete this.player3;
        
        this.sandbox.restore();
    },
    
    "test Lobby should have function to set Lobby started": function() {
        assertFunction(this.lobby.setStarted);
    },
    
    "test Lobby should have function to get Lobby started": function() {
        assertFunction(this.lobby.isStarted);
    },
    
    "test setStarted should set lobby started": function() {
        assertFalse(this.lobby.isStarted());
        
        this.lobby.setStarted(true);
        assertTrue(this.lobby.isStarted());
    },
    
    "test lobby should have function startGame": function() {
        assertFunction(this.lobby.startGame);
    },
    
     "test startGame should set started to true": function() {
         this.lobby.addPlayer(this.player1);
         this.lobby.addPlayer(this.player2);
         this.lobby.setLeader(this.player1);
         
         assertFalse(this.lobby.isStarted());
         this.lobby.startGame();
         assertTrue(this.lobby.isStarted());
    },
    
    "test lobby should have function to get mapController": function() {
        assertFunction(this.lobby.getMapController);
    },
    
    "test getMapController should return instance of mapController": function() {
        assertTrue(this.lobby.getMapController() instanceof tddjs.server.controller.mapController);
    },
    
    "test startGame should call init method of mapController with players": function() {
        var spy = this.sandbox.stub(this.lobby.getMapController(), "init");
        
        sinon.assert.notCalled(spy);
        
        this.lobby.startGame();
        
        sinon.assert.calledOnce(spy);
        sinon.assert.calledWith(spy, this.lobby.getPlayers());
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


TestCase("LobbyServerAuthentificationTest", {
    setUp: function() {
        this.lobby = new tddjs.server.model.lobby();
        this.player1 = new tddjs.server.player();
        this.player2 = new tddjs.server.player();
        
        this.player1.setId(1);
        this.player2.setId(2);
        this.player1.setToken("T1");
        this.player2.setToken("T2");
        
        this.lobby.addPlayer(this.player1);
        this.lobby.addPlayer(this.player2);
        this.lobby.setLeader(this.player1);
    },
    tearDown: function() {
        delete this.lobby;
        delete this.player1;
        delete this.player2;
    },
    "test Lobby should have function to get a Player by token": function() {
        assertFunction(this.lobby.getPlayerByToken);
    },
    
    "test getPlayerByToken should return correct player with given token": function() {
        var p1 = this.lobby.getPlayerByToken("T1");
        var p2 = this.lobby.getPlayerByToken("T2");
        
        assertSame(p1, this.player1);
        assertSame(p2, this.player2);
    },
    
    "test getPlayerByToken should return null if no player with given token exists": function() {
        var p1 = this.lobby.getPlayerByToken("T0");
        
        assertNull(p1);
    },
    
    "test getPlayerByToken should throw an Error if Token is no string": function() {
        var lobby = this.lobby;
        
        assertException(function() { lobby.getPlayerByToken(2); }, "TypeError");
        assertNoException(function() { lobby.getPlayerByToken("2"); });
    },
    
    "test Lobby should have function to check token to a specific player": function() {
        assertFunction(this.lobby.isPlayerTokenValid);
    },
    
    "test isPlayerTokenValid should return true if player has specified token": function() {
        var value1 = this.lobby.isPlayerTokenValid(this.player1, "T1");
        var value2 = this.lobby.isPlayerTokenValid(this.player2, "T2");
        
        assertTrue(value1);
        assertTrue(value2);
    },
    
    "test isPlayerTokenValid should return false if player has not specified token": function() {
        var value1 = this.lobby.isPlayerTokenValid(this.player2, "T1");
        var value2 = this.lobby.isPlayerTokenValid(this.player1, "T2");
        
        assertFalse(value1);
        assertFalse(value2);
    },
    
    "test Lobby should have function to check token to a specific player and leader status": function() {
        assertFunction(this.lobby.isLeaderTokenValid);
    },
    
     "test isLeaderTokenValid should return true if player is Leader and has specified token": function() {
        var value1 = this.lobby.isLeaderTokenValid("T1");
        
        assertTrue(value1);
    },
    
    "test isLeaderTokenValid should return false if player has not specified token": function() {
        var value2 = this.lobby.isLeaderTokenValid("T-1");

        assertFalse(value2);
    },
    
    "test isLeaderTokenValid should return false if player has specified token but is not leader": function() {
        var value2 = this.lobby.isLeaderTokenValid("T2");

        assertFalse(value2);
    },
    
    "test Lobby should have function to get a new unique Token": function() {
        assertFunction(this.lobby.getUniqueToken);
    },
    
    "test getUniqueToken should always return a different Token": function() {
        var tokens = [];
        tokens[0] = this.lobby.getUniqueToken();
        tokens[1] = this.lobby.getUniqueToken();
        tokens[2] = this.lobby.getUniqueToken();
        
        assertNotEquals(tokens[0], tokens[1]);
        assertNotEquals(tokens[0], tokens[2]);
        
        assertNotEquals(tokens[1], tokens[2]);
    }
});

TestCase("LobbyBotTest", {
    setUp: function() {
        this.lobby = new tddjs.server.model.lobby();
        this.player1 = new tddjs.server.player();
        this.player2 = new tddjs.server.player();
        
        this.player1.setId(1);
        this.player2.setId(2);
        this.player1.setToken("T1");
        this.player2.setToken("T2");
        
        this.lobby.addPlayer(this.player1);
        this.lobby.addPlayer(this.player2);
        this.lobby.setLeader(this.player1);
    },
    tearDown: function() {
        delete this.lobby;
        delete this.player1;
        delete this.player2;
    },
    "test Lobby should have function to add bot": function() {
        assertFunction(this.lobby.addBot);
    },
    
    "test addBot should return instance of player": function() {
        assertTrue(this.lobby.addBot() instanceof tddjs.server.player);
    },
    
    "test new bot should have type of bot": function() {
        var bot = this.lobby.addBot();
        
        assertEquals("bot", bot.getType());
    },
    
    "test addBot should add new Bot to lobby if slots are empty": function() {
        assertEquals(2, this.lobby.getPlayers().length);
        
        this.lobby.addBot();
        assertEquals(3, this.lobby.getPlayers().length);
    },
    
    "test addBot should not add new Bot to lobby if lobby is full": function() {
        this.lobby.setMaxPlayers(2);
        assertEquals(2, this.lobby.getPlayers().length);
        
        this.lobby.addBot();
        assertEquals(2, this.lobby.getPlayers().length);
    },
    
    "test addBot should return null if lobby is full": function() {
        this.lobby.setMaxPlayers(2);
        
        var bot = this.lobby.addBot();
        assertNull(bot);
    },
    
    "test new bots should have different names": function() {
        var bot1 = this.lobby.addBot();
        var bot2 = this.lobby.addBot();
        
        assertNotEquals(bot1.getName(), bot2.getName());
    },
    
    "test bot names should start with BOT {name}": function() {
        var bot1 = this.lobby.addBot();
        var bot2 = this.lobby.addBot();
        
        var nameSub1 = bot1.getName().substring(0, 4);
        var nameSub2 = bot2.getName().substring(0, 4);
        
        assertEquals("BOT ", nameSub1);
        assertEquals("BOT ", nameSub2);
    },
    
    "test new bots should have different colors": function() {
        var bot1 = this.lobby.addBot();
        var bot2 = this.lobby.addBot();
        
        assertNotEquals(bot1.getColor(), bot2.getColor());
    }
});