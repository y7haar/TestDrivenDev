/* 
 Testcases for the Gameloop
 */

TestCase("GameLoopConstTests", {
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
    "test gameLoop should throw exception if Map prameter is wrong": function () {
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
    "test gameLoop should throw exception if Player prameter is wrong": function () {
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
    "test gameLoop should throw exception if Url prameter is wrong": function () {
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
    }
});

/*
TestCase("GameLoopEventHandlerTests", {
    setUp: function () {             
        this.map = generateMap();      
        this.player1 = new tddjs.client.player();
        this.url = "/serverURL";
        
        this.gameLoop =  new tddjs.client.gameLoopController(this.map, this.player1, this.url);
        
        this.sandbox = tddjs.stubs.eventSourceSandbox();
        this.sandbox.addServer(this.url);
    },
    tearDown: function(){
        this.gameLoop = null;
        this.map = null;
        this.player1 = null;
        this.url = null;
        this.sandbox.restore();
        this.sandbox = null;
    }   
});
*/