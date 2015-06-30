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

TestCase("LobbyResponseControllerTest", {
    setUp: function () {
        // Must be changed 
        this.lrc = new tddjs.server.controller.lobbiesResponseController();
        this.lobbyController = tddjs.server.controller.lobbyController.getInstance();
        
        // Needed because of Singleton
        this.lobbyController.getLobbies().length = 0;
        
        this.lobbyFactory = new tddjs.server.controller.lobbyFactory();
        this.lobby = this.lobbyFactory.getNewLobby();
        this.lobbyController.addLobby(this.lobby);
        
        
        this.sandbox = sinon.sandbox.create();
        
        this.req = new fakeReq();
        this.res = new fakeRes();
        
        this.lobbyControllerSerializeOSpy = this.sandbox.stub(this.lobbyController, "serializeAsArray");
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
        sinon.assert.calledWith(this.resJsonSpy, this.lobbyController.serializeAsArray());
    }
    
});