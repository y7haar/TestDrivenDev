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
        
        this.validPlacingMove = {
            type: 'placing',
            unitCount: 1,
            player: 'Peter',
            continent: 'Europa',
            country: 'Country1'
        };
        this.validAttackMove = {
            type: 'attack',
            from: {
                player: 'Peter',
                continent: 'Europa',
                country: 'Country1'
            },
            to: {
                player: 'Hanswurst',
                continent: 'Europa',
                country: 'Country2'
            }
        };
        

        this.fakeClient = function (eventSource, aServer, aName) {
            var name = aName;
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
                var message = array[1].substring(5,array[1].length);                
                data = (message);           
                server.sendMessage(eventSourceIndex,event, {data:data});                
            };
            Object.defineProperty(this, 'sendCalled', {
            get: function () {
                return sendCalledBool;
            }});
            Object.defineProperty(this, 'data', {
            get: function () {
                return data;
            }});
            Object.defineProperty(this, 'name', {
            get: function () {
                return name;
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

        this.client1 = new this.fakeClient(this.glc1.eventSource,this.sandbox.server[this.url],this.player1.getName());
        this.client2 = new this.fakeClient(this.glc2.eventSource,this.sandbox.server[this.url],this.player1.getName());
        this.client3 = new this.fakeClient(this.glc3.eventSource,this.sandbox.server[this.url],this.player1.getName());
        this.client4 = new this.fakeClient(this.glc4.eventSource,this.sandbox.server[this.url],this.player1.getName());  
    },
    tearDown: function(){
        this.serverGameLoop = null;
        this.sandbox.restore();
        this.map = null;
    },
    "test if this.serverGameLoop is instance of serverGameLoop" : function(){
        assertTrue(this.serverGameLoop instanceof tddjs.server.controller.gameLoopController);
    },    
    "test sgl should hold map" : function(){
        assertNotUndefined(this.serverGameLoop.map);
    },
    "test sgl should implement setMap function" : function(){
        assertFunction(this.serverGameLoop.setMap);
    },
    "test sgl.map should be null at init" : function(){
        assertEquals(null,this.serverGameLoop.map);
    },
    "test sgl.setMap should set map" : function(){
        assertEquals(null,this.serverGameLoop.map);
        this.serverGameLoop.setMap(this.map);
        assertEquals(this.map, this.serverGameLoop.map);
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
    "test if sgl.fakeClient send msg to Client": function(){
        this.serverGameLoop.addClient(this.client1);
        
        var data = "event:changetoattacking\ndata:change to attacking state\n\n";
        assertEquals(0,this.glc1.fromServerLogs.length);
        this.serverGameLoop.clients[0].res.write(data);
        assertEquals(1,this.glc1.fromServerLogs.length);
    },
    "test if client changes state after sglcfakeClient send changeToAttackState event": function(){
        this.serverGameLoop.addClient(this.client1);
        
        assertEquals("waitingState", this.glc1.getStateName());
        var data = "event:changetoattacking\ndata:change to attacking state\n\n";
        this.serverGameLoop.clients[0].res.write(data);
        assertEquals("attackingState", this.glc1.getStateName());       
    },
    "test sgl should hold currentClient Name" : function(){
        assertNotUndefined(this.serverGameLoop.currentClient);
    },
    "test sgl.currentClient should be null at init" : function(){
        assertEquals(null,this.serverGameLoop.currentClient);
    },
    "test sgl.currentClient should be 0 after allConnected is true" : function(){
        assertEquals(null,this.serverGameLoop.currentClient);
        this.serverGameLoop.setMaxPlayers(1);
        this.serverGameLoop.addClient(this.client1);
        assertEquals(0, this.serverGameLoop.currentClient);
    },
    
    "test sglc should hold maxPlayers": function(){
        assertNotUndefined(this.serverGameLoop.maxPlayers);               
    },
    "test sglc.maxPlayers should be -1 at init": function(){
        assertEquals(-1,this.serverGameLoop.maxPlayers);               
    },
    "test sglc should implement setMaxPlayers function": function(){
        assertFunction(this.serverGameLoop.setMaxPlayers);               
    },
   
    "test sglc.setMaxPlayers should set maxPlayer": function(){
        assertEquals(-1,this.serverGameLoop.maxPlayers);
        this.serverGameLoop.setMaxPlayers(2);
        assertEquals(2,this.serverGameLoop.maxPlayers);
    },
    "test sglc should hold boolean allConnected": function(){
        assertNotUndefined(this.serverGameLoop.allConnected);       
    },
    "test sglc.allConnected should be false at init": function(){
        assertFalse(this.serverGameLoop.allConnected);       
    },
    "test sglc.allConnected should be true if all Clients Connected": function(){
        assertFalse(this.serverGameLoop.allConnected);
        this.serverGameLoop.setMaxPlayers(2);
        this.serverGameLoop.addClient(this.client1);
        assertFalse(this.serverGameLoop.allConnected);
        this.serverGameLoop.addClient(this.client1);
        assertTrue(this.serverGameLoop.allConnected);
    },
    "test sglc should change client1 to placingState if allConnected is true": function(){
        this.serverGameLoop.setMaxPlayers(2);
        this.serverGameLoop.addClient(this.client1);
        
        assertFalse(this.serverGameLoop.allConnected);
        assertEquals("waitingState", this.glc1.getStateName());
        
        this.serverGameLoop.addClient(this.client2);
        assertTrue(this.serverGameLoop.allConnected);
        
        assertEquals("waitingState", this.glc2.getStateName());
        assertEquals("placingState", this.glc1.getStateName());
    },
    "test sglc should implement messageAll function":function()
    {
        assertFunction(this.serverGameLoop.messageAll);
    },
    "test sglc should implement playerMove function": function(){
        assertFunction(this.serverGameLoop.playerMove);               
    },
    "test sglc.playerMove should react to endPhase move with Status 200 ": function(){
        this.serverGameLoop.setMaxPlayers(1);
        this.serverGameLoop.addClient(this.client1);
        assertEquals("placingState" ,this.glc1.getStateName());
        
        assertEquals(0,this.glc1.toServerLogs.length);
        this.glc1.endPhase();
        // tell the server to not Response automaticly 
        this.sandbox.server[this.url].setHandleResponse(false);
        this.sandbox.update();
        
        assertEquals(0,this.glc1.toServerLogs.length);
        assertEquals(0, this.sandbox.server[this.url].requests[4].status);
        
        var sandbox = this.sandbox;
        var url = this.url;
        
        var fakeReq = {
            body: sandbox.server[url].requests[4].requestBody
        };
        var fakeRes = {
            status: function(aCode)
            {
                var code = aCode;       
                send = function(msg)
                {                  
                   sandbox.server[url].requests[4].respond(code,msg,"");                    
                };
                return {send:send};
        }};   
 
        this.serverGameLoop.playerMove(fakeReq, fakeRes);
   
        assertEquals(1,this.glc1.toServerLogs.length);
        assertEquals(200, this.sandbox.server[this.url].requests[4].status);        
    },
    "test sglc.playerMove(endPhase:placing) should be attacking after call": function(){
        this.serverGameLoop.setMaxPlayers(1);
        this.serverGameLoop.addClient(this.client1);       
     
        assertEquals("placingState" ,this.glc1.getStateName());
        
        this.glc1.endPhase();
        // tell the server to not Response automaticly 
        this.sandbox.server[this.url].setHandleResponse(false);
        this.sandbox.update();
        
        var sandbox = this.sandbox;
        var url = this.url;
        var fakeReq = {
           
            body: sandbox.server[url].requests[4].requestBody
        };
        var fakeRes = {
            status: function(aCode)
            {
                var code = aCode;       
                send = function(msg)
                {                  
                   sandbox.server[url].requests[4].respond(code,msg,"");                    
                };
                return {send:send};
        }};   
 
        this.serverGameLoop.playerMove(fakeReq, fakeRes);
        
        assertEquals("attackingState", this.glc1.getStateName());        
    },
    "test sglc.playerMove(endPhase:attacking) should be waiting after call": function(){
        this.serverGameLoop.setMaxPlayers(2);
        this.serverGameLoop.addClient(this.client1);
        this.serverGameLoop.addClient(this.client2);
        
        var data = "event:changetoattacking\ndata:change to attacking state\n\n";
        this.serverGameLoop.clients[0].res.write(data);
        
        assertEquals("attackingState" ,this.glc1.getStateName());     
        
        var sandbox = this.sandbox;
        var url = this.url;        
  
        this.glc1.endPhase();
        // tell the server to not Response automaticly 
        this.sandbox.server[this.url].setHandleResponse(false);
        this.sandbox.update();
         
        var fakeReq = {
           
            body: sandbox.server[url].requests[4].requestBody
        };
        var fakeRes = {
            status: function(aCode)
            {
                var code = aCode;       
                send = function(msg)
                {                  
                   sandbox.server[url].requests[4].respond(code,msg,"");                    
                };
                return {send:send};
        }};         
    
        this.serverGameLoop.playerMove(fakeReq, fakeRes);        
        assertEquals("waitingState", this.glc1.getStateName());        
    },
    "test sglc should change currentState to the next Client if prev.Client changed to waitingState":function()
    {
        this.serverGameLoop.setMaxPlayers(2);
        this.serverGameLoop.addClient(this.client1);
        this.serverGameLoop.addClient(this.client2);        
        
        // changeing client to attacking 
        var data = "event:changetoattacking\ndata:change to attacking state\n\n";
        this.serverGameLoop.clients[0].res.write(data);
        
        assertEquals(0,this.serverGameLoop.currentClient);
        assertEquals("attackingState", this.glc1.getStateName());
        assertEquals("waitingState", this.glc2.getStateName());
        
        this.glc1.endPhase();
        // tell the server to not Response automaticly 
        this.sandbox.server[this.url].setHandleResponse(false);
        this.sandbox.update();
        
        var sandbox = this.sandbox;
        var url = this.url;  
        
        var fakeReq = {
           
            body: sandbox.server[url].requests[4].requestBody
        };
        var fakeRes = {
            status: function(aCode)
            {
                var code = aCode;       
                send = function(msg)
                {                  
                   sandbox.server[url].requests[4].respond(code,msg,"");                    
                };
                return {send:send};
        }};        
    
        this.serverGameLoop.playerMove(fakeReq, fakeRes);
        // client1 should now be in waiting state --> currentClient should change to 1 because its client2 turn
        assertEquals(1,this.serverGameLoop.currentClient);
        // cleint should now be in waiting statte because endPhase in attacking ==> waiting 
        assertEquals("waitingState", this.glc1.getStateName());
        // if currentClient changes state to waiting next client should be in placing
        assertEquals("placingState", this.glc2.getStateName());        
    },
    "test sglc.currentState should start at Client1 if last client changed to waitingState":function(){
        this.serverGameLoop.setMaxPlayers(1);
        this.serverGameLoop.addClient(this.client1);
        
        var data = "event:changetoattacking\ndata:change to attacking state\n\n";
        this.serverGameLoop.clients[0].res.write(data);

        var sandbox = this.sandbox;
        var url = this.url;        
  
        this.glc1.endPhase();
        // tell the server to not Response automaticly 
        this.sandbox.server[this.url].setHandleResponse(false);
        this.sandbox.update();
         
        var fakeReq = {
           
            body: sandbox.server[url].requests[4].requestBody
        };
        var fakeRes = {
            status: function(aCode)
            {
                var code = aCode;       
                send = function(msg)
                {                  
                   sandbox.server[url].requests[4].respond(code,msg,"");                    
                };
                return {send:send};
        }};         
    
        this.serverGameLoop.playerMove(fakeReq, fakeRes);        
        assertEquals(0, this.serverGameLoop.currentClient);          
    },
    "test sglc.playerMove should react to makeMove(placingType) move with Status 200 ": function(){
        this.serverGameLoop.setMaxPlayers(1);
        this.serverGameLoop.addClient(this.client1);
        
        assertEquals(0,this.glc1.toServerLogs.length);
        this.glc1.makeMove(this.validPlacingMove);
        
        // tell the server to not Response automaticly 
        this.sandbox.server[this.url].setHandleResponse(false);
        this.sandbox.update();
        
        assertEquals(0,this.glc1.toServerLogs.length);
        assertEquals(0, this.sandbox.server[this.url].requests[4].status);
        
        var sandbox = this.sandbox;
        var url = this.url;
        
        var fakeReq = {
            body: sandbox.server[url].requests[4].requestBody
        };
        var fakeRes = {
            status: function(aCode)
            {
                var code = aCode;       
                send = function(msg)
                {                  
                   sandbox.server[url].requests[4].respond(code,msg,"");                    
                };
                return {send:send};
        }};   
 
        this.serverGameLoop.playerMove(fakeReq, fakeRes);
   
        assertEquals(1,this.glc1.toServerLogs.length);
        assertEquals(200, this.sandbox.server[this.url].requests[4].status);      
    },
    "test sglc.playerMove should react to makeMove(attckingType) move with Status 200 ": function(){
        this.serverGameLoop.setMaxPlayers(1);
        this.serverGameLoop.addClient(this.client1);
        
        assertEquals(0,this.glc1.toServerLogs.length);
        this.glc1.makeMove(this.validAttackMove);
        
        // tell the server to not Response automaticly 
        this.sandbox.server[this.url].setHandleResponse(false);
        this.sandbox.update();
        
        assertEquals(0,this.glc1.toServerLogs.length);
        assertEquals(0, this.sandbox.server[this.url].requests[4].status);
        
        var sandbox = this.sandbox;
        var url = this.url;
        
        var fakeReq = {
            body: sandbox.server[url].requests[4].requestBody
        };
        var fakeRes = {
            status: function(aCode)
            {
                var code = aCode;       
                send = function(msg)
                {                  
                   sandbox.server[url].requests[4].respond(code,msg,"");                    
                };
                return {send:send};
        }};   
 
        this.serverGameLoop.playerMove(fakeReq, fakeRes);
   
        assertEquals(1,this.glc1.toServerLogs.length);
        assertEquals(200, this.sandbox.server[this.url].requests[4].status);      
    }
    
    
  
    
});
    