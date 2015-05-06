
/*
 *
 * Testcases for Country
 */

TestCase("CountryTest", {
        
    setUp: function () {
      this.country1 = Object.create(tddjs.client.map.Country); 
      this.country2 = Object.create(tddjs.client.map.Country); 
      this.country3 = Object.create(tddjs.client.map.Country); 
    },

  "test object of country should not be undefined": function () { 
      
      assertObject(this.country1);
      assertObject(this.country2);
      assertObject(this.country3);
  },
  "test if country1 should store country2 and country3 as a border": function () { 
      
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

// Testcaes for Soldier --> Units of a Country
TestCase("CountryUnitsTest", {
        
    setUp: function () {
      this.country1 = Object.create(tddjs.client.map.Country); 
      this.x = 10;
      this.object = {};
      this.temp = 42;
    },
    tearDown: function()
    {
      delete this.country1;  
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
      
        assertEquals(11, this.country1.getUnitCount());
        
        var country = this.country1;
        var obj = this.object;
        
        assertException(function(){
            country.addUnits(obj);}
        , "TypeError");
        
        assertEquals(11, this.country1.getUnitCount());  
    },    
    "test substract x units to country return acctual unit count": function () { 
      
        this.country1.addUnits(this.x);
        assertEquals(21, this.country1.getUnitCount());
        this.country1.subUnits(this.x);
        assertEquals(11, this.country1.getUnitCount());       
      
    },
    
    "test if sub Unitcount is number return excetion if not number": function () { 
      
        assertEquals(11, this.country1.getUnitCount());
        var country = this.country1;
        var obj = this.object;
        
        assertException(function(){
            country.subUnits(obj);}
        , "TypeError");
        
        assertEquals(11, this.country1.getUnitCount());  
    },    
    "test Unit count should not fall under 1 after sub ": function () { 
      
       var count = this.country1.getUnitCount();
       this.country1.subUnits(count+1);
       assertEquals(1, this.country1.getUnitCount());
       
    },
    
    "test Country1 should store and return specific Unit count": function () { 
      
       this.country1.setUnitCount(this.temp);
       assertEquals(42, this.country1.getUnitCount());
       
    },
    
    "test setUnitCount should't be able to set UnitCount under 1": function () { 
      
         var country = this.country1;
         
        assertException(function(){
            country.setUnitCount(-200);}
        , "Error");       
    }      
});

// Tastacaes for Player --> Owner of a country
TestCase("CountryOwnerTest", {
        
    setUp: function () {
      this.country1 = Object.create(tddjs.client.map.Country); 
      this.player1 = Object.create(tddjs.client.Player);
      this.player2 = Object.create(tddjs.client.Player);      
    },
    
    "test country should store Player Object": function () { 
      
        this.country1.setOwner(this.player1);
        assertSame(this.player1,this.country1.getOwner());
    },
    
    "test setOwner should override old Owner": function () { 
      
        this.country1.setOwner(this.player1);
        assertSame(this.player1,this.country1.getOwner());
        assertNotSame(this.player2,this.country1.getOwner());
        
        this.country1.setOwner(this.player2);
        assertSame(this.player2,this.country1.getOwner());
        assertNotSame(this.player1,this.country1.getOwner());
    },
    
    "test setOwner should throw exception if object is not a Player": function () { 
      
        var country = this.country1; 
        var player2 = "Peter";
        
        console.log(this.player1);
        
        this.country1.setOwner(this.player1);
        assertEquals(this.player1,this.country1.getOwner());
        
        assertException(function(){
            country.setOwner(player2);
        },"TypeError");
    }
    
    
});


