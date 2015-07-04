/* 
 *  Tests for randomAi
 */

TestCase("RandomAiTest", {
    setUp: function() {
        this.ai = new tddjs.server.controller.randomAi();
        
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
        
        this.map.addContinent(this.continent1);
        //-------------------------------------
    },
    
    tearDown: function() {
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
        
        var value2 = this.ai.evaluateAttack(this.c2, this.c1);
        assertTrue(value1 > value2);
    }

});
