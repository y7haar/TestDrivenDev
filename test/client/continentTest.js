/* 
 * Testcases for Continent
 */


TestCase("ContinentTest", {
    
    setUp: function () {
      this.country1 = Object.create(tddjs.client.map.Country); 
      this.country2 = Object.create(tddjs.client.map.Country);
      this.country3 = Object.create(tddjs.client.map.Country); 
      this.continent1 = Object.create(tddjs.client.map.Continent); 
    },

  "test object of Continent should not be undefined": function () { 
      
      assertObject(this.continent1);
  },
  "test if Continent1 should store country1, country2 and country3": function () { 
      
     assertEquals(0, this.continent1.getCountryCount());
     
     this.continent1.addCountry(this.country1);
     assertEquals(1, this.continent1.getCountryCount());
     
     this.continent1.addCountry(this.country2);
     assertEquals(2, this.continent1.getCountryCount());
     
     this.continent1.addCountry(this.country3);
     assertEquals(3, this.continent1.getCountryCount());
     
  },
  "test if contrys are in Continent1": function() {
      assertTrue(this.continent1.hasCountry(country1));
      
      assertTrue(this.continent1.hasCountry(country2));
      
      assertTrue(this.continent1.hasCountry(country3));
  }

  
});