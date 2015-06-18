/* 
 *  Testcases for LobbyEventSourceController
 *  
 *  This class handles data exchange with the Server via Event Source
 *  
 */

TestCase("LobbyEventSourceControllerTest", {
    setUp: function() {
        this.lobbyEventSourceController = new tddjs.client.controller.lobbyEventSourceController();

    },
    tearDown: function(){
    },
    
    "test LobbyEventSourceController should not be undefined after constructor call": function() {
        assertObject(this.lobbyEventSourceController);
    }
    
    });