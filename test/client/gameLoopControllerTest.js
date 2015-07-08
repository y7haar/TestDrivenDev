/* 
 Testcases for the Gameloop
 */

TestCase("GameLoopConstructorTests", {
     setUp: function () {             
        this.map = generateMap();      
        this.player1 = new tddjs.client.player();
        this.url = "/serverURL";     
     
    },
    tearDown: function(){     
        this.map = null;
        this.player1 = null;
        this.url = null;
    },
    "test gameLoop should throw exception if Map argument is wrong": function () {
        var player = this.player1;
        var url = this.url;
        var fakeMap = {mapName:'PremiumMap'};
        
        assertException(function(){
            new tddjs.client.gameLoopController(fakeMap,player, url);
        },"TypeError");
        
        assertException(function(){
            new tddjs.client.gameLoopController(null,player, url);
        },"TypeError");
        
        assertException(function(){
            var x;
            new tddjs.client.gameLoopController(x,player,url);
        },"TypeError");
    },
    "test gameLoop should throw exception if Player argument is wrong": function () {
        var map = this.map;
        var url = this.url;
        var fakePlayer = {name:'HansWurst'};
        
        assertException(function(){
            new tddjs.client.gameLoopController(map,fakePlayer, url);
        },"TypeError");
        
        assertException(function(){
            new tddjs.client.gameLoopController(map,null, url);
        },"TypeError");
        
        assertException(function(){
            var x;
            new tddjs.client.gameLoopController(map,x,url);
        },"TypeError");
    },
    "test gameLoop should throw exception if Url argument is wrong": function () {
        var map = this.map;
        var player = this.player1;
        
        assertException(function(){
            new tddjs.client.gameLoopController(map,player, {url:'someURL'});
        },"TypeError");
        
        assertException(function(){
            new tddjs.client.gameLoopController(map,player, null);
        },"TypeError");
        
        assertException(function(){
            var x;
            new tddjs.client.gameLoopController(map,player,x);
        },"TypeError");
    },
    "test gameLoop should not throw exception constructor-Parameter are right": function () {
        var map = this.map;
        var player = this.player1;
        var url = this.url;
        assertNoException(function(){
           new tddjs.client.gameLoopController(map,player,url); 
        });
    }    
});

TestCase("GameLoopControllerTests", {        
    setUp: function () {             
        this.map = generateMap();      
        this.player1 = new tddjs.client.player();
        this.url = "/serverURL";
        
        this.gameLoop =  new tddjs.client.gameLoopController(this.map, this.player1, this.url);
        
        this.sandbox = new tddjs.stubs.eventSourceSandbox();
        this.sandbox.addServer(this.url);
        
    },
    tearDown: function(){
        this.gameLoop = null;
        this.map = null;
        this.player1 = null;
        this.url = null;
        this.sandbox.restore();
        this.sandbox = null;
    },
    "test gameloop should not be undefined": function () {      
        assertObject(this.gameLoop);      
    },
    "test gameLoop should be instance of gameLoopControler": function () {        
        assertTrue(this.gameLoop instanceof tddjs.client.gameLoopController);
    },
    "test gameLoop should hold reference of gameController": function () {        
         assertNotUndefined(this.gameLoop.gameController);
    },
    "test gameLoop setUi should be implemented": function () {        
         assertFunction(this.gameLoop.setGameController);
    },    
    "test gameLoop getMap should be implemented": function () {        
         assertFunction(this.gameLoop.getMap);
    },
    "test gameLoop getMap should return Map": function () {        
         assertSame(this.map, this.gameLoop.getMap());
    },
    "test gameLoop getPlayer should be implemented": function () {        
         assertFunction(this.gameLoop.getPlayer);
    },
    "test gameLoop getPlayer should return Player": function () {        
         assertSame(this.player1, this.gameLoop.getPlayer());
    },
    "test gameLoop getUrl should be implemented": function () {        
         assertFunction(this.gameLoop.getUrl);
    },
    "test gameLoop getUrl should return Url": function () {        
         assertSame(this.url, this.gameLoop.getUrl());
    },    
    "test gameLoop should implement establishConneciton function": function () {        
        assertFunction(this.gameLoop.establishConnection);
    },
    "test gameLoop should hold EventSource obj": function () {
        assertNotUndefined(this.gameLoop.eventSource);
    },
    "test gameLoop EventSource obj should be null": function () {
        assertNotUndefined(this.gameLoop.eventSource);
        assertEquals(null, this.gameLoop.eventSource);
    },
    "test gameLoop establishConnection should create a connected EventSource": function () {        
        assertEquals(0,this.sandbox.server[this.url].clients.length);        
        this.gameLoop.establishConnection();
        assertNotEquals(null, this.gameLoop.eventSource);
        assertTrue(this.gameLoop.eventSource instanceof EventSource);        
        assertEquals(1,this.sandbox.server[this.url].clients.length);
        assertSame(this.gameLoop.eventSource,this.sandbox.server[this.url].clients[0]);        
        assertEquals(1, this.gameLoop.eventSource.readyState);
    },
    "test gameLoop stablishConnection should call addAllEventListner function": function () {
        assertNotUndefined(this.gameLoop.isAddAllEventListnerCalled);
        assertFalse(this.gameLoop.isAddAllEventListnerCalled);
        this.gameLoop.establishConnection();
        assertTrue(this.gameLoop.isAddAllEventListnerCalled);        
    },
    "test gameLoop created EventSource should implement onchangetoplacing event": function () {
        this.gameLoop.establishConnection();
        assertNotUndefined(this.gameLoop.eventSource.onchangetoplacing);
        assertFunction(this.gameLoop.eventSource.onchangetoplacing);
    },
    "test gameLoop created EventSource should implement onchangetoattacking event": function () {
        this.gameLoop.establishConnection();
        assertNotUndefined(this.gameLoop.eventSource.onchangetoattacking);
        assertFunction(this.gameLoop.eventSource.onchangetoattacking);
    },
    "test gameLoop created EventSource should implement onchangetowaiting event": function () {
        this.gameLoop.establishConnection();
        assertNotUndefined(this.gameLoop.eventSource.onchangetowaiting);
        assertFunction(this.gameLoop.eventSource.onchangetowaiting);
    },
    "test gameLoop created EventSource should implement onattackresult event": function () {
        this.gameLoop.establishConnection();
        assertNotUndefined(this.gameLoop.eventSource.onattackresult);
        assertFunction(this.gameLoop.eventSource.onattackresult);
    },
    "test gameLoop created EventSource should implement onplaceunits event": function () {
        this.gameLoop.establishConnection();
        assertNotUndefined(this.gameLoop.eventSource.onplaceunits);
        assertFunction(this.gameLoop.eventSource.onplaceunits);
    },
    "test gameLoop should hold current State, waitingState at init": function () {        
         assertTrue(this.gameLoop.currentState instanceof tddjs.client.waitingState);
    },   
    "test gameLoop should implement getStateName function": function () {        
         assertFunction(this.gameLoop.getStateName);
    },
    "test gameLoop getStateName should return current State name, waitingState at init": function () {        
         assertEquals("waitingState",this.gameLoop.getStateName());
    }
});


TestCase("GameLoopCommunicationTests", {
    setUp: function () {
        this.map = generateMap();      
        this.player1 = new tddjs.client.player();
        this.url = "/serverURL";
        
        this.gameLoop =  new tddjs.client.gameLoopController(this.map, this.player1, this.url);
        
        this.sandbox = new tddjs.stubs.eventSourceSandbox();
        this.sandbox.addServer(this.url);        
        this.gameLoop.establishConnection();
        
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
        
        this.validPlacingMove = {
            type: 'placing',
            unitCount: 1,
            player: 'Peter',
            continent: 'Europa',
            country: 'Country1'
        };
       
    },
    tearDown: function(){
        this.gameLoop = null;
        this.map = null;
        this.player1 = null;
        this.url = null;
        this.sandbox.restore();
        this.sandbox = null;
    },    
    
    "test State should change to attacking state if server trigger changeToAttacking event": function () {       
        
        assertEquals("waitingState", this.gameLoop.getStateName());
        assertTrue(this.gameLoop.currentState instanceof tddjs.client.waitingState);
         
        this.sandbox.server[this.url].sendMessage(0,"changetoattacking",{data:"change to Attacking-State"});
         
        assertEquals("attackingState", this.gameLoop.getStateName());
        assertTrue(this.gameLoop.currentState instanceof tddjs.client.attackingState);
    },
    "test State should change to placing state if server trigger changeToPlacing event": function () {        
        assertEquals("waitingState", this.gameLoop.getStateName());
        assertTrue(this.gameLoop.currentState instanceof tddjs.client.waitingState);
        var message = JSON.stringify({unitCount:4}); 
        this.sandbox.server[this.url].sendMessage(0,"changetoplacing",{data:message});
         
        assertEquals("placingState", this.gameLoop.getStateName());
        assertTrue(this.gameLoop.currentState instanceof tddjs.client.placingState);
    },
    "test State should change to waiting state if server trigger changeToWaiting event": function () {
        var message = JSON.stringify({unitCount:4}); 
        this.sandbox.server[this.url].sendMessage(0,"changetoplacing",{data:message});
        assertEquals("placingState", this.gameLoop.getStateName());
        assertTrue(this.gameLoop.currentState instanceof tddjs.client.placingState);
        
        this.sandbox.server[this.url].sendMessage(0,"changetowaiting",{data:"change to waiting-State"});
        assertEquals("waitingState", this.gameLoop.getStateName());
        assertTrue(this.gameLoop.currentState instanceof tddjs.client.waitingState);         
     
    },
    "test gameLoop should hold a array of all messages from server": function () {
        assertNotUndefined(this.gameLoop.fromServerLogs);
    },
    "test gameLoop.fromServerLogs should be empty at init": function () {
        assertEquals(0,this.gameLoop.fromServerLogs.length);
    },
    "test gameLoop.fromServerLogs should increase if the server send a message": function () {
        assertEquals(0,this.gameLoop.fromServerLogs.length);
        this.sandbox.server[this.url].sendMessage(0,"changetowaiting",{data:"change to waiting-State"});
        assertEquals(1,this.gameLoop.fromServerLogs.length);
        this.sandbox.server[this.url].sendMessage(0,"changetowaiting",{data:"change to waiting-State"});
        assertEquals(2,this.gameLoop.fromServerLogs.length);
    },
    "test gameLoop.fromServerLogs saved message and sended msg should be same": function () {
        var msg = {data:"change to waiting-State"};
        this.sandbox.server[this.url].sendMessage(0,"changetowaiting",msg);
        assertEquals(1,this.gameLoop.fromServerLogs.length);
        assertSame(msg, this.gameLoop.fromServerLogs[0]);
    },
    "test gameLoop should hold a array of all messages to server": function () {
        assertNotUndefined(this.gameLoop.toServerLogs);
    },
    "test gameLoop.toServerLogs should be empty at init": function () {
        assertEquals(0,this.gameLoop.toServerLogs.length);
    },
    "test gameLoop.toServerLogs should increase if message send to server": function () {
        assertEquals(0,this.gameLoop.toServerLogs.length);
        this.gameLoop.endPhase();
        this.sandbox.update();
        assertEquals(1, this.gameLoop.toServerLogs.length);
        this.gameLoop.endPhase();
        this.sandbox.update();
        assertEquals(2, this.gameLoop.toServerLogs.length);
    },
    "test gameLoop should implement endPhase function": function () {
        assertNotUndefined(this.gameLoop.endPhase);
    },    
    "test gameLoop.endPhase should save sended move in Logs if Server got msg = Status 200": function () {
        assertEquals(0, this.gameLoop.toServerLogs.length);
        assertEquals(1,this.sandbox.server[this.url].requests.length);
        
        this.gameLoop.endPhase();
        
        assertEquals(0, this.gameLoop.toServerLogs.length);
        assertEquals(1,this.sandbox.server[this.url].requests.length);
        
        this.sandbox.update();
        
        assertEquals(1, this.gameLoop.toServerLogs.length);
        assertEquals(2,this.sandbox.server[this.url].requests.length);       
    }
    ,"test gameLoop.endPhase should send Msg to server that player want to end current Phase": function () {
        this.gameLoop.endPhase();         
        assertEquals(1,this.sandbox.server[this.url].requests.length);
        
        this.sandbox.update();        

        assertEquals(2,this.sandbox.server[this.url].requests.length); // 2 because establshing the connection is 1 request  
        assertEquals(this.gameLoop.toServerLogs[0], JSON.parse(this.sandbox.server[this.url].requests[1].requestBody));
    },
    "test gameLoop should implement makeMove function": function () {
        assertFunction(this.gameLoop.makeMove);
    },    
    "test gemeLoop.makeMove should call isMoveValid from currentState": function () {
        var state = this.gameLoop.currentState;
        state.isMoveLegal = stubFn();
        
        assertFalse(state.isMoveLegal.called);        
        this.gameLoop.makeMove();
        assertTrue(state.isMoveLegal.called);
    },
    "test (waiting)gameLoop.makeMove should always return false": function () {
        assertFalse(this.gameLoop.makeMove({type:"WinningMove"}));
    },
    "test (placing)gameLoop.makeMove should return false (wrongMove)": function () {
        var message = JSON.stringify({unitCount:4}); 
        this.sandbox.server[this.url].sendMessage(0,"changetoplacing",{data:message});
        assertEquals("placingState",this.gameLoop.getStateName());
        
        assertFalse(this.gameLoop.makeMove({type:"WinningMove"}));
    },
    "test (placing)gameLoop.makeMove should return true(validMove)": function () {
        var message = JSON.stringify({unitCount:4}); 
        this.sandbox.server[this.url].sendMessage(0,"changetoplacing",{data:message});
        assertEquals("placingState",this.gameLoop.getStateName());
        
        assertTrue(this.gameLoop.makeMove(this.validPlacingMove));
    },
    "test (placing)gameLoop.makeMove should POST to server": function () {
        var message = JSON.stringify({unitCount:4}); 
        this.sandbox.server[this.url].sendMessage(0,"changetoplacing",{data:message});
        assertEquals("placingState",this.gameLoop.getStateName());  
        
        this.gameLoop.makeMove(this.validPlacingMove);
        this.sandbox.update();
        assertEquals(2,this.sandbox.server[this.url].requests.length);
    },
    "test (placing)gameLoop.makeMove move should be same on server": function () {
        var message = JSON.stringify({unitCount:4}); 
        this.sandbox.server[this.url].sendMessage(0,"changetoplacing",{data:message});
        assertEquals("placingState",this.gameLoop.getStateName());  
        
        this.gameLoop.makeMove(this.validPlacingMove);
        this.sandbox.update();
        assertEquals(this.validPlacingMove, JSON.parse(this.sandbox.server[this.url].requests[1].requestBody));
    },
    "test (attacking)gameLoop.makeMove should return false(wrongMove)": function () {
        this.sandbox.server[this.url].sendMessage(0,"changetoattacking",{data:"change to Attacking-State"});
        assertEquals("attackingState",this.gameLoop.getStateName());
        
        assertFalse(this.gameLoop.makeMove({type:"WinningMove"}));
    },   
    "test (attacking)gameLoop.makeMove should return true(validMove)": function () {
        this.sandbox.server[this.url].sendMessage(0,"changetoattacking",{data:"change to Attacking-State"});
        assertEquals("attackingState",this.gameLoop.getStateName());
        
        assertTrue(this.gameLoop.makeMove(this.validAttackMove));
    },
    "test (attacking)gameLoop.makeMove should POST to server": function () {
        this.sandbox.server[this.url].sendMessage(0,"changetoattacking",{data:"change to Attacking-State"});
        assertEquals("attackingState",this.gameLoop.getStateName());
        
        assertTrue(this.gameLoop.makeMove(this.validAttackMove));
        this.sandbox.update();
        assertEquals(2, this.sandbox.server[this.url].requests.length);
    },
    "test (attacking)gameLoop.makeMove move should be same on server": function () {
        this.sandbox.server[this.url].sendMessage(0,"changetoattacking",{data:"change to Attacking-State"});
        assertEquals("attackingState",this.gameLoop.getStateName());
        
        assertTrue(this.gameLoop.makeMove(this.validAttackMove));
        this.sandbox.update();
        assertEquals(this.validAttackMove, JSON.parse(this.sandbox.server[this.url].requests[1].requestBody));
    },    
    "test gameLoop.makeMove should save sended move in Logs if Server got msg = Status 200": function () {
        assertEquals(0, this.gameLoop.toServerLogs.length);
        assertEquals(1,this.sandbox.server[this.url].requests.length);
        
        this.sandbox.server[this.url].sendMessage(0,"changetoattacking",{data:"change to Attacking-State"});
   
        assertTrue(this.gameLoop.makeMove(this.validAttackMove));
        assertEquals(0, this.gameLoop.toServerLogs.length);
        assertEquals(1,this.sandbox.server[this.url].requests.length);
        
        this.sandbox.update();
        assertEquals(2,this.sandbox.server[this.url].requests.length);
        assertEquals(1, this.gameLoop.toServerLogs.length);
        assertEquals(this.gameLoop.toServerLogs[0], JSON.parse(this.sandbox.server[this.url].requests[1].requestBody));     
    },
    "test gameLoop.eventSource event attackResult should be called by Server": function(){
        assertEquals(0,this.gameLoop.fromServerLogs.length);
        var attackResultData = {
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

        this.sandbox.server[this.url].sendMessage(0,"attackResult",{data:JSON.stringify(attackResultData)});
        assertEquals(1,this.gameLoop.fromServerLogs.length);
        assertEquals({data:JSON.stringify(attackResultData)}, this.gameLoop.fromServerLogs[0]);
    },
    "test gameLoop.eventSource event placeUnits should be called by Server": function(){
        assertEquals(0,this.gameLoop.fromServerLogs.length);
        var placeUnitData = {
            type: "placing",
            player: "Peter",
            change: {
                continent: "Europa",
                country: "Country1",
                unitCount: 14
            }
        };

        this.sandbox.server[this.url].sendMessage(0,"placeUnits",{data:JSON.stringify(placeUnitData)});
        assertEquals(1,this.gameLoop.fromServerLogs.length);
        assertEquals({data:JSON.stringify(placeUnitData)}, this.gameLoop.fromServerLogs[0]);
    }   
});

TestCase("GameLoopModifyMapTests", {
    setUp: function()
    {
        this.map1 = new tddjs.client.map.map();
       
        this.player1 = new tddjs.client.player();
        this.player1.setName('Peter');
        
        this.player2 = new tddjs.client.player();
        this.player2.setName('Hanswurst');

        //Continent1--- PREMIUMISLAND ----------------------
        this.continent1 = new tddjs.client.map.continent();
        this.continent1.setName("PremiumIsland");
        this.c1 = new tddjs.client.map.country();
        this.c1.setName("Country1");
        this.c1.setOwner(this.player1);
        this.c1.setUnitCount(10);
        
        this.c2 = new tddjs.client.map.country();
        this.c2.setName("Country2");
        this.c2.setOwner(this.player2);
        this.c2.setUnitCount(5);
        
        this.continent1.addCountry(this.c1);
        this.continent1.addCountry(this.c2);
        
        this.map1.addContinent(this.continent1);
        
        this.attackResultData = {
            type:"attacking",
            attacker:{
                player:this.player1.getName(),
                outcome:"winner"               
            },
            defender:{
                player:this.player2.getName(),
                outcome:"loser"
            },
            changes:[
                {
                    continent:"PremiumIsland",
                    country:"Country1",
                    unitCount:1,
                    owner:this.player1.getName()
                },
                {
                    continent:"PremiumIsland",
                    country:"Country2",
                    unitCount:6,
                    owner:this.player1.getName()
                }
            ]                    
        };
        //console.log(this.attackResultData);
        this.placeUnitData = {
            type:"placing",
            player:this.player1.getName(),
            change:{
                continent:"PremiumIsland",
                country:"Country1",
                unitCount:14
            }
        };
        //console.log(this.placeUnitData);

        this.map2 = this.map1;
        this.url = "/modifyMapTestURL";
        this.gameLoop = new tddjs.client.gameLoopController(this.map1, this.player1, this.url);
        this.sandbox = new tddjs.stubs.eventSourceSandbox();
        this.sandbox.addServer(this.url);     
        
        this.gameLoop.establishConnection();
    },
    tearDown: function()
    {
        this.map1 = null;
        this.gameLoop = null;
        this.url = null;
        this.sandbox.restore();
    },
    "test gameLoop should change right unitCount of Country when server Trigger placeUnit event": function()
    {
        //before Changes
        assertEquals(10,(this.gameLoop.getMap().getContinent("PremiumIsland").getCountry("Country1").getUnitCount()));
        
        assertEquals(0, this.gameLoop.fromServerLogs.length);
        this.sandbox.server[this.url].sendMessage(0,"placeUnits", {data:JSON.stringify(this.placeUnitData)});
        assertEquals(1, this.gameLoop.fromServerLogs.length);
        //after changes
        assertEquals(14,(this.gameLoop.getMap().getContinent("PremiumIsland").getCountry("Country1").getUnitCount()));     
    },
    "test gameLoop should change map correctly when server trigger attackResult event": function()
    {
        //before Changes
        assertEquals(10, this.map1.getContinent("PremiumIsland").getCountry("Country1").getUnitCount());
        assertEquals("Peter", this.map1.getContinent("PremiumIsland").getCountry("Country1").getOwner().getName());
        
        assertEquals(5, this.map1.getContinent("PremiumIsland").getCountry("Country2").getUnitCount());
        assertEquals("Hanswurst", this.map1.getContinent("PremiumIsland").getCountry("Country2").getOwner().getName());
        
        assertEquals(0, this.gameLoop.fromServerLogs.length);
        this.sandbox.server[this.url].sendMessage(0,"attackResult", {data:JSON.stringify(this.attackResultData)});
        assertEquals(1, this.gameLoop.fromServerLogs.length);
        // after Changes
        assertEquals(1, this.map1.getContinent("PremiumIsland").getCountry("Country1").getUnitCount());
        assertEquals("Peter", this.map1.getContinent("PremiumIsland").getCountry("Country1").getOwner().getName());
        
        assertEquals(6, this.map1.getContinent("PremiumIsland").getCountry("Country2").getUnitCount());
        assertEquals("Peter", this.map1.getContinent("PremiumIsland").getCountry("Country2").getOwner().getName());
    }
    
});
