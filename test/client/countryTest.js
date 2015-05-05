
/*
 *
 * Testcases for Country
 */

TestCase("CountryTest", {
        
    setUp: function () {
      this.country1 = new tddjs.client.map.Country(); 
      this.country2 = new tddjs.client.map.Country(); 
      this.country3 = new tddjs.client.map.Country(); 
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
      this.country1 = new tddjs.client.map.Country(); 
      this.x = 10;
      this.object = {};
      this.temp = 42;
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
        
        assertException(function(){
            country.addUnits(obj);}
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
        
        assertException(function(){
            country.subUnits(obj);}
        , "TypeError");
        
        assertEquals(1, this.country1.getUnitCount());  
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
      this.country1 = new tddjs.client.map.Country(); 
      this.player = { name:'Peter'};
      this.player2 = { name:'Herbert'};
      this.player3 = { name:'Udo'};
    },
    
    "test country shoulde store Player Object": function () { 
      
        this.country1.setOwner(this.player);
        assertEquals(this.player,this.country1.getOwner());
    }
    
   
});


