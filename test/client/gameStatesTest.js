/* 
 *  Source-code for stateTest.js
 *  this code test the statePattern from gameLoopController
 *  there are 4 states PlaceingState, AttackingState, MovingState, WaitingState
 */

TestCase("stateTest", {
    setUp: function () {
        
        this.placing = new tddjs.client.placingState();
        this.moving = new tddjs.client.movingState();
        this.attacking = new tddjs.client.attackingState();
        this.waiting = new tddjs.client.waitingState();       
        
        // map for testing
        this.map1 = new tddjs.client.map.map();
        this.player1 = new tddjs.client.player();
        this.player1.setName('Peter');
        this.player2 = new tddjs.client.player();
        this.player2.setName('Hanswurst');
        
        //Continent1--- EUROPA ----------------------
        this.continent1 = new tddjs.client.map.continent();
        this.continent1.setName("Europa");
        
        this.c1 = new tddjs.client.map.country();
        this.c1.setName("Country1");
        this.c1.setOwner(this.player1);
        
        this.c2 = new tddjs.client.map.country();
        this.c2.setName("Country2");
        this.c2.setOwner(this.player2);
        
        this.c3 = new tddjs.client.map.country();
        this.c3.setName("Country3");
        this.c3.setOwner(this.player2);
        
        this.continent1.addCountry(this.c1);
        this.continent1.addCountry(this.c2);
        this.continent1.addCountry(this.c3);
        
        //Continent2--- ASIEN ------------------------
        this.continent2 = new tddjs.client.map.continent();
        this.continent2.setName("Asien");
        this.c4 = new tddjs.client.map.country();
        this.c4.setName("Country4");
        this.c4.setOwner(this.player2);
        
        this.c5 = new tddjs.client.map.country();
        this.c5.setName("Country5");            
        this.c5.setOwner(this.player2);
        
        this.c6 = new tddjs.client.map.country();
        this.c6.setName("Country6");
        this.c6.setOwner(this.player1);
        
        this.continent2.addCountry(this.c4);
        this.continent2.addCountry(this.c5);
        this.continent2.addCountry(this.c6);
        //Borders-------------------------------
        this.c1.addBorder(this.c2);
        //add continets to map -----------------
        this.map1.addContinent(this.continent1);
        this.map1.addContinent(this.continent2);
        
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
     "test states should be instanace of theire state and prototype": function () {  
        assertTrue(this.placing instanceof tddjs.client.placingState);
        assertTrue(this.moving instanceof tddjs.client.movingState);
        assertTrue(this.attacking instanceof tddjs.client.attackingState);
        assertTrue(this.waiting instanceof tddjs.client.waitingState);
        
        assertTrue(this.placing instanceof tddjs.client.abstractState);
        assertTrue(this.moving instanceof tddjs.client.abstractState);
        assertTrue(this.attacking instanceof tddjs.client.abstractState);
        assertTrue(this.waiting instanceof tddjs.client.abstractState);
        
        assertFalse(this.placing instanceof tddjs.client.movingState);
        assertFalse(this.moving instanceof tddjs.client.attackingState);
        assertFalse(this.attacking instanceof tddjs.client.waitingState);
        assertFalse(this.waiting instanceof tddjs.client.placingState); 
    },
    
    "test states should have all functions": function () {
        
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
    },
    "test placing state should implement relevant functions": function () {
        assertFunction(this.placing.placeUnits);
        assertFunction(this.placing.isMoveLegal);
        assertFunction(this.placing.endPhase);
        assertFunction(this.placing.toString);
        
        assertEquals("placingState", this.placing.toString());

        //isMoveLegal test
        var validMove= {
          type:'placing',
          unitCount:1,
          player: 'Peter',
          continent: 'Europa',
          country: 'Country1'
        };
        var wrongOwnerMove= {
          type:'placing',
          unitCount:1,
          player: 'Hanswurst',
          continent: 'Europa',
          country: 'Country1'
        }; 
        var wrongContinentMove= {
          type:'placing',
          unitCount:1,
          player: 'Peter',
          continent: 'Asien',
          country: 'Country1'
        };        
        var wrongCountryMove= {
          type:'placing',
          unitCount:1,
          player: 'Peter',
          continent: 'Europa',
          country: 'Country4'
        };
        var wrongTypeMove= {
          type:'winGame',
          unitCount:1,
          player: 'Peter',
          continent: 'Europa',
          country: 'Country1'
        };
         var wrongUnitCountMove= {
          type:'winGame',
          unitCount:80,
          player: 'Peter',
          continent: 'Europa',
          country: 'Country1'
        };
        
        var placing = this.placing;
        var map = this.map1;
        var availableUnits = 4;
        
        assertException(function(){
            placing.isMoveLegal();
        },'TypeError');
        
        assertException(function(){
            placing.isMoveLegal({},availableUnits,validMove);
        },'TypeError');
        
        assertException(function(){
            placing.isMoveLegal(map,availableUnits,"place units somehwere");
        },'TypeError');
        
        assertException(function(){
            placing.isMoveLegal(map,"4asd",validMove);
        },'TypeError');
        
        assertNoException(function(){
            placing.isMoveLegal(map,availableUnits,validMove);
        });      

        assertTrue(this.placing.isMoveLegal(this.map1,availableUnits,validMove));
        assertFalse(this.placing.isMoveLegal(this.map1,availableUnits,wrongContinentMove));
        assertFalse(this.placing.isMoveLegal(this.map1,availableUnits,wrongCountryMove));
        assertFalse(this.placing.isMoveLegal(this.map1,availableUnits,wrongOwnerMove));
        assertFalse(this.placing.isMoveLegal(this.map1,availableUnits,wrongTypeMove));
        assertFalse(this.placing.isMoveLegal(this.map1,availableUnits,wrongUnitCountMove));
        
        //placeUnits test
        
        var url = "/someURL";
        
        assertException(function(){
            placing.placeUnits(map,availableUnits,validMove);
        },'TypeError');
        
        assertException(function(){
            placing.placeUnits(map,availableUnits,validMove,{url:"someURL"});
        },'TypeError');
        
        assertNoException(function(){
            placing.placeUnits(map,availableUnits,validMove,url);
        });
        
        assertFalse(this.placing.placeUnits(this.map1,availableUnits,wrongTypeMove,url));
        assertTrue(this.placing.placeUnits(this.map1,availableUnits,validMove,url));       
        
     },
     "test attacking state should implement relevant functions": function () {
        assertFunction(this.attacking.attack);
        assertFunction(this.attacking.isMoveLegal);
        assertFunction(this.placing.endPhase);
        assertFunction(this.attacking.toString);
        var validMove = {
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
        var wrongOwnerMove = {
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
        var wrongCountryMove = {
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
        var wrongBorderMove = {
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
        var wrongContinentMove = {
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
        var wrongTypeMove = {
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
        
        var attacking = this.attacking;
        var map = this.map1;
        
        assertException(function(){
            attacking.isMoveLegal();
        },'TypeError');
        
        assertException(function(){
            attacking.isMoveLegal({},validMove);
        },'TypeError');    
        
        assertException(function(){
            attacking.isMoveLegal(map1,"attack somewhere");
        },'TypeError');   
        
        assertNoException(function(){
            attacking.isMoveLegal(map,validMove);
        });      
        
        //isMove legal test
        assertTrue(this.attacking.isMoveLegal(this.map1, validMove));
        assertFalse(this.attacking.isMoveLegal(this.map1, wrongBorderMove));
        assertFalse(this.attacking.isMoveLegal(this.map1, wrongContinentMove));
        assertFalse(this.attacking.isMoveLegal(this.map1, wrongCountryMove));
        assertFalse(this.attacking.isMoveLegal(this.map1, wrongOwnerMove));
        assertFalse(this.attacking.isMoveLegal(this.map1, wrongTypeMove));
        
        // attacking tests
        assertFalse(this.attacking.attack(this.map1,wrongTypeMove));
        assertTrue(this.attacking.attack(this.map1,validMove));
    },
    "test moving state should implement relevant functions": function () {
        assertFunction(this.moving.moveUnits);
        assertFunction(this.moving.isMoveLegal);
        assertFunction(this.placing.endPhase);
        assertFunction(this.moving.toString);

    },    
    "test waiting state should implement relevant functions": function () {
       assertFunction(this.waiting.toString);
    }
    
});

