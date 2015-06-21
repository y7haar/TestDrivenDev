module.exports = {
    setUp: function (callback) {
        require("./../../src/server/tdd");
        require("./../../src/server/serverLobby");
        require("./../../src/server/lobbyController");
        require("./../../src/server/serverPlayer");
        
        this.lobbyController = tddjs.server.controller.lobbyController.getInstance();
        this.lobby1 = new tddjs.server.model.lobby();
        this.lobby2 = new tddjs.server.model.lobby();
        
        this.lobby1.setId(0);
        this.lobby2.setId(1);
        
        this.player1 = new tddjs.server.player();
        this.player2 = new tddjs.server.player();
        this.player1.setId(1);
        this.player2.setId(1);
        this.lobby1.addPlayer(this.player1);
        this.lobby2.addPlayer(this.player2);
        this.lobby1.setLeader(this.player1);
        this.lobby2.setLeader(this.player2);
        
        this.lobbyController.addLobby(this.lobby1);
        this.lobbyController.addLobby(this.lobby2);
        
        this.json = this.lobbyController.serialize();
        
        this.client = require('nodeunit-httpclient').create({
        port: 8080,
        path: '/lobbies',   //Base URL for requests
        status: 200,    //Test each response is OK (can override later)
        headers: {      //Test that each response must have these headers (can override later)
            
        }
        });

        callback();
    },
    tearDown: function (callback) {
        
        this.lobbyController.removeLobby(this.lobby1);
        this.lobbyController.removeLobby(this.lobby2);

        callback();
    },
    
    "test server should respond with status 200 on GET /lobbies": function (test) {
        this.client.get(test, "", function(res) {
        test.done();
        });
    },
    
    "test server should respond with collection of all lobbies on GET /lobbies ": function (test) {
        this.client.get(test, "", function(res) {
        
        test.equal(res.body, this.json);
            
        test.done();
        });
    }
};
