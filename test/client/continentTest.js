/* 
 * Testcases for Continent
 */


TestCase("ContinentTest", {

    setUp: function () {
        this.country1 = new tddjs.client.map.country();
        this.country1.setName("Bangladesh");
        this.country2 = new tddjs.client.map.country();
        this.country2.setName("Uganda");
        this.country3 = new tddjs.client.map.country();
        this.country3.setName("Guantemala");
        this.continent1 = new tddjs.client.map.continent();
    },
    tearDown: function () {
        this.country1 = null;
        this.country2 = null;
        this.country3 = null;
        this.continent = null;
    },
    "test object of Continent should not be undefined": function () {

        assertObject(this.continent1);
    },
    "test if Continent1 stores country objects,exception if not country instance": function () {

        assertFunction(this.continent1.getCountrys);
        assertFunction(this.continent1.getCountryCount);
        assserFunction(this.continent1.addCountry);
        assertfunciton(this.continent1.getCountry);
        
        assertEquals([],this.continent1.getCountrys());
        assertEquals(0,this.continent1.getCountryCount());
        
        this.continent1.addCountry(this.country1);
        assertEquals([this.country1], this.continent1.getCountrys());
        assertEquals(1,this.continent1.getCountryCount());

        this.continent1.addCountry(this.country2);
        assertEquals([this.country1,this.country2], this.continent1.getCountrys());
        assertEquals(2,this.continent1.getCountryCount());

        this.continent1.addCountry(this.country3);
        assertEquals([this.country1,this.country2, this.country3], this.continent1.getCountrys());
        assertEquals(3,this.continent1.getCountryCount());
        
        var fakeCountry = {name:'Deutschland'};
        var continent = this.continent1;
        
        assertException(function(){
            continent.addCountry(fakeCountry);
        },"TypeError");
        
        //is array still the same after trying to add a fakeCountry object
        assertEquals([this.country1,this.country2, this.country3], this.continent1.getCountrys());
        assertEquals(3,this.continent1.getCountryCount());
        
        assertSame(this.country1,this.continent1.getCountry(this.country.getName()));
        assertNotSame(this.country2, this.continent1.getCountry("TakatukaLand"));
        
    },    
    "test if contrys are in Continent1": function () {
        
        assertFunction(this.continent1.hasCountryByObject);
        assertFunciton(this.continent1.hasCountryByName);
        
        
        this.continent1.addCountry(this.country1);
        this.continent1.addCountry(this.country3);
        
        assertTrue(this.continent1.hasCountryByObject(this.country1));
        assertFalse(this.continent1.hasCountryByObject(this.country2));
        assertTrue(this.continent1.hasCountryByObject(this.country3));
        
        assertTrue(this.continent1.hasCountryByName(this.country1.getName()));
        assertFalse(this.continent1.hasCountryByName(this.country2.getName()));
        assertTrue(this.continent1.hasCountryByName(this.country3.getName()));
        
    },
    
    "test setter/getter of unitBonus": function () {
        
        assertNotUndefined(this.continent1.setUnitBonus);
        assertFunction(this.continent1.setUnitBonus);        
        assertNotUndefined(this.continent1.getUnitBonus);
        assertFunction(this.continent1.getUnitBonus);
        
        var continent = this.continent1;
        
        assertException(function(){continent.getUnitBonus();},"Error");
        
        assertNoException(function(){continent.setUnitBonus(5);});
        assertEquals(5,this.continent1.getUnitBonus());
        
        assertException(function(){
            continent.setUnitBonus(-1);
        },"initError");
        
         assertException(function(){
            continent.setUnitBonus("Holla die Waldfee");
        },"TypeError");
       
        assertEquals(5,this.continent1.getUnitBonus());
    }

});