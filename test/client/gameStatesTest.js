/* 
 *  Source-code for stateTest.js
 *  this code test the statePattern from gameLoopController
 *  there are 4 states PlaceingState, AttackingState, MovingState, WaitingState
 */


function generateMap()
{
    // map for testing    
    var map1 = new tddjs.client.map.map();
    var player1 = new tddjs.client.player();
    player1.setName('Peter');
    var player2 = new tddjs.client.player();
    player2.setName('Hanswurst');

    //Continent1--- EUROPA ----------------------
    var continent1 = new tddjs.client.map.continent();
    continent1.setName("Europa");

    var c1 = new tddjs.client.map.country();
    c1.setName("Country1");
    c1.setOwner(player1);

    var c2 = new tddjs.client.map.country();
    c2.setName("Country2");
    c2.setOwner(player2);

    var c3 = new tddjs.client.map.country();
    c3.setName("Country3");
    c3.setOwner(player2);

    continent1.addCountry(c1);
    continent1.addCountry(c2);
    continent1.addCountry(c3);

    //Continent2--- ASIEN ------------------------
    var continent2 = new tddjs.client.map.continent();
    continent2.setName("Asien");
    var c4 = new tddjs.client.map.country();
    c4.setName("Country4");
    c4.setOwner(player2);

    var c5 = new tddjs.client.map.country();
    c5.setName("Country5");
    c5.setOwner(player2);

    var c6 = new tddjs.client.map.country();
    c6.setName("Country6");
    c6.setOwner(player1);

    continent2.addCountry(c4);
    continent2.addCountry(c5);
    continent2.addCountry(c6);
    //Borders-------------------------------
    c1.addBorder(c2);
    c2.addBorder(c1);
    //add continets to map -----------------
    map1.addContinent(continent1);
    map1.addContinent(continent2);
    
    return map1;    
}

TestCase("stateTests", {
    setUp: function () {              
        this.placing = new tddjs.client.placingState();
        this.moving = new tddjs.client.movingState();
        this.attacking = new tddjs.client.attackingState();
        this.waiting = new tddjs.client.waitingState();  
    },
    tearDown: function ()
    {
        this.placing = null;
        this.moving = null;
        this.attacking = null;
        this.waiting = null; 
    },
    "test states should not be undefined": function () {
        assertNotUndefined(this.placing);
        assertNotUndefined(this.moving);
        assertNotUndefined(this.attacking);
        assertNotUndefined(this.waiting);
    },
    "test states should be instanace of theire state": function () {
        assertTrue(this.placing instanceof tddjs.client.placingState);
        assertTrue(this.moving instanceof tddjs.client.movingState);
        assertTrue(this.attacking instanceof tddjs.client.attackingState);
        assertTrue(this.waiting instanceof tddjs.client.waitingState);
    
    },
    "test states should be instance of prototype (abstract)state": function () {
        assertTrue(this.placing instanceof tddjs.client.abstractState);
        assertTrue(this.moving instanceof tddjs.client.abstractState);
        assertTrue(this.attacking instanceof tddjs.client.abstractState);
        assertTrue(this.waiting instanceof tddjs.client.abstractState);
     },
    "test states should not be instance of other states": function () {
        assertFalse(this.placing instanceof tddjs.client.movingState);
        assertFalse(this.moving instanceof tddjs.client.attackingState);
        assertFalse(this.attacking instanceof tddjs.client.waitingState);
        assertFalse(this.waiting instanceof tddjs.client.placingState);
    },
    "test states should inharit all functions": function () {

        assertNotUndefined(this.placing.placeUnits);
        assertNotUndefined(this.placing.attack);
        assertNotUndefined(this.placing.moveUnits);
        assertNotUndefined(this.placing.isMoveLegal);
        assertNotUndefined(this.placing.endPhase);
        assertNotUndefined(this.placing.toString);

        assertNotUndefined(this.attacking.placeUnits);
        assertNotUndefined(this.attacking.attack);
        assertNotUndefined(this.attacking.moveUnits);
        assertNotUndefined(this.attacking.isMoveLegal);
        assertNotUndefined(this.attacking.endPhase);
        assertNotUndefined(this.attacking.toString);

        assertNotUndefined(this.moving.placeUnits);
        assertNotUndefined(this.moving.attack);
        assertNotUndefined(this.moving.moveUnits);
        assertNotUndefined(this.moving.isMoveLegal);
        assertNotUndefined(this.moving.endPhase);
        assertNotUndefined(this.moving.toString);

        assertNotUndefined(this.waiting.placeUnits);
        assertNotUndefined(this.waiting.attack);
        assertNotUndefined(this.waiting.moveUnits);
        assertNotUndefined(this.waiting.isMoveLegal);
        assertNotUndefined(this.waiting.endPhase);
        assertNotUndefined(this.waiting.toString);
    }    
});

//---------    PLACING -------------------------------
TestCase("placingStateTests", {
    setUp: function () {
        this.placing = new tddjs.client.placingState();
        this.map1 = generateMap();
        this.availableUnits = 4;
        this.url = "/someURL";

        this.validMove = {
            type: 'placing',
            unitCount: 1,
            player: 'Peter',
            continent: 'Europa',
            country: 'Country1'
        };
        this.wrongOwnerMove = {
            type: 'placing',
            unitCount: 1,
            player: 'Hanswurst',
            continent: 'Europa',
            country: 'Country1'
        };
        this.wrongContinentMove = {
            type: 'placing',
            unitCount: 1,
            player: 'Peter',
            continent: 'Asien',
            country: 'Country1'
        };
        this.wrongCountryMove = {
            type: 'placing',
            unitCount: 1,
            player: 'Peter',
            continent: 'Europa',
            country: 'Country4'
        };
        this.wrongTypeMove = {
            type: 'winGame',
            unitCount: 1,
            player: 'Peter',
            continent: 'Europa',
            country: 'Country1'
        };
        this.wrongUnitCountMove = {
            type: 'placing',
            unitCount: 80,
            player: 'Peter',
            continent: 'Europa',
            country: 'Country1'
        };

        // ajax stub
        this.ajax = tddjs.util.ajax;
        this.sandbox = sinon.sandbox.create();
        this.sandbox.useFakeXMLHttpRequest();
    },
    tearDown: function(){
      this.placing = null;
      this.map1 = null;
      this.sandbox.restore();
    },
    "test should implement relevant functions": function () {
        assertFunction(this.placing.placeUnits);
        assertFunction(this.placing.isMoveLegal);
        assertFunction(this.placing.endPhase);
        assertFunction(this.placing.toString);
    },
    "test toString method shoulde return state name": function () {        
        assertEquals("placingState", this.placing.toString());
    },
    "test isMoveLegal shoulde throw exception if paramter is wrong": function () {
        var validMove = this.validMove;
        var placing = this.placing;
        var map = this.map1;
        var availableUnits = this.availableUnits;

        assertException(function () {
            placing.isMoveLegal();
        }, 'TypeError');

        assertException(function () {
            placing.isMoveLegal({}, availableUnits, validMove);
        }, 'TypeError');

        assertException(function () {
            placing.isMoveLegal(map, availableUnits, "place units somehwere");
        }, 'TypeError');

        assertException(function () {
            placing.isMoveLegal(map, "4asd", validMove);
        }, 'TypeError');

        assertNoException(function () {
            placing.isMoveLegal(map, availableUnits, validMove);
        });         
    },
    "test isMoveLegal should return false if Move is not Valid else true": function () {
        
        assertTrue(this.placing.isMoveLegal(this.map1,this.availableUnits,this.validMove));
        assertFalse(this.placing.isMoveLegal(this.map1,this.availableUnits,this.wrongContinentMove));
        assertFalse(this.placing.isMoveLegal(this.map1,this.availableUnits,this.wrongCountryMove));
        assertFalse(this.placing.isMoveLegal(this.map1,this.availableUnits,this.wrongOwnerMove));
        assertFalse(this.placing.isMoveLegal(this.map1,this.availableUnits,this.wrongTypeMove));
        assertFalse(this.placing.isMoveLegal(this.map1,this.availableUnits,this.wrongUnitCountMove));
    },
    "test placeUnits should throw exception if parameter is wrong ": function () { 
        var validMove = this.validMove;
        var placing = this.placing;
        var map = this.map1;
        var availableUnits = this.availableUnits;
        var url = this.url;
       

        assertException(function () {
            placing.placeUnits(map, availableUnits, validMove);
        }, 'TypeError');

        assertException(function () {
            placing.placeUnits(map, availableUnits, validMove, {url: "someURL"});
        }, 'TypeError');

        assertNoException(function () {
            placing.placeUnits(map, availableUnits, validMove, url);
        });
    },
    "test placeUnits should not POST if move is not Valid": function () {       
        assertFalse(this.placing.placeUnits(this.map1,this.availableUnits,this.wrongTypeMove,this.url));    
    },
    "test placeUnits should perform a POST request": function () { 
        assertEquals(0, this.sandbox.server.requests.length);        
    
        assertTrue(this.placing.placeUnits(this.map1,this.availableUnits,this.validMove,this.url));        
        
        assertEquals(1, this.sandbox.server.requests.length);
        assertEquals("POST", this.sandbox.server.requests[0].method);
        assertEquals(this.url, this.sandbox.server.requests[0].url);
        assertEquals("application/json;charset=utf-8", this.sandbox.server.requests[0].requestHeaders["Content-Type"]);
        
        console.log("AJAX STUB SINON OBJECT:");
        console.log(this.sandbox);
     },
     "test endPhase should perform a POST request": function () {         
        assertEquals(0, this.sandbox.server.requests.length);  
        
        this.placing.endPhase();
        
        assertEquals(1, this.sandbox.server.requests.length);
        assertEquals("POST", this.sandbox.server.requests[0].method);
        assertEquals(this.url, this.sandbox.server.requests[0].url);
        assertEquals("application/json;charset=utf-8", this.sandbox.server.requests[0].requestHeaders["Content-Type"]); 
         
     }
     
 });
 
 //--------- ATTACKING -----------------------------------
 TestCase("attackingStateTests", {
    setUp: function () {
        this.attacking = new tddjs.client.attackingState();
        this.map1 = generateMap();

        this.validMove = {
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
        this.wrongOwnerMove = {
            type: 'attack',
            from: {
                player: 'Peter',
                continent: 'Europa',
                country: 'Country1'
            },
            to: {
                player: 'PeterLustig',
                continent: 'Europa',
                country: 'Country2'
            }
        };
        this.wrongCountryMove = {
            type: 'attack',
            from: {
                player: 'Peter',
                continent: 'Europa',
                country: 'Country1'
            },
            to: {
                player: 'Hanswurst',
                continent: 'Europa',
                country: 'Country4'
            }
        };
        this.wrongBorderMove = {
            type: 'attack',
            from: {
                player: 'Peter',
                continent: 'Europa',
                country: 'Country1'
            },
            to: {
                player: 'Hanswurst',
                continent: 'Europa',
                country: 'Country3'
            }
        };
        this.wrongContinentMove = {
            type: 'attack',
            from: {
                player: 'Peter',
                continent: 'Europa',
                country: 'Country1'
            },
            to: {
                player: 'Hanswurst',
                continent: 'Asien',
                country: 'Country3'
            }
        };
        this.wrongTypeMove = {
            type: 'winGame',
            from: {
                player: 'Peter',
                continent: 'Europa',
                country: 'Country1'
            },
            to: {
                player: 'Hanswurst',
                continent: 'Asien',
                country: 'Country3'
            }
        };

    },
    tearDown: function () {
        this.attacking = null;
    },
    "test state should implement relevant functions": function () {
        assertFunction(this.attacking.attack);
        assertFunction(this.attacking.isMoveLegal);
        assertFunction(this.attacking.endPhase);
        assertFunction(this.attacking.toString); 
    },
    "test toString method should return state name": function () {        
        assertEquals("attackingState", this.attacking.toString()); 
    },
    "test state should throw exception if a paramter is wrong": function () {
        var validMove = this.validMove;
        var attacking = this.attacking;
        var map = this.map1;
        
        assertException(function(){
            attacking.isMoveLegal();
        },'TypeError');
        
        assertException(function(){
            attacking.isMoveLegal({},validMove);
        },'TypeError');    
        
        assertException(function(){
            attacking.isMoveLegal(map,"attack somewhere");
        },'TypeError');   
        
        assertNoException(function(){
            attacking.isMoveLegal(map,validMove);
        });
    },
    "test isMoveLegal should return false if move is not Valid else true": function () {        
        assertTrue(this.attacking.isMoveLegal(this.map1, this.validMove));
        assertFalse(this.attacking.isMoveLegal(this.map1, this.wrongBorderMove));
        assertFalse(this.attacking.isMoveLegal(this.map1, this.wrongContinentMove));
        assertFalse(this.attacking.isMoveLegal(this.map1, this.wrongCountryMove));
        assertFalse(this.attacking.isMoveLegal(this.map1, this.wrongOwnerMove));
        assertFalse(this.attacking.isMoveLegal(this.map1, this.wrongTypeMove));
    },
    "test attack shoulde throw exception if a parameter is wrong": function () {
        var validMove = this.validMove;
        var url = "/someURL";
        var map = this.map1;
        var attacking = this.attacking;
        
        assertException(function(){
            attacking.attack(map,validMove);
        },'TypeError');
        
        assertException(function(){
            attacking.attack(map,validMove,{url:"someURL"});
        },'TypeError');
        
        assertNoException(function(){
            attacking.attack(map,validMove,url);
        });
    },
    "test attack should perform a POST request": function () {
        var url = "/someURL";
        assertFalse(this.attacking.attack(this.map1,this.wrongTypeMove, url));
        assertTrue(this.attacking.attack(this.map1,this.validMove, url));
    }});

//--------------------------------------------
TestCase("movingStateTests", {
    "test moving state should implement relevant functions": function () {
        assertFunction(this.moving.moveUnits);
        assertFunction(this.moving.isMoveLegal);
        assertFunction(this.moving.endPhase);
        assertFunction(this.moving.toString);

    }});

//--------- WAITING -----------------------------------
TestCase("waitingStateTests", {
    "test waiting state should implement relevant functions": function () {
       assertFunction(this.waiting.toString);
    }
    
});

