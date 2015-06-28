/* 
 *  Testcases for LobbyResponseController
 *  
 *  This class handles data exchange with the client
 *  
 */

TestCase("LobbyResponseControllerTest", {
    setUp: function() {
        // Must be changed 
        this.lrc = new tddjs.server.controller.NEWlobbyResponseController();
        this.lobbyController = tddjs.server.controller.lobbyController.getInstance();
        
        this.lobby = new tddjs.server.model.lobby();
        this.lobby.setName("L1");
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
        
        // Mocking req and res
        
        this.req = {};
        this.req.headers["accept"] = "text/event-stream";
        
        this.req.get = function(header)
        {
            return this.req.headers[header.toLowerCase()];
        };
        
        this.res = {};
        this.res.append = function(field, value)
        {
            this.headers[field.toLowerCase()] = value;
        };
        

    },
    tearDown: function()
    {
    },
    
     "test lobbyResponseController should have function to accept EventSource": function() {
        assertFunction(this.lrc.acceptEventSource);
    },
    
     "test acceptEventSource should set correct response headers if header accepts text/eventstream ": function() {
         this.lrc.acceptEventSource(this.req, this.res);
         assertEquals(this.res.headers["content-type"], "text/event-stream");
         assertEquals(this.res.headers["cache-control"], "no-cache");
         assertEquals(this.res.headers["connection"], "keep-alive");
    }
});