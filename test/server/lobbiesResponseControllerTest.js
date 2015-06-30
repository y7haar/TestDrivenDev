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
        
        this.sandbox = sinon.sandbox.create();
        
        this.req = new fakeReq();
        this.res = new fakeRes();
    },
    tearDown: function ()
    {
        this.sandbox.restore();
        this.lobbyController.getLobbies().length = 0;
        delete this.lrc;
    },
    "test constructor should create new instance of controller": function () {
        assertObject(this.lrc);
    }
    
});