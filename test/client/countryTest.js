
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
  }

  
});
