/* 
 *  Testcases for LobbyResponseController
 *  
 *  This class handles data exchange with the client
 *  
 */

function fakeReq()
{
    this.headers = [];
    this.session = {};
    
    this.get = function(header)
    {
        return this.headers[header.toLowerCase()];
    };
}

function fakeRes()
{
    this.headers = [];
    this.connection = {};
    
    this.connection.setTimeout = function(timeout)
    {
        
    };
    
    this.append = function(header, value)
    {
        this.headers[header.toLowerCase()] = value;
    };
    
    this.sendStatus = function(status)
    {
        
    };
    
    this.write = function(msg)
    {
        
    };
    
    this.json = function(msg)
    {
        
    };
}

TestCase("LobbyResponseControllerTest", {
    setUp: function() {
        // Must be changed 
        this.lrc = new tddjs.server.controller.NEWlobbyResponseController();
        this.lobbyController = tddjs.server.controller.lobbyController.getInstance();
        
        // Needed because of Singleton
        this.lobbyController.getLobbies().length = 0;
        
        this.lobbyFactory = new tddjs.server.controller.lobbyFactory();
        
        this.lobby = this.lobbyFactory.getNewLobby();
        this.lobbyController.addLobby(this.lobby);
    },
    tearDown: function()
    {
        this.lobbyController.getLobbies().length = 0;
        delete this.lrc;
    },
    
    "test constructor should create new instance of controller": function() {
        assertObject(this.lrc);
    },
    
    "test constructor should have function to set Lobby by Id": function() {
        assertFunction(this.lrc.setLobbyById);
    },
    
    "test setLobbyById should set lobby if lobby with id exists": function() {
        this.lrc.setLobbyById(this.lobby.getId());
        assertSame(this.lobby, this.lrc.lobby);
    },
    
    "test setLobbyById should throw Error if lobby with id does not exist": function() {
        var lrc = this.lrc;
        assertException(function() { lrc.setLobbyById(-1); }, "LobbyIdError");
    }
});

TestCase("LobbyResponseControllerEventSourceTest", {
    setUp: function() {
        // Must be changed 
        this.lrc = new tddjs.server.controller.NEWlobbyResponseController();
        this.lobbyController = tddjs.server.controller.lobbyController.getInstance();
        
        // Needed because of Singleton
        this.lobbyController.getLobbies().length = 0;
        
        this.lobbyFactory = new tddjs.server.controller.lobbyFactory();
        
        this.lobby = this.lobbyFactory.getNewLobby();
        this.player1 = new tddjs.server.player();
        this.player1.setToken("1234");
        
        this.lobby.addPlayer(this.player1);
        
        this.lobbyController.addLobby(this.lobby);
        this.lrc.setLobbyById(this.lobby.getId());
        
        // Mocking req and res
        
        this.req = new fakeReq();
        this.req.session.token = "1234";
        this.req.headers["accept"] = "text/event-stream";
        this.res = new fakeRes();
        
        this.sandbox = sinon.sandbox.create();
        
        this.player1ResSpy = this.sandbox.spy(this.player1, "setResponseObject");
        this.resSendStatusSpy = this.sandbox.spy(this.res, "sendStatus");
        this.resSetTimeoutSpy = this.sandbox.spy(this.res.connection, "setTimeout");
    },
    tearDown: function()
    {
        this.sandbox.restore();
        this.lobbyController.getLobbies().length = 0;
    },
    
     "test lobbyResponseController should have function to accept EventSource": function() {
        assertFunction(this.lrc.acceptEventSource);
    },
    
     "test acceptEventSource should set correct response headers if header accepts text/eventstream ": function() {
         this.lrc.acceptEventSource(this.req, this.res);
         assertEquals(this.res.headers["content-type"], "text/event-stream");
         assertEquals(this.res.headers["cache-control"], "no-cache");
         assertEquals(this.res.headers["connection"], "keep-alive");
    },
    
    "test acceptEventSource should store res object in player with requesting token": function() {
        sinon.assert.notCalled(this.player1ResSpy);
        
        this.lrc.acceptEventSource(this.req, this.res);
        
        sinon.assert.calledOnce(this.player1ResSpy);
        sinon.assert.calledWith(this.player1ResSpy, this.res);
    },
    
    "test acceptEventSource should call res.connection.setTimeout with 0": function() {
        sinon.assert.notCalled(this.resSetTimeoutSpy);
        
        this.lrc.acceptEventSource(this.req, this.res);
        
        sinon.assert.calledOnce(this.resSetTimeoutSpy);
        sinon.assert.calledWith(this.resSetTimeoutSpy, 0);
    },
    
    "test acceptEventSource should call sendStatus with status 400 if player with token does not exists": function() {
        this.req.session.token = "1";
        sinon.assert.notCalled(this.resSendStatusSpy);
        
        this.lrc.acceptEventSource(this.req, this.res);
        
        sinon.assert.calledOnce(this.resSendStatusSpy);
        sinon.assert.calledWith(this.resSendStatusSpy, 400);
    },
    
    "test acceptEventSource should call sendStatus with status 400 if token is undefined": function() {
        this.req.session.token = undefined;
        sinon.assert.notCalled(this.resSendStatusSpy);
        sinon.assert.notCalled(this.player1ResSpy);
        
        this.lrc.acceptEventSource(this.req, this.res);
        
        sinon.assert.notCalled(this.player1ResSpy);
        sinon.assert.calledOnce(this.resSendStatusSpy);
        sinon.assert.calledWith(this.resSendStatusSpy, 400);
    }
});

TestCase("LobbyResponseControllerBroadcastTest", {
    setUp: function() {
        // Must be changed 
        this.lrc = new tddjs.server.controller.NEWlobbyResponseController();
        this.lobbyController = tddjs.server.controller.lobbyController.getInstance();
        
        // Needed because of Singleton
        this.lobbyController.getLobbies().length = 0;
        
        this.lobbyFactory = new tddjs.server.controller.lobbyFactory();
        
        this.lobby = this.lobbyFactory.getNewLobby();
        this.player1 = new tddjs.server.player();
        this.player1.setToken("1234");
        
        this.player2 = new tddjs.server.player();
        this.player2.setToken("2345");
        
        this.player3 = new tddjs.server.player();
        this.player3.setType("bot");
        
        this.lobby.addPlayer(this.player1);
        this.lobby.addPlayer(this.player2);
        this.lobby.addPlayer(this.player3);
        
        this.res1 = new fakeRes();
        this.res2 = new fakeRes();
        
        this.player1.setResponseObject(this.res1);
        this.player2.setResponseObject(this.res2);
        
        this.lobbyController.addLobby(this.lobby);
        this.lrc.setLobbyById(this.lobby.getId());
        
        // Mocking req and res
        
        this.req = new fakeReq();
        this.res = new fakeRes();
        
        this.sandbox = sinon.sandbox.create();
        
        this.pl1GetResSpy = this.sandbox.spy(this.player1, "getResponseObject");
        this.pl2GetResSpy = this.sandbox.spy(this.player2, "getResponseObject");
        this.pl3GetResSpy = this.sandbox.spy(this.player3, "getResponseObject");
        
        this.res1SendSpy = this.sandbox.spy(this.res1, "write");
        this.res2SendSpy = this.sandbox.spy(this.res2, "write");
        
    },
    tearDown: function()
    {
        this.sandbox.restore();
        this.lobbyController.getLobbies().length = 0;
    },
    
     "test lobbyResponseController should have function to broadcast a message to all players in lobby": function() {
        assertFunction(this.lrc.broadcastMessage);
    },
    
    "test broadcastMessage should throw Exception if message is no object": function() {
        var controller = this.lrc;
        assertNoException(function() { controller.broadcastMessage({}, "event"); });
        
        assertException(function() { controller.broadcastMessage("asd", "event"); }, "TypeError");
    },
    
    "test broadcastMessage should throw Exception if event is no string": function() {
        var controller = this.lrc;
        assertNoException(function() { controller.broadcastMessage({}, "event"); });
        
        assertException(function() { controller.broadcastMessage({}, 3); }, "TypeError");
    },
    
    "test broadcastMessage should get all human players res objects and call res.write": function() {
        sinon.assert.notCalled(this.pl1GetResSpy);
        sinon.assert.notCalled(this.pl2GetResSpy);
        sinon.assert.notCalled(this.pl3GetResSpy);
        
        sinon.assert.notCalled(this.res1SendSpy);
        sinon.assert.notCalled(this.res2SendSpy);
        
        this.lrc.broadcastMessage({}, "myEvent");
        
        sinon.assert.calledOnce(this.pl1GetResSpy);
        sinon.assert.calledOnce(this.pl2GetResSpy);
        
        // player3 ist bot, sollte daher nicht aufgerufen werden
        sinon.assert.notCalled(this.pl3GetResSpy);
        
        sinon.assert.calledOnce(this.res1SendSpy);
        sinon.assert.calledOnce(this.res2SendSpy);
    },
    
    "test broadcastMessage should call res.write with correct message": function() {
        var msg = {
            data1: "data1",
            data2: "data2"
        };
        
        var msgJson = JSON.stringify(msg);
        this.lrc.broadcastMessage(msg, "myEvent");

        sinon.assert.calledWith(this.res1SendSpy, "event: " + "myEvent" + "\n" + "data: " + msgJson + "\n\n");
        sinon.assert.calledWith(this.res2SendSpy, "event: " + "myEvent" + "\n" + "data: " + msgJson + "\n\n");
        
        
        msg = {
            data1: "data10",
            data2: "data20"
        };
        
        var msgJson = JSON.stringify(msg);
        this.lrc.broadcastMessage(msg, "myEvent2");

        sinon.assert.calledWith(this.res1SendSpy, "event: " + "myEvent2" + "\n" + "data: " + msgJson + "\n\n");
        sinon.assert.calledWith(this.res2SendSpy, "event: " + "myEvent2" + "\n" + "data: " + msgJson + "\n\n");
    }
    
});


TestCase("LobbyResponseControllerJoinTest", {
    setUp: function() {
        // Must be changed 
        this.lrc = new tddjs.server.controller.NEWlobbyResponseController();
        this.lobbyController = tddjs.server.controller.lobbyController.getInstance();
        
        // Needed because of Singleton
        this.lobbyController.getLobbies().length = 0;
        
        this.lobbyFactory = new tddjs.server.controller.lobbyFactory();
        
        this.lobby = this.lobbyFactory.getNewLobby();
        this.player1 = new tddjs.server.player();
        this.player1.setToken("1234");
        
        this.player2 = new tddjs.server.player();
        this.player2.setToken("2345");
        
        this.player3 = new tddjs.server.player();
        this.player3.setType("bot");
        
        this.newPlayer = new tddjs.server.player();
        this.newPlayer.setName("Unnamed Player");
        this.newPlayer.setColor("#ffffff");
        
        this.lobby.addPlayer(this.player1);
        this.lobby.addPlayer(this.player2);
        this.lobby.addPlayer(this.player3);
          
        this.lobby.setLeader(this.player1);
        
        this.lobbyController.addLobby(this.lobby);
        this.lrc.setLobbyById(this.lobby.getId());
        
        // Mocking req and res
        
        this.req = new fakeReq();
        this.res = new fakeRes();
        
        this.sandbox = sinon.sandbox.create();
        
        this.resSendStatusSpy = this.sandbox.spy(this.res, "sendStatus");
        this.newPlayerTokenSpy = this.sandbox.spy(this.newPlayer, "setToken");
        this.addPlayerSpy = this.sandbox.spy(this.lobby, "addPlayer");
        this.lobbyUniqueTokenSpy = this.sandbox.spy(this.lobby, "getUniqueToken");
        this.joinPlayerSpy = this.sandbox.spy(this.lrc, "joinPlayer");
        this.resJsonSpy = this.sandbox.spy(this.res, "json");
        this.broadcastMessageSpy = this.sandbox.stub(this.lrc, "broadcastMessage");
        
    },
    tearDown: function()
    {
        this.sandbox.restore();
        this.lobbyController.getLobbies().length = 0;
    },
    
     "test lobbyResponseController should have function to respond on player join": function() {
        assertFunction(this.lrc.respondJoin);
    },
    
    
    "test respondJoin should call sendStatus with 400 if req.body is no object": function() {
        this.req.body = undefined;
        
        sinon.assert.notCalled(this.resSendStatusSpy);
        
        this.lrc.respondJoin(this.req, this.res);
        
        sinon.assert.calledOnce(this.resSendStatusSpy);
        sinon.assert.calledWith(this.resSendStatusSpy, 400);
    },
    
    "test respondJoin should call sendStatus with 400 if req.body.player is no object": function() {
        this.req.body = {};
        
        sinon.assert.notCalled(this.resSendStatusSpy);
        
        this.lrc.respondJoin(this.req, this.res);
        
        sinon.assert.calledOnce(this.resSendStatusSpy);
        sinon.assert.calledWith(this.resSendStatusSpy, 400);
    },
    
    "test respondJoin should NOT call sendStatus with 400 if player object in body is valid": function() {
        this.req.body = {
            type: "join", 
            
            player: {
                name: "Unnamed Player", 
                color: "#ffffff", 
                type: "human"
            }
        };
        
        sinon.assert.notCalled(this.resSendStatusSpy);
        
        this.lrc.respondJoin(this.req, this.res);
        
        sinon.assert.notCalled(this.resSendStatusSpy);
    },
    
    "test respondJoin should set req.session.token": function() {
        this.req.body = {
            type: "join", 
            
            player: {
                name: "Unnamed Player", 
                color: "#ffffff", 
                type: "human"
            }
        };
        
        assertUndefined(this.req.session.token);
        this.lrc.respondJoin(this.req, this.res);
        
        assertString(this.req.session.token);
    },
    
    "test respondJoin should call lobby.getUniqueToken": function() {
        this.req.body = {
            type: "join", 
            
            player: {
                name: "Unnamed Player", 
                color: "#ffffff", 
                type: "human"
            }
        };
        
        sinon.assert.notCalled(this.lobbyUniqueTokenSpy);
        
        this.lrc.respondJoin(this.req, this.res);
        
        sinon.assert.calledOnce(this.lobbyUniqueTokenSpy);
    },
    
    "test respondJoin should call joinPlayer with getted token": function() {
        this.req.body = {
            type: "join", 
            
            player: {
                name: "Unnamed Player", 
                color: "#ffffff", 
                type: "human"
            }
        };
        
        sinon.assert.notCalled(this.joinPlayerSpy);
        
        this.lrc.respondJoin(this.req, this.res);

        sinon.assert.calledOnce(this.joinPlayerSpy);
        assertEquals(this.lobbyUniqueTokenSpy.returnValues[0].toString(), this.joinPlayerSpy.args[0][1]);
    },
    
    "test respondJoin should set req.session.token with lobby.getUniqueToken": function() {
        this.req.body = {
            type: "join", 
            
            player: {
                name: "Unnamed Player", 
                color: "#ffffff", 
                type: "human"
            }
        };
        
        assertUndefined(this.req.session.token);
        sinon.assert.notCalled(this.lobbyUniqueTokenSpy);
        
        this.lrc.respondJoin(this.req, this.res);
        
        sinon.assert.calledOnce(this.lobbyUniqueTokenSpy);
        
        assertEquals(this.lobbyUniqueTokenSpy.returnValues[0].toString(), this.req.session.token);
    },
    
    "test respondJoin should call res.json with correct object": function() {
        this.req.body = {
            type: "join", 
            
            player: {
                name: "Unnamed Player", 
                color: "#ffffff", 
                type: "human"
            }
        };
        
  
        sinon.assert.notCalled(this.resJsonSpy);
        
        this.lrc.respondJoin(this.req, this.res);
        
        var out = {};
        out.lobby = this.lobby.serializeAsObject();
        out.currentPlayerId = 3;
        
        sinon.assert.calledOnce(this.resJsonSpy);
        
        assertEquals(out, this.resJsonSpy.args[0][0]);
    },
    
    "test respondJoin should call broadcastMessage with correct data": function() {
        this.req.body = {
            type: "join", 
            
            player: {
                name: "Unnamed Player", 
                color: "#ffffff", 
                type: "human"
            }
        };
        
  
        sinon.assert.notCalled(this.broadcastMessageSpy);
        
        this.lrc.respondJoin(this.req, this.res);
        
        sinon.assert.calledOnce(this.broadcastMessageSpy);
        
        sinon.assert.calledWith(this.broadcastMessageSpy, this.lobby.serializeAsObject(), "lobbychange");
    },
    
    "test lrc should have private helper to join a specific Player": function() {
        assertFunction(this.lrc.joinPlayer);
    },
    
    "test joinPlayer should call setToken on player with specified Token": function() {
        sinon.assert.notCalled(this.newPlayerTokenSpy);
        
        this.lrc.joinPlayer(this.newPlayer, "88");
        
        sinon.assert.calledOnce(this.newPlayerTokenSpy);
        sinon.assert.calledWith(this.newPlayerTokenSpy, "88");
    },
    
    "test joinPlayer should call lobby.addPlayer with new player": function() {
        sinon.assert.notCalled(this.addPlayerSpy);
        
        this.lrc.joinPlayer(this.newPlayer, "88");
        
        sinon.assert.calledOnce(this.addPlayerSpy);
        sinon.assert.calledWith(this.addPlayerSpy, this.newPlayer);
    }
});