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
}

TestCase("LobbyResponseControllerTest", {
    setUp: function() {
        // Must be changed 
        this.lrc = new tddjs.server.controller.NEWlobbyResponseController();
        this.lobbyController = tddjs.server.controller.lobbyController.getInstance();
        this.lobbyFactory = new tddjs.server.controller.lobbyFactory();
        
        this.lobby = this.lobbyFactory.getNewLobby();
        this.lobbyController.addLobby(this.lobby);
    },
    tearDown: function()
    {
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
    }
});

TestCase("LobbyResponseControllerEventSourceTest", {
    setUp: function() {
        // Must be changed 
        this.lrc = new tddjs.server.controller.NEWlobbyResponseController();
        this.lobbyController = tddjs.server.controller.lobbyController.getInstance();
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