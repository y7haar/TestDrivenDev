/* 
 *  Tests for randomAi
 */

TestCase("RandomAiTest", {
    setUp: function() {
        
        
        this.map1 = new tddjs.server.map.map();
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
        
        this.ai = new tddjs.server.controller.randomAi(this.player1, this.map1);
        this.sandbox = sinon.sandbox.create();
        this.evaluatePlacingSpy = this.sandbox.spy(this.ai, "evaluatePlacing");
        //-------------------------------------
    },
    
    tearDown: function() {
        this.sandbox.restore();
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
        
        this.ai = new tddjs.server.controller.randomAi(this.player2, this.map1);
        var value2 = this.ai.evaluateAttack(this.c2, this.c1);
        assertTrue(value1 > value2);
    },
    
    "test evaluateAttack should return quotient of unit counts of both countries": function() {
        var value1 = this.ai.evaluateAttack(this.c1, this.c2);
        
        
        this.ai = new tddjs.server.controller.randomAi(this.player2, this.map1);
        
        var value2 = this.ai.evaluateAttack(this.c2, this.c1);
        
        assertEquals(10 / 2, value1);
        assertEquals(2 / 10, value2);
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
        
        this.ai = new tddjs.server.controller.randomAi(this.player2, this.map1);
        
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
    
     "test ai should have function to place units": function() {
        assertFunction(this.ai.placeUnits);
    }

});
