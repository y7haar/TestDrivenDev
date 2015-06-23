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

        this.fakeClient = function (eventSource, aServer) {
            var server = aServer;
            var eventSourceIndex = server.clients.indexOf(eventSource);
           
            this.req = {};
            this.res = {};   
            var sendCalledBool = false;
            var data = "test";
            this.res.write = function (msg) {        
                sendCalledBool = true;
                
                var array = msg.split("\n");
                var event = array[0].split(":")[1];
                data = {data:array[1]};        
                server.sendMessage(eventSourceIndex,event, data);
                
            };
            Object.defineProperty(this, 'sendCalled', {
            get: function () {
                return sendCalledBool;
            }});
            Object.defineProperty(this, 'data', {
            get: function () {
                return data;
            }});
   
        };
        this.map = generateMap();

        this.player1 = new tddjs.client.player();
        this.player1.setName('Player1');
        this.player2 = new tddjs.client.player();
        this.player2.setName('Player2');
        this.player3 = new tddjs.client.player();
        this.player3.setName('Player3');
        this.player4 = new tddjs.client.player();
        this.player4.setName('Player4');

        this.glc1 = new tddjs.client.gameLoopController(this.map, this.player1, this.url);
        this.glc1.establishConnection();
        this.glc2 = new tddjs.client.gameLoopController(this.map, this.player2, this.url);
        this.glc2.establishConnection();
        this.glc3 = new tddjs.client.gameLoopController(this.map, this.player3, this.url);
        this.glc3.establishConnection();
        this.glc4 = new tddjs.client.gameLoopController(this.map, this.player4, this.url);
        this.glc4.establishConnection();

        this.client1 = new this.fakeClient(this.glc1.eventSource,this.sandbox.server[this.url]);
        this.client2 = new this.fakeClient(this.glc2.eventSource,this.sandbox.server[this.url]);
        this.client3 = new this.fakeClient(this.glc3.eventSource,this.sandbox.server[this.url]);
        this.client4 = new this.fakeClient(this.glc4.eventSource,this.sandbox.server[this.url]);  
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
       this.serverGameLoop.addClient(this.client1);
       this.serverGameLoop.addClient(this.client2);
       this.serverGameLoop.addClient(this.client3);
       this.serverGameLoop.addClient(this.client4);
       assertEquals(4, this.serverGameLoop.clients.length);       
       assertEquals([this.client1,this.client2,this.client3,this.client4], this.serverGameLoop.clients);       
    },
    "test if fakeClient res.write was called": function(){
        this.serverGameLoop.addClient(this.client1);
        
        assertFalse(this.serverGameLoop.clients[0].sendCalled);
        var data = "event:changetoattacking\ndata:change to attacking state\n\n";
        this.serverGameLoop.clients[0].res.write(data);
        assertTrue(this.serverGameLoop.clients[0].sendCalled);
    },
    "test if sgl send msg to Client": function(){
        this.serverGameLoop.addClient(this.client1);
        
        var data = "event:changetoattacking\ndata:change to attacking state\n\n";
        assertEquals(0,this.glc1.fromServerLogs.length);
        this.serverGameLoop.clients[0].res.write(data);
        assertEquals(1,this.glc1.fromServerLogs.length);
    },
    "test if client changes state after sglc send changeToAttackState event": function(){
        this.serverGameLoop.addClient(this.client1);
        
        assertEquals("waitingState", this.glc1.getStateName());
        var data = "event:changetoattacking\ndata:change to attacking state\n\n";
        this.serverGameLoop.clients[0].res.write(data);
        assertEquals("attackingState", this.glc1.getStateName());       
    }
});
    