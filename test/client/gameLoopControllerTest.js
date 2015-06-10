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

TestCase("GameLoopTests", {        
    setUp: function () {             
        this.map = generateMap();      
        this.player1 = new tddjs.client.player();
        this.url = "/serverURL";
        
        this.gameLoop =  new tddjs.client.gameLoopController(this.map, this.player1, this.url); 
    },
    tearDown: function(){
        this.gameLoop = null;
        this.map = null;
        this.player1 = null;
        this.url = null;
    },
    "test gameloop should not be undefined": function () {      
        assertObject(this.gameLoop);      
    },
    "test gameLoop should be instance of gameLoopControler": function () {        
        assertTrue(this.gameLoop instanceof tddjs.client.gameLoopController);
    }
});
    
 TestCase("GameLoopFunctionTests", {
     setUp: function () {             
        this.map = generateMap();      
        this.player1 = new tddjs.client.player();
        this.url = "/serverURL";
        
        this.gameLoop =  new tddjs.client.gameLoopController(this.map, this.player1, this.url); 
    },
    tearDown: function(){
        this.gameLoop = null;
        this.map = null;
        this.player1 = null;
        this.url = null;
    }, 
    "test gameloop should implemet isMoveLegal Method": function () {
        assertFunction(this.gameLoop.isMoveLegal);
    },
    "test gameloop should implement getStateName Method": function () {
        assertFunction(this.gameLoop.getStateName);
    },
    "test gameloop.getStateName should return currentStateName": function () {
        //init State is WaitingState
        assertEquals("waitingState", this.gameLoop.getStateName());          
    } 
});