
/*
 *
 * Testcases for Country
 */
 


TestCase("ClientCountryBorderTest", {
    setUp: function () {
        this.country1 = new tddjs.client.map.country();
        this.country2 = new tddjs.client.map.country(); 
        this.country3 = new tddjs.client.map.country(); 
   
    }, 
    tearDown: function ()
    {
        this.country1 = null;
        this.country2 = null;
        this.country3 = null;
    },
    "test object of country should not be undefined": function () {  
            
        assertObject(this.country1); 
    },
    
    "test Should be able to get the Borders": function()
    {
        assertObject(this.country1.getBorders());
        assertEquals(0, this.country1.getBorders().length);
    },
    
    "test country1 should store other countrys, exception if not a Country": function () {
        
        var fakeCountry = {name:"Franzaken"};
        var country = this.country1;
        
        assertException(function(){
            country.addBorder(fakeCountry);
        },"TypeError");
        
        assertEquals(0, this.country1.getBorderCount());
        this.country1.addBorder(this.country2);
        assertEquals(1, this.country1.getBorderCount());
        this.country1.addBorder(this.country3);
        assertEquals(2, this.country1.getBorderCount());

    },
    "test if country1 border country2 and country3 should return true": function () {
        this.country1.addBorder(this.country2);
        this.country1.addBorder(this.country3);
        assertTrue(this.country1.borders(this.country2));
        assertTrue(this.country1.borders(this.country3));
    },
    "test if country1 not border country2 and country3 should return false": function () {

        assertFalse(this.country1.borders(this.country2));
        assertFalse(this.country1.borders(this.country3));
    },
    "test if country1 border country2 but not country3": function () {

        this.country1.addBorder(this.country2);
        assertTrue(this.country1.borders(this.country2));
        assertFalse(this.country1.borders(this.country3));
    }
});
// testcaes for Country name
TestCase("CountryNameTest", {
    setUp: function () {
        this.country1 = new tddjs.client.map.country();
    },
    tearDown: function ()
    {
        this.country1 = null;
    },
    "test country shoulde store name as a String": function () {

        assertFunction(this.country1.setName);
        assertFunction(this.country1.getName);

        var name = "Uganda";
        var fakeName = {name: "Guantemala"};
        var country = this.country1;
        
        assertException(function(){
            country.getName();
        },"initError");
        
        assertNoException(function () {
            country.setName(name);
        });
        
        assertException(function () {
            country.setName(fakeName);
        }, "TypeError");

        assertEquals(name, this.country1.getName());
        name = "Bangladesh";
        this.country1.setName(name);
        assertEquals(name, this.country1.getName());

    }
});


// Testcaes for Soldier --> Units of a Country
TestCase("ClientCountryUnitsTest", {
    setUp: function () {
        this.country1 = new tddjs.client.map.country();
        this.x = 10;
        this.object = {};
        this.temp = 42;
    },
    tearDown: function ()
    {
      this.country1 = null;  
    },
    "test country return unitcount always should be 1 at creation": function () {

        assertEquals(1, this.country1.getUnitCount());
    },
    "test add x units to country return acctual unit count": function () {

        assertEquals(1, this.country1.getUnitCount());
        this.country1.addUnits(this.x);
        assertEquals(11, this.country1.getUnitCount());

    },
    "test if added Unit is number return excetion if not number": function () {

        assertEquals(1, this.country1.getUnitCount());

        var country = this.country1;
        var obj = this.object;

        assertException(function () {
            country.addUnits(obj);
        }
        , "TypeError");

        assertEquals(1, this.country1.getUnitCount());
    },
    "test substract x units to country return acctual unit count": function () {

        this.country1.addUnits(this.x);
        assertEquals(11, this.country1.getUnitCount());
        this.country1.subUnits(this.x);
        assertEquals(1, this.country1.getUnitCount());

    },
    "test if sub Unitcount is number return excetion if not number": function () {

        assertEquals(1, this.country1.getUnitCount());
        var country = this.country1;
        var obj = this.object;

        assertException(function () {
            country.subUnits(obj);
        }
        , "TypeError");

        assertEquals(1, this.country1.getUnitCount());
    },
    "test Unit count should not fall under 1 after sub ": function () {

        var count = this.country1.getUnitCount();
        this.country1.subUnits(count + 1);
        assertEquals(1, this.country1.getUnitCount());

    },
    "test Country1 should store and return specific Unit count": function () {

        this.country1.setUnitCount(this.temp);
        assertEquals(42, this.country1.getUnitCount());

    },
    "test setUnitCount should't be able to set UnitCount under 1": function () {

        var country = this.country1;

        assertException(function () {
            country.setUnitCount(-200);
        }
        , "Error");
    }
});

// Tastacaes for Player --> Owner of a country
TestCase("ClientCountryOwnerTest", {
    setUp: function () {
        this.country1 = new tddjs.client.map.country();
        this.player1 = new tddjs.client.player();
        this.player2 = new tddjs.client.player();
  
    },
    tearDown: function() {
        this.country1 = null;
        this.player1 = null;
        this.player2 = null;
    },
    "test country should store Player Object": function () {
        
        var country = this.country1;
        
         assertException(function () {
            country.getOwner();
        }, "initError");

        this.country1.setOwner(this.player1);
        assertSame(this.player1, this.country1.getOwner());
    },
    "test setOwner should override old Owner": function () {

        this.country1.setOwner(this.player1);
        assertSame(this.player1, this.country1.getOwner());
        assertNotSame(this.player2, this.country1.getOwner());

        this.country1.setOwner(this.player2);
        assertSame(this.player2, this.country1.getOwner());
        assertNotSame(this.player1, this.country1.getOwner());
    },
    "test setOwner should throw exception if parameter is not a Player": function () {

        var country = this.country1; 
        var player2 = "Peter"; 
        
     
        this.country1.setOwner(this.player1);
        assertSame(this.player1, this.country1.getOwner());
        
        assertTrue(this.country1.getOwner() instanceof tddjs.client.player);
        
        assertException(function () {
            country.setOwner(player2);
        }, "TypeError");
    }    
});


