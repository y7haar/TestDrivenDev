/* 
 * Testcases for the serverGameLoopController 
 */



TestCase("serverGameLoopControllerTest", {
    setUp: function() {
        this.serverGameLoop = new tddjs.server.controller.gameLoopController();
        // sgl = serverGameLoop
        this.url = "/serverGameLoopURL";
        
        this.sandbox = new tddjs.stubs.eventSourceSandbox();
        this.sandbox.addServer(this.url);
       
        this.fakeClient = function(eventSource){
            var es = eventSource;
            var writeCalled = false;
            var write = function(msg){
              writeCalled = true;
            };
        };
        
        
        this.map = generateMap();
        
    },
    tearDown: function(){
        this.serverGameLoop = null;
        this.sandbox.restore();
        this.map = null;
    },
    "test if this.serverGameLoop is instance of serverGameLoop" : function(){
        assertTrue(this.serverGameLoop instanceof tddjs.server.controller.gameLoopController);
    },    
    "test sgl should hold clients" : function(){
        assertNotUndefined(this.serverGameLoop.clients);
    },
    "test sgl should should implement addClient method" : function(){
        assertFunction(this.serverGameLoop.addClient);
    },    
    "test sgl addClient should add Clients to sgl" : function(){
       var player1 = new tddjs.client.player();
       player1.setName('Player1');
       var player2 = new tddjs.client.player();
       player2.setName('Player2');
       var player3 = new tddjs.client.player();
       player3.setName('Player3');
       var player4 = new tddjs.client.player();
       player4.setName('Player4');
         
       var glc1 = new tddjs.client.gameLoopController(this.map,player1, this.url);
       glc1.establishConnection();
       var glc2 = new tddjs.client.gameLoopController(this.map,player2, this.url);
       glc2.establishConnection();
       var glc3 = new tddjs.client.gameLoopController(this.map,player3, this.url);
       glc3.establishConnection();
       var glc4 = new tddjs.client.gameLoopController(this.map,player4, this.url);
       glc4.establishConnection();
       assertEquals(4, this.sandbox.server[this.url].clients.length);
       
       var client1 = new this.fakeClient(glc1.eventSource);
       var client2 = new this.fakeClient(glc2.eventSource);
       var client3 = new this.fakeClient(glc3.eventSource);
       var client4 = new this.fakeClient(glc4.eventSource);
       
       this.serverGameLoop.addClient(client1);
       this.serverGameLoop.addClient(client1);
       this.serverGameLoop.addClient(client1);
       this.serverGameLoop.addClient(client1);
       assertEquals(4, this.serverGameLoop.clients.length);
    }
});
    