
/*
 *
 * Testcases for Country
 */

TestCase("CountryTest", {
    
    setUp: function () {
      this.country1 = Object.create(tddjs.client.map.Country);  
    },

  "test object of country should not be undefined": function () { 
      
      assertObject(this.country1);
  }  
  
});
