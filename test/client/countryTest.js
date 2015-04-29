
/*
 *
 * Testcases for Country
 */

TestCase("CountryTest", {
    
    setUp: function () {
      this.country1 = Object.create(tddjs.client.map.Country); 
      this.country2 = Object.create(tddjs.client.map.Country); 
    },

  "test object of country should not be undefined": function () { 
      
      assertObject(this.country1);
  },
  "test if country1 should store country2 as a border": function () { 
      
     assertEquals(0, this.country1.getBorderCount());
     this.country1.addBorder(this.country2);
     assertEquals(1, this.country1.getBorderCount());
  }

  
});
