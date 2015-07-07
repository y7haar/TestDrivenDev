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
            unitCount: 12,
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
        
        this.attackResultData = {
            type:"attacking",
            attacker:{
                player:"Peter",
                outcome:"winner"               
            },
            defender:{
                player:"Hanswurst",
                outcome:"loser"
            },
            changes:[
                {
                    continent:"Europa",
                    country:"Country1",
                    unitCount:1,
                    owner:"Peter"
                },
                {
                    continent:"Europa",
                    country:"Country2",
                    unitCount:6,
                    owner:"Hanswurst"
                }
            ]                    
        };      
        this.placeUnitData = {
            type:"placing",
            player:"Peter",
            change:{
                continent:"Europa",
                country:"Country1",
                unitCount:12
            }
        };        
  
        this.fakeRes = function (eventSource, aServer) 
        {
            var server = aServer;
            var eventSourceIndex = server.clients.indexOf(eventSource);
          
            var sendCalledBool = false;
            var data = "";
            this.write = function (msg) {        
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
        };
        
        //CLIENT___________________________________
        this.player1 = new tddjs.client.player();
        this.player1.setName('Peter');
        this.player2 = new tddjs.client.player();
        this.player2.setName('Hanswurst');
        this.player3 = new tddjs.client.player();
        this.player3.setName('Player3');
        this.player4 = new tddjs.client.player();
        this.player4.setName('Player4');
        
        
        //clientMAP
        this.clientMap = new tddjs.client.map.map();  
        
        
        //Continent1-------------------------------------
        this.continent1 = new tddjs.client.map.continent();
        this.continent1.setName("Europa");
        
        this.c1 = new tddjs.client.map.country();
        this.c1.setName("Country1");
        this.c1.setOwner(this.player1);
        this.c1.setUnitCount(10);
        
        this.c2 = new tddjs.client.map.country();
        this.c2.setName("Country2");
        this.c2.setOwner(this.player2);
        this.c2.setUnitCount(2);
        
        this.c3 = new tddjs.client.map.country();
        this.c3.setName("Country3");
        this.c3.setOwner(this.player1);
        this.c3.setUnitCount(1);        
        // Borders        
        this.c1.addBorder(this.c2);
        this.c2.addBorder(this.c1);
        
        this.c1.addBorder(this.c3);
        this.c3.addBorder(this.c1);
        
        this.continent1.addCountry(this.c1);
        this.continent1.addCountry(this.c2);
        this.continent1.addCountry(this.c3);
        
        this.clientMap.addContinent(this.continent1);
        
        //client gameloopController
        
        this.glc1 = new tddjs.client.gameLoopController(this.clientMap, this.player1, this.url);
        this.glc1.establishConnection();
        this.glc2 = new tddjs.client.gameLoopController(this.clientMap, this.player2, this.url);
        this.glc2.establishConnection();
        this.glc3 = new tddjs.client.gameLoopController(this.clientMap, this.player3, this.url);
        this.glc3.establishConnection();
        this.glc4 = new tddjs.client.gameLoopController(this.clientMap, this.player4, this.url);
        this.glc4.establishConnection();

        //SERVER_____________________________________
        this.serverPlayer1 = new tddjs.server.player();
        this.serverPlayer1.setName(this.player1.getName());
        this.serverPlayer1.setResponseObject(new this.fakeRes(this.glc1.eventSource,this.sandbox.server[this.url]));
        
        this.serverPlayer2 = new tddjs.server.player();
        this.serverPlayer2.setName(this.player2.getName());
        this.serverPlayer2.setResponseObject(new this.fakeRes(this.glc2.eventSource,this.sandbox.server[this.url]));
        
        this.serverPlayer3 = new tddjs.server.player();
        this.serverPlayer3.setName(this.player3.getName());
        this.serverPlayer3.setResponseObject(new this.fakeRes(this.glc3.eventSource,this.sandbox.server[this.url]));
        
        this.serverPlayer4 = new tddjs.server.player();
        this.serverPlayer4.setName(this.player4.getName());
        this.serverPlayer4.setResponseObject(new this.fakeRes(this.glc4.eventSource,this.sandbox.server[this.url]));
        
        //server map ________________________________
        this.map = new tddjs.server.map.map();  
        
        
        //Continent1-------------------------------------
        this.continent1 = new tddjs.server.map.continent();
        this.continent1.setName("Europa");
        
        this.c1 = new tddjs.server.map.country();
        this.c1.setName("Country1");
        this.c1.setOwner(this.serverPlayer1);
        this.c1.setUnitCount(10);
        
        this.c2 = new tddjs.server.map.country();
        this.c2.setName("Country2");
        this.c2.setOwner(this.serverPlayer2);
        this.c2.setUnitCount(2);
        
        this.c3 = new tddjs.server.map.country();
        this.c3.setName("Country3");
        this.c3.setOwner(this.serverPlayer1);
        this.c3.setUnitCount(1);        
        // Borders        
        this.c1.addBorder(this.c2);
        this.c2.addBorder(this.c1);
        
        this.c1.addBorder(this.c3);
        this.c3.addBorder(this.c1);
        
        this.continent1.addCountry(this.c1);
        this.continent1.addCountry(this.c2);
        this.continent1.addCountry(this.c3);
        
        this.map.addContinent(this.continent1);

        var sandbox = this.sandbox;
        var url = this.url;
        
        this.getFakeReq = function (index)
        {
            var fakeReq = {
                body: JSON.parse(sandbox.server[url].requests[index].requestBody)
            };

            return fakeReq;
        };

        this.getFakeRes = function (index)
        {
            var fakeRes = {
                status: function (aCode)
                {
                    var code = aCode;
                    send = function (msg)
                    {
                        sandbox.server[url].requests[index].respond(code, msg, "");
                    };
                    return {send: send};
                }};

            return fakeRes;
        };
        
    },
    tearDown: function(){
        this.serverGameLoop = null;
        this.sandbox.restore();
        this.map = null;
        this.clientMap = null;
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
       this.serverGameLoop.addClient(this.serverPlayer1);
       this.serverGameLoop.addClient(this.serverPlayer2);
       this.serverGameLoop.addClient(this.serverPlayer3);
       this.serverGameLoop.addClient(this.serverPlayer4);
       assertEquals(4, this.serverGameLoop.clients.length);       
       assertEquals([this.serverPlayer1,this.serverPlayer2,this.serverPlayer3,this.serverPlayer4], this.serverGameLoop.clients);       
    },
    "test if fakeClient res.write was called": function(){
        this.serverGameLoop.addClient(this.serverPlayer1);
        
        assertFalse(this.serverGameLoop.clients[0].getResponseObject().sendCalled);
        var data = "event:changetoattacking\ndata:change to attacking state\n\n";
        this.serverGameLoop.clients[0].getResponseObject().write(data);
        assertTrue(this.serverGameLoop.clients[0].getResponseObject().sendCalled);
    },
    "test if sgl.fakeClient send msg to Client": function(){
        this.serverGameLoop.addClient(this.serverPlayer1);
        
        var data = "event:changetoattacking\ndata:change to attacking state\n\n";
        assertEquals(0,this.glc1.fromServerLogs.length);
        this.serverGameLoop.clients[0].getResponseObject().write(data);
        assertEquals(1,this.glc1.fromServerLogs.length);
    },
    "test if client changes state after sglcfakeClient send changeToAttackState event": function(){
        this.serverGameLoop.addClient(this.serverPlayer1);
        
        assertEquals("waitingState", this.glc1.getStateName());
        var data = "event:changetoattacking\ndata:change to attacking state\n\n";
        this.serverGameLoop.clients[0].getResponseObject().write(data);
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
        this.serverGameLoop.addClient(this.serverPlayer1);
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
        this.serverGameLoop.addClient(this.serverPlayer1);
        assertFalse(this.serverGameLoop.allConnected);
        this.serverGameLoop.addClient(this.serverPlayer1);
        assertTrue(this.serverGameLoop.allConnected);
    },
    "test sglc should change serverPlayer1 to placingState if allConnected is true": function(){
        this.serverGameLoop.setMaxPlayers(2);
        this.serverGameLoop.addClient(this.serverPlayer1);
        
        assertFalse(this.serverGameLoop.allConnected);
        assertEquals("waitingState", this.glc1.getStateName());
        
        this.serverGameLoop.addClient(this.serverPlayer2);
        assertTrue(this.serverGameLoop.allConnected);
        
        assertEquals("waitingState", this.glc2.getStateName());
        assertEquals("placingState", this.glc1.getStateName());
    },
    "test sglc should implement playerMove function": function(){
        assertFunction(this.serverGameLoop.playerMove);               
    },
    "test sglc.playerMove should react to endPhase move with Status 200 ": function(){
        this.serverGameLoop.setMaxPlayers(1);
        this.serverGameLoop.addClient(this.serverPlayer1);
        assertEquals("placingState" ,this.glc1.getStateName());
        
        assertEquals(0,this.glc1.toServerLogs.length);
        this.glc1.endPhase();
        // tell the server to not Response automaticly 
        this.sandbox.server[this.url].setHandleResponse(false);
        this.sandbox.update();
        
        assertEquals(0,this.glc1.toServerLogs.length);
        assertEquals(0, this.sandbox.server[this.url].requests[4].status);        
        
        var fakeReq = this.getFakeReq(4);
        var fakeRes = this.getFakeRes(4);
        this.serverGameLoop.playerMove(fakeReq, fakeRes);
   
        assertEquals(1,this.glc1.toServerLogs.length);
        assertEquals(200, this.sandbox.server[this.url].requests[4].status);        
    },
    "test sglc.playerMove(endPhase:placing) should be attacking after call": function(){
        this.serverGameLoop.setMaxPlayers(1);
        this.serverGameLoop.addClient(this.serverPlayer1);       
     
        assertEquals("placingState" ,this.glc1.getStateName());
        
        this.glc1.endPhase();
        // tell the server to not Response automaticly 
        this.sandbox.server[this.url].setHandleResponse(false);
        this.sandbox.update();  
     
        var fakeReq = this.getFakeReq(4);
        var fakeRes = this.getFakeRes(4); 
        this.serverGameLoop.playerMove(fakeReq, fakeRes);
        
        assertEquals("attackingState", this.glc1.getStateName());        
    },
    "test sglc.playerMove(endPhase:attacking) should be waiting after call": function(){
        this.serverGameLoop.setMaxPlayers(2);
        this.serverGameLoop.addClient(this.serverPlayer1);
        this.serverGameLoop.addClient(this.serverPlayer2);
        
        var data = "event:changetoattacking\ndata:change to attacking state\n\n";
        this.serverGameLoop.clients[0].getResponseObject().write(data);
        
        assertEquals("attackingState" ,this.glc1.getStateName());    

        this.glc1.endPhase();
        // tell the server to not Response automaticly 
        this.sandbox.server[this.url].setHandleResponse(false);
        this.sandbox.update();        
   
        var fakeReq = this.getFakeReq(4);
        var fakeRes = this.getFakeRes(4);
        this.serverGameLoop.playerMove(fakeReq, fakeRes);
     
        assertEquals("waitingState", this.glc1.getStateName());        
    },
    "test sglc should change currentState to the next Client if prev.Client changed to waitingState":function()
    {
        this.serverGameLoop.setMaxPlayers(2);
        this.serverGameLoop.addClient(this.serverPlayer1);
        this.serverGameLoop.addClient(this.serverPlayer2);        
        
        // changeing client to attacking 
        var data = "event:changetoattacking\ndata:change to attacking state\n\n";
        this.serverGameLoop.clients[0].getResponseObject().write(data);
        
        assertEquals(0,this.serverGameLoop.currentClient);
        assertEquals("attackingState", this.glc1.getStateName());
        assertEquals("waitingState", this.glc2.getStateName());
        
        this.glc1.endPhase();
        // tell the server to not Response automaticly 
        this.sandbox.server[this.url].setHandleResponse(false);
        this.sandbox.update();
        
        var fakeReq = this.getFakeReq(4);
        var fakeRes = this.getFakeRes(4);       
    
        this.serverGameLoop.playerMove(fakeReq, fakeRes);
        // serverPlayer1 should now be in waiting state --> currentClient should change to 1 because its serverPlayer2 turn
        assertEquals(1,this.serverGameLoop.currentClient);
        // cleint should now be in waiting statte because endPhase in attacking ==> waiting 
        assertEquals("waitingState", this.glc1.getStateName());
        // if currentClient changes state to waiting next client should be in placing
        assertEquals("placingState", this.glc2.getStateName());        
    },
    "test sglc.currentState should start at Client1 if last client changed to waitingState":function(){
        this.serverGameLoop.setMaxPlayers(1);
        this.serverGameLoop.addClient(this.serverPlayer1);
        
        var data = "event:changetoattacking\ndata:change to attacking state\n\n";
        this.serverGameLoop.clients[0].getResponseObject().write(data);     
  
        this.glc1.endPhase();
        // tell the server to not Response automaticly 
        this.sandbox.server[this.url].setHandleResponse(false);
        this.sandbox.update();
         
        var fakeReq = this.getFakeReq(4);
        var fakeRes = this.getFakeRes(4);        
    
        this.serverGameLoop.playerMove(fakeReq, fakeRes);        
        assertEquals(0, this.serverGameLoop.currentClient);          
    },
    "test sglc.playerMove should react to makeMove(placingType) move with Status 200 ": function(){
        this.serverGameLoop.setMaxPlayers(1);
        this.serverGameLoop.addClient(this.serverPlayer1);
        
        assertEquals(0,this.glc1.toServerLogs.length);
        this.glc1.makeMove(this.validPlacingMove);
        
        // tell the server to not Response automaticly 
        this.sandbox.server[this.url].setHandleResponse(false);
        this.sandbox.update();
        
        assertEquals(0,this.glc1.toServerLogs.length);
        assertEquals(0, this.sandbox.server[this.url].requests[4].status);
        
        var fakeReq = this.getFakeReq(4);
        var fakeRes = this.getFakeRes(4);  
 
        this.serverGameLoop.playerMove(fakeReq, fakeRes);
   
        assertEquals(1,this.glc1.toServerLogs.length);
        assertEquals(200, this.sandbox.server[this.url].requests[4].status);      
    },
    "test sglc.playerMove should react to makeMove(attckingType) move with Status 200 ": function(){
        this.serverGameLoop.setMaxPlayers(1);
        this.serverGameLoop.addClient(this.serverPlayer1);
        
        var data = "event:changetoattacking\ndata:change to attacking state\n\n";
        this.serverGameLoop.clients[0].getResponseObject().write(data);
        
        assertEquals("attackingState", this.glc1.getStateName());
        
        assertEquals(0,this.glc1.toServerLogs.length);
        this.glc1.makeMove(this.validAttackMove);
        
        // tell the server to not Response automaticly 
        this.sandbox.server[this.url].setHandleResponse(false);
        this.sandbox.update();        
  
        assertEquals(0,this.glc1.toServerLogs.length);
        assertEquals(0, this.sandbox.server[this.url].requests[4].status);
        
        var fakeReq = this.getFakeReq(4);
        var fakeRes = this.getFakeRes(4); 
 
        this.serverGameLoop.playerMove(fakeReq, fakeRes);
   
        assertEquals(1,this.glc1.toServerLogs.length);
        assertEquals(200, this.sandbox.server[this.url].requests[4].status);      
    },
    "test sglc.playerMove(placing) should send move back without validate": function(){
        this.serverGameLoop.setMaxPlayers(1);
        this.serverGameLoop.addClient(this.serverPlayer1);       

        assertEquals(1,this.glc1.fromServerLogs.length);
        this.glc1.makeMove(this.validPlacingMove);
        
        // tell the server to not Response automaticly 
        this.sandbox.server[this.url].setHandleResponse(false);
        this.sandbox.update();
        
        assertEquals(1,this.glc1.fromServerLogs.length);
        
        var fakeReq = this.getFakeReq(4);
        var fakeRes = this.getFakeRes(4);  
 
        this.serverGameLoop.playerMove(fakeReq, fakeRes);
   
        assertEquals(2,this.glc1.fromServerLogs.length);
        assertEquals(this.placeUnitData, JSON.parse(this.glc1.fromServerLogs[1].data));      
    },
    "test sglc.playerMove(attacking) should send move back without validate": function(){
        this.serverGameLoop.setMaxPlayers(1);
        this.serverGameLoop.addClient(this.serverPlayer1);
        
        var data = "event:changetoattacking\ndata:change to attacking state\n\n";
        this.serverGameLoop.clients[0].getResponseObject().write(data);
        
        assertEquals(2,this.glc1.fromServerLogs.length);
        this.glc1.makeMove(this.validAttackMove);
        
        // tell the server to not Response automaticly 
        this.sandbox.server[this.url].setHandleResponse(false);
        this.sandbox.update();
        
        assertEquals(2,this.glc1.fromServerLogs.length);
        
        var fakeReq = this.getFakeReq(4);
        var fakeRes = this.getFakeRes(4);  
 
        this.serverGameLoop.playerMove(fakeReq, fakeRes);
   
        assertEquals(3,this.glc1.fromServerLogs.length);
        assertEquals(this.attackResultData, JSON.parse(this.glc1.fromServerLogs[2].data));      
    },
    "test sglc should implement messageAllClients function":function()
    {
        assertFunction(this.serverGameLoop.messageAllClients);
    },
    "test sglc should hold bool messageAllClientsCalled":function()
    {
        assertNotUndefined(this.serverGameLoop.messageAllClientsCalled);
        assertFalse(this.serverGameLoop.messageAllClientsCalled);
    },
    "test sglc messageAllClientsCalled should be true after messageAllClients was called":function()
    {
       assertFalse(this.serverGameLoop.messageAllClientsCalled);
       this.serverGameLoop.messageAllClients();
       assertTrue(this.serverGameLoop.messageAllClientsCalled);    
    },
    "test sglc messageAllClientsCalled should be called when playerMove(placing)": function ()
    {
        assertFalse(this.serverGameLoop.messageAllClientsCalled);
        
        this.serverGameLoop.setMaxPlayers(1);
        this.serverGameLoop.addClient(this.serverPlayer1);
   
        this.glc1.makeMove(this.validPlacingMove);
        // tell the server to not Response automaticly 
        this.sandbox.server[this.url].setHandleResponse(false);
        this.sandbox.update();
        console.log( this.sandbox.server[this.url].requests);
        var fakeReq = this.getFakeReq(4);
        var fakeRes = this.getFakeRes(4);

        this.serverGameLoop.playerMove(fakeReq, fakeRes);
        assertTrue(this.serverGameLoop.messageAllClientsCalled);
    },
    "test sglc messageAllClientsCalled should be called when playerMove(attacking)": function ()
    {
        assertFalse(this.serverGameLoop.messageAllClientsCalled);
        
        this.serverGameLoop.setMaxPlayers(1);
        this.serverGameLoop.addClient(this.serverPlayer1);
        
        var data = "event:changetoattacking\ndata:change to attacking state\n\n";
        this.serverGameLoop.clients[0].getResponseObject().write(data);
        
        this.glc1.makeMove(this.validAttackMove);
        // tell the server to not Response automaticly 
        this.sandbox.server[this.url].setHandleResponse(false);
        this.sandbox.update();
        console.log( this.sandbox.server[this.url].requests);
        var fakeReq = this.getFakeReq(4);
        var fakeRes = this.getFakeRes(4);

        this.serverGameLoop.playerMove(fakeReq, fakeRes);
        assertTrue(this.serverGameLoop.messageAllClientsCalled);
    },
    "test sglc messageAllClients should send move to all clients":function()
    {  
        this.serverGameLoop.setMaxPlayers(3);
        this.serverGameLoop.addClient(this.serverPlayer1);
        this.serverGameLoop.addClient(this.serverPlayer2);
        this.serverGameLoop.addClient(this.serverPlayer3);
        
        this.glc1.makeMove(this.validPlacingMove);
        // tell the server to not Response automaticly 
        this.sandbox.server[this.url].setHandleResponse(false);
        this.sandbox.update();
        var fakeReq = this.getFakeReq(4);
        var fakeRes = this.getFakeRes(4);

        this.serverGameLoop.playerMove(fakeReq, fakeRes);        
       
        assertEquals(this.placeUnitData, JSON.parse(this.glc1.fromServerLogs[1].data));   
        assertEquals(this.placeUnitData, JSON.parse(this.glc2.fromServerLogs[0].data));   
        assertEquals(this.placeUnitData, JSON.parse(this.glc3.fromServerLogs[0].data));
        
        // ending Phase
        this.glc1.endPhase();
        this.sandbox.update();
        
        var fakeReq = this.getFakeReq(5);
        var fakeRes = this.getFakeRes(5);
        
        this.serverGameLoop.playerMove(fakeReq, fakeRes);
        
        // now in attacking Phase and make attack move
        this.glc1.makeMove(this.validAttackMove);
        this.sandbox.update();      

        var fakeReq = this.getFakeReq(6);
        var fakeRes = this.getFakeRes(6);
        
        this.serverGameLoop.playerMove(fakeReq, fakeRes);
        // test if attackmove is on all Clients
        assertEquals(this.attackResultData, JSON.parse(this.glc1.fromServerLogs[3].data));   
        assertEquals(this.attackResultData, JSON.parse(this.glc2.fromServerLogs[1].data));   
        assertEquals(this.attackResultData, JSON.parse(this.glc3.fromServerLogs[1].data));           
    },
    "test sglc should implement method to validate a move":function()
    {
        assertFunction(this.serverGameLoop.validateMove);
    },
    
    
    "test sglc should implement method to place units":function()
    {
        assertFunction(this.serverGameLoop.placeUnits);
    },
    
    "test sglc should implement method to perform an attack":function()
    {
        assertFunction(this.serverGameLoop.attack);
    },
    
     "test sglc should implement method to get new unit stock":function()
    {
        assertFunction(this.serverGameLoop.getUnitStockByPlayer);
    }
});
    