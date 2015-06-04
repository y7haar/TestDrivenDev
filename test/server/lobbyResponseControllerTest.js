/* 
 *  Testcases for LobbyResponseController
 *  
 *  This class handles data exchange with the client
 *  
 */

TestCase("LobbyResponseControllerTest", {
    setUp: function () {
        this.lobbyResponseController = new tddjs.server.controller.lobbyResponseController();
        
    }, 
    tearDown: function ()
    {
    },
    
    "test lobbyResponseController should not be undefined after constructor call": function () {  
        assertObject(this.lobbyResponseController);
    },
    
    "test lobbyResponseController should have function to respond to a new lobby request": function () {  
        assertFunction(this.lobbyResponseController.respondNewLobby);
    },
    
    "test respondNewLobby should have parameter of type string, else throw Error": function () {  
        var controller = this.lobbyResponseController;
        
        assertException(function() { controller.respondNewLobby(3); }, "TypeError");
    },
    
    //respondNewLobby should throw Error if given data is not valid
    "test ": function () {  
        var controller = this.lobbyResponseController;
        
        var req = "";
        assertException(function() { controller.respondNewLobby(req); }, "Error");
        
        req = "{}";
        assertException(function() { controller.respondNewLobby(req); }, "Error");
        
         var obj = { type: "create" };
        req = JSON.stringify(obj);
        assertException(function() { controller.respondNewLobby(req); }, "Error");
        
        var obj = { type: "create", player: 6 };
        req = JSON.stringify(obj);
        assertException(function() { controller.respondNewLobby(req); }, "Error");
        
        var obj = { type: "create", player: {} };
        req = JSON.stringify(obj);
        assertException(function() { controller.respondNewLobby(req); }, "Error");
        
         var obj = { type: "create", player: { name: 4 } };
        req = JSON.stringify(obj);
        assertException(function() { controller.respondNewLobby(req); }, "Error");
        
        var obj = { type: "create", player: { name: "Peter" } };
        req = JSON.stringify(obj);
        assertException(function() { controller.respondNewLobby(req); }, "Error");
        
        var obj = { type: "create", player: { name: "Peter", color: 3 } };
        req = JSON.stringify(obj);
        assertException(function() { controller.respondNewLobby(req); }, "Error");
        
        var obj = { type: "create", player: { name: "Peter", color: "#ffffff" } };
        req = JSON.stringify(obj);
        assertNoException(function() { controller.respondNewLobby(req); });
    }
});


