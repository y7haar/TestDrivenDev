/* 
 *  Testcases for LobbiesResponseController
 *  
 *  This class handles data exchange with the client for multiple lobbies
 *  
 */

function fakeReq()
{
    this.headers = [];
    this.session = {};

    this.get = function (header)
    {
        return this.headers[header.toLowerCase()];
    };
}

function fakeRes()
{
    this.headers = [];
    this.connection = {};

    this.connection.setTimeout = function (timeout)
    {

    };

    this.set = function (header, value)
    {
        this.headers[header.toLowerCase()] = value;
    };

    this.sendStatus = function (status)
    {

    };

    this.write = function (msg)
    {

    };

    this.json = function (msg)
    {

    };
}

TestCase("LobbiesResponseControllerTest", {
    setUp: function () {
        // Must be changed 
        this.lrc = new tddjs.server.controller.lobbiesResponseController();
        this.lobbyController = tddjs.server.controller.lobbyController.getInstance();
        
        // Needed because of Singleton
        this.lobbyController.getLobbies().length = 0;
        
        this.lobbyFactory = new tddjs.server.controller.lobbyFactory();
        this.lobby = this.lobbyFactory.getNewLobby();
        this.player1 = new tddjs.server.player();
        this.lobby.addPlayer(this.player1);
        this.lobby.setLeader(this.player1);
        
        this.lobbyController.addLobby(this.lobby);
        
        
        this.sandbox = sinon.sandbox.create();
        
        this.req = new fakeReq();
        this.res = new fakeRes();
        
        this.lobbyControllerSerializeOSpy = this.sandbox.stub(this.lobbyController, "serializeUnstartedAsArray");
        this.resJsonSpy = this.sandbox.stub(this.res, "json");
    },
    tearDown: function ()
    {
        this.sandbox.restore();
        this.lobbyController.getLobbies().length = 0;
        delete this.lrc;
    },
    
    "test constructor should create new instance of controller": function () {
        assertObject(this.lrc);
    },
    
    "test lrc should have function to get all lobbies that are not started": function () {
        assertFunction(this.lrc.respondAllLobbies);
    },
    
    "test respondAllLobbies should call serialize method in lobbyController": function () {
        sinon.assert.notCalled(this.lobbyControllerSerializeOSpy);
        
        this.lrc.respondAllLobbies(this.req, this.res);
        
        sinon.assert.calledOnce(this.lobbyControllerSerializeOSpy);
    },
    
    "test respondAllLobbies should call res.json with serialized lobbies": function () {
        sinon.assert.notCalled(this.resJsonSpy);
        
        this.lrc.respondAllLobbies(this.req, this.res);
        
        sinon.assert.calledOnce(this.resJsonSpy);
        sinon.assert.calledWith(this.resJsonSpy, this.lobbyController.serializeUnstartedAsArray());
    }
    
});


TestCase("LobbiesResponseControllerNewLobbyTest", {
    setUp: function()
    {
        this.lrc = new tddjs.server.controller.lobbiesResponseController();
        this.lobbyController = tddjs.server.controller.lobbyController.getInstance();
        this.sandbox = sinon.sandbox.create();
        
        this.resSendStatusSpy = this.sandbox.spy(this.res, "sendStatus");
        this.newPlayerTokenSpy = this.sandbox.spy(this.newPlayer, "setToken");
        this.addPlayerSpy = this.sandbox.spy(this.lobby, "addPlayer");
        this.resJsonSpy = this.sandbox.spy(this.res, "json");
    },
    
    tearDown: function ()
    {
        this.sandbox.restore();
        this.lobbyController.getLobbies().length = 0;
    },
    
    
    "test lobbiesResponseController should have function to respond on new lobby request": function () {
        assertFunction(this.lrc.respondNewLobby);
    },
    
    "test respondNewLobby should call sendStatus with 400 if req.body is no object": function () {
        this.req.body = undefined;

        sinon.assert.notCalled(this.resSendStatusSpy);

        this.lrc.respondNewLobby(this.req, this.res);

        sinon.assert.calledOnce(this.resSendStatusSpy);
        sinon.assert.calledWith(this.resSendStatusSpy, 400);
    },
    
    "test respondNewLobby should call sendStatus with 400 if req.body.player is no object": function () {
        this.req.body = {};

        sinon.assert.notCalled(this.resSendStatusSpy);

        this.lrc.respondNewLobby(this.req, this.res);

        sinon.assert.calledOnce(this.resSendStatusSpy);
        sinon.assert.calledWith(this.resSendStatusSpy, 400);
    },
    
    "test respondNewLobby should NOT call sendStatus with 400 if player object in body is valid": function () {
        this.req.body = {
           type: "create",
            player: {
                name: "Unnamed Player",
                color: "#ffffff",
                type: "human"
            }
        };

        sinon.assert.notCalled(this.resSendStatusSpy);

        this.lrc.respondNewLobby(this.req, this.res);

        sinon.assert.notCalled(this.resSendStatusSpy);
    },
    
    "test respondNewLobby should set req.session.token": function () {
        this.req.body = {
           type: "create",
            player: {
                name: "Unnamed Player",
                color: "#ffffff",
                type: "human"
            }
        };

        assertUndefined(this.req.session.token);
        this.lrc.respondNewLobby(this.req, this.res);

        assertString(this.req.session.token);
    }
    
    // TODO helper method for creating a new lobby / adding player to lobby
});