/* 
 *  Tests for randomAi
 */

TestCase("RandomAiTest", {
    setUp: function() {
        
        
        this.map1 = new tddjs.server.map.map();
        this.sglc = new tddjs.server.controller.gameLoopController();
        this.sglc.setMap(this.map1);
        
        this.player1 = new tddjs.server.player();
        this.player2 = new tddjs.server.player();
        
        //Continent1-------------------------------------
        this.continent1 = new tddjs.server.map.continent();
        this.continent1.setName("Europa");
        
        this.c1 = new tddjs.server.map.country();
        this.c1.setName("Country1");
        this.c1.setOwner(this.player1);
        this.c1.setUnitCount(10);
        
        this.c2 = new tddjs.server.map.country();
        this.c2.setName("Country2");
        this.c2.setOwner(this.player2);
        this.c2.setUnitCount(2);
        
        this.c3 = new tddjs.server.map.country();
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
        
        this.map1.addContinent(this.continent1);
        
        this.ai = new tddjs.server.controller.randomAi(this.player1, this.map1, this.sglc);
        this.sandbox = sinon.sandbox.create();
        this.evaluatePlacingSpy = this.sandbox.spy(this.ai, "evaluatePlacing");
        this.evaluateAttackSpy = this.sandbox.spy(this.ai, "evaluateAttack");
        this.attackSpy = this.sandbox.spy(this.ai, "attack");
        this.placeUnitsSpy = this.sandbox.spy(this.ai, "placeUnits");
        this.sglcPlaceUnitsSpy = this.sandbox.spy(this.sglc, "placeUnits");
        this.sglcAttackSpy = this.sandbox.spy(this.sglc, "attack");
        
        this.realUnitStock = this.sglc.getUnitStockByPlayer;
        
        this.sglc.getUnitStockByPlayer = function(player)
        {
            return 10;
        };
        
        //-------------------------------------
    },
    
    tearDown: function() {
        this.sandbox.restore();
        this.sglc.getUnitStockByPlayer = this.realUnitStock;
        this.sglc.attack = this.realAttack;
        
        delete this.map;
        
    },
    
    "test object of ai should not be undefined": function() {
        assertObject(this.ai);
    },
    
    "test ai should have function to evaluate a possible attack": function() {
        assertFunction(this.ai.evaluateAttack);
    },
    
    "test evaluateAttack should return a number": function() {
        var value = this.ai.evaluateAttack(this.c1, this.c2);
        assertNumber(value);
    },
    
    "test evaluateAttack should return higher values if country from has more units than country to": function() {
        var value1 = this.ai.evaluateAttack(this.c1, this.c2);
        
        this.ai = new tddjs.server.controller.randomAi(this.player2, this.map1, this.sglc);
        var value2 = this.ai.evaluateAttack(this.c2, this.c1);
        assertTrue(value1 > value2);
    },
    
    "test evaluateAttack should return quotient of unit counts of both countries": function() {
        var value1 = this.ai.evaluateAttack(this.c1, this.c2);
        
        
        this.ai = new tddjs.server.controller.randomAi(this.player2, this.map1, this.sglc);
        
        var value2 = this.ai.evaluateAttack(this.c2, this.c1);
        
        assertEquals((10 - 1) / 2, value1);
        assertEquals((2 - 1) / 10, value2);
    },
    
    "test ai should have function to evaluate placing of units to specified country": function() {
        assertFunction(this.ai.evaluatePlacing);
    },
    
     "test evaluatePlacing should return 0 if selected country only has own borders": function() {
        var c4 = new tddjs.server.map.country();
        
        c4.setName("Country4");
        c4.setOwner(this.player1);
        c4.setUnitCount(1);
        c4.addBorder(this.c3);
        this.c3.addBorder(c4);
        
        var value = this.ai.evaluatePlacing(c4);
        assertEquals(0, value);
    },
    
    "test evaluatePlacing should return sum of all enemy border values": function() {
        var value = this.ai.evaluatePlacing(this.c1);
        assertEquals(2 / 10, value);
        
        this.ai = new tddjs.server.controller.randomAi(this.player2, this.map1, this.sglc);
        
        var value = this.ai.evaluatePlacing(this.c2);
        assertEquals(10 / 2, value);
    },
    
    "test ai should have function to place all units": function() {
        assertFunction(this.ai.placeAllUnits);
    },
    
    "test placeAllUnits should call evaluatePlacing for each country owned": function() {
        sinon.assert.notCalled(this.evaluatePlacingSpy);
        
        this.ai.placeAllUnits();
        
        sinon.assert.calledTwice(this.evaluatePlacingSpy);
        assertEquals(this.c1, this.evaluatePlacingSpy.args[0][0]);
        assertEquals(this.c3, this.evaluatePlacingSpy.args[1][0]);
    },
    
    "test placeAllUnits should dispense all Units": function() {
        
        var unitsBefore = this.c1.getUnitCount() + this.c3.getUnitCount();
        
        this.ai.placeAllUnits();
        
        assertEquals(unitsBefore + 10, this.c1.getUnitCount() + this.c3.getUnitCount());
    },
    
     "test placeAllUnits should call placeUnits, only 1 country with enemy": function() {
         sinon.assert.notCalled(this.placeUnitsSpy);
        
        this.ai.placeAllUnits();
        
        sinon.assert.calledTwice(this.placeUnitsSpy);
        assertEquals(10, this.placeUnitsSpy.args[0][1]);
        assertEquals(0, this.placeUnitsSpy.args[1][1]);
    },
    
    "test placeAllUnits should call placeUnits, more countries with enemy": function() {
        this.c3.addBorder(this.c2);
        this.c2.addBorder(this.c3);
        
        this.c1.setUnitCount(2);
        
        sinon.assert.notCalled(this.placeUnitsSpy);
        
        this.ai.placeAllUnits();
        
        sinon.assert.calledThrice(this.placeUnitsSpy);
        assertEquals(3, this.placeUnitsSpy.args[0][1]);
        assertEquals(6, this.placeUnitsSpy.args[1][1]);
        assertEquals(1, this.placeUnitsSpy.args[2][1]);
    },
    
     "test ai should have function to place units": function() {
        assertFunction(this.ai.placeUnits);
    },
    
    "test placeUnits should call placeUnits method in sglc": function() {
        sinon.assert.notCalled(this.sglcPlaceUnitsSpy);
        
        this.ai.placeUnits(this.c1, 1);
        
        sinon.assert.calledOnce(this.sglcPlaceUnitsSpy);
        sinon.assert.calledWith(this.sglcPlaceUnitsSpy, this.c1, 1);
    },
    
    "test ai should have function to perform attacks": function() {
        assertFunction(this.ai.attack);
    },
    
    "test ai should have function to perform all atacks": function() {
        assertFunction(this.ai.attackAll);
    },
    
    "test attack should evaluate players countries as long as value is not greater than 2.5": function() {
        sinon.assert.notCalled(this.evaluateAttackSpy);
        
        this.ai.attack();
        
        sinon.assert.calledOnce(this.evaluateAttackSpy);
        sinon.assert.calledWith(this.evaluateAttackSpy, this.c1, this.c2);
    },
    
    "test attack should call glc attack if value is greater or equal 2.5": function() {
        sinon.assert.notCalled(this.sglcAttackSpy);
        
        this.ai.attack();
        
        sinon.assert.calledOnce(this.sglcAttackSpy);
        sinon.assert.calledWith(this.sglcAttackSpy, this.c1, this.c2);
    },
    
    "test attack should perform best possible attack if no value is greater than 2.5": function() {
        this.c2.setUnitCount(4);
        this.c1.setUnitCount(7);
        
        // Value is 1.5
        
        sinon.assert.notCalled(this.sglcAttackSpy);
        
        var bool = this.ai.attack();
        
        assertTrue(bool);
        sinon.assert.calledOnce(this.sglcAttackSpy);
        sinon.assert.calledWith(this.sglcAttackSpy, this.c1, this.c2);
    },
    
    "test attack should not perform any attack if highest value < 1.5": function() {
        this.c2.setUnitCount(4);
        this.c1.setUnitCount(3);
        
        sinon.assert.notCalled(this.sglcAttackSpy);
        
        var bool = this.ai.attack();
        
        assertFalse(bool);
        
        sinon.assert.notCalled(this.sglcAttackSpy);
    }

});


/* 
 *  Tests for randomAi
 */

TestCase("RandomAiAttackAllTest", {
    setUp: function() {
        
        
        this.map1 = new tddjs.server.map.map();
        this.sglc = new tddjs.server.controller.gameLoopController();
        this.sglc.setMap(this.map1);
        
        this.player1 = new tddjs.server.player();
        this.player2 = new tddjs.server.player();
        
        //Continent1-------------------------------------
        this.continent1 = new tddjs.server.map.continent();
        this.continent1.setName("Europa");
        
        this.c1 = new tddjs.server.map.country();
        this.c1.setName("Country1");
        this.c1.setOwner(this.player1);
        this.c1.setUnitCount(10);
        
        this.c2 = new tddjs.server.map.country();
        this.c2.setName("Country2");
        this.c2.setOwner(this.player2);
        this.c2.setUnitCount(2);
        
        this.c3 = new tddjs.server.map.country();
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
        
        this.map1.addContinent(this.continent1);
        
        this.ai = new tddjs.server.controller.randomAi(this.player1, this.map1, this.sglc);
        this.sandbox = sinon.sandbox.create();
        this.evaluatePlacingSpy = this.sandbox.spy(this.ai, "evaluatePlacing");
        this.evaluateAttackSpy = this.sandbox.spy(this.ai, "evaluateAttack");
        this.attackSpy = this.sandbox.spy(this.ai, "attack");
        this.placeUnitsSpy = this.sandbox.spy(this.ai, "placeUnits");
        this.sglcPlaceUnitsSpy = this.sandbox.spy(this.sglc, "placeUnits");
        this.sglcAttackSpy = this.sandbox.spy(this.sglc, "attack");
        
        this.realUnitStock = this.sglc.getUnitStockByPlayer;
        this.realAttack = this.sglc.attack;
        
        // Hack because real method is not yet implemented
        this.sglc.attack = function(from, to)
        {
            to.setOwner(from.getOwner());  
        };
        
        this.sglc.getUnitStockByPlayer = function(player)
        {
            return 10;
        };
        
        //-------------------------------------
    },
    
    tearDown: function() {
        this.sandbox.restore();
        this.sglc.getUnitStockByPlayer = this.realUnitStock;
        this.sglc.attack = this.realAttack;
        
        delete this.map;
        
    },
    "test attackAll should repeatedly call attack as long as attacks can be performed": function() {
        sinon.assert.notCalled(this.attackSpy);
        
        this.ai.attackAll();
        
        sinon.assert.calledTwice(this.attackSpy);
    }

});
