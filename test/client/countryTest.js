
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
    },
    
    "test country should return the count of units": function () { 
      
        assertEquals(1, this.country1.getUnitCount());
    },
    
    "test add x units to country return acctual unit count": function () { 
      
        assertEquals(1, this.country1.getUnitCount());
        this.country1.addUnits(this.x);
        assertEquals(11, this.country1.getUnitCount());       
      
    },    
    "test if added Unit is number return excetion if not number": function () { 
      
        assertEquals(11, this.country1.getUnitCount());
        
        assertException(function(){
            this.country1.addUnits(this.object);}
        , "TypeError");
        
        assertEquals(11, this.country1.getUnitCount());  
    },    
    "test substract x units to country return acctual unit count": function () { 
      
        assertEquals(11, this.country1.getUnitCount());
        this.country1.subUnits(this.x);
        assertEquals(1, this.country1.getUnitCount());       
      
    },   
    
    

  
});
