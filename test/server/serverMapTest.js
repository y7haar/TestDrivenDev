/* 
 * Testcases für Server Map
 */
TestCase("ServerMapTest",
{
    setUp: function ()
    {
        this.map1 = new tddjs.server.map.map();
        this.player1 = new tddjs.server.player();
        this.player2 = new tddjs.server.player();
        
        //Continent1-------------------------------------
        this.continent1 = new tddjs.server.map.continent();
        this.continent1.setName("Europa");
        
        this.c1 = new tddjs.server.map.country();
        this.c1.setName("Country1");
        this.c1.setOwner(this.player1);
        
        this.c2 = new tddjs.server.map.country();
        this.c2.setName("Country2");
        this.c2.setOwner(this.player2);
        
        this.c3 = new tddjs.server.map.country();
        this.c3.setName("Country3");
        this.c3.setOwner(this.player1);
        
        this.continent1.addCountry(this.c1);
        this.continent1.addCountry(this.c2);
        this.continent1.addCountry(this.c3);
        
        //Continent2---------------------------
        this.continent2 = new tddjs.server.map.continent();
        this.continent2.setName("Asien");
        this.c4 = new tddjs.server.map.country();
        this.c4.setName("Country4");
        this.c4.setOwner(this.player2);
        
        this.c5 = new tddjs.server.map.country();
        this.c5.setName("Country5");
        this.c5.setOwner(this.player2);
        
        this.c6 = new tddjs.server.map.country();
        this.c6.setName("Country6");
        this.c6.setOwner(this.player1);
        
        this.continent2.addCountry(this.c4);
        this.continent2.addCountry(this.c5);
        this.continent2.addCountry(this.c6);
        //-------------------------------------
    },
    
    "test map should not be undefinded, be created and instance of map": function()
    {
        assertNotUndefined(this.map1);
        assertObject(this.map1);
        assertTrue(this.map1 instanceof tddjs.server.map.map);
    },
    
    "test map should store Continents": function()
    {
        assertFunction(this.map1.addContinent);
        assertFunction(this.map1.hasContinent);
        assertFunction(this.map1.getContinents);
        assertFunction(this.map1.getContinent);
       
        var continent1 = this.continent1;
        
        this.map1.addContinent(continent1);       
        
        assertEquals({Europa:this.continent1},this.map1.getContinents());
        assertEquals(this.continent1, this.map1.getContinent('Europa'));
        
        assertTrue(this.map1.hasContinent(this.continent1.getName()));
        assertFalse(this.map1.hasContinent(this.continent2.getName()));     
    },
    
    "test Shouldt be able to add something thats not a Continent": function()
    {
        var map = this.map1;
        
        var fakeContinent ={name:"Nordpol", getName:function(){return name}};
        assertException(function(){
            map.addContinent(fakeContinent);
        },"TypeError");
    },
    
    "test it should be possible to add new Continents": function()
    {
        this.map1.addContinent(this.continent1);
        this.map1.addContinent(this.continent2);
        
        assertEquals(this.c1, this.map1.getContinents()["Europa"].getCountrys()["Country1"]);
        assertTrue(this.map1.getContinents()["Europa"].hasCountryByName("Country2"));
        assertFalse(this.map1.getContinents()["Europa"].hasCountryByName("Country4"));
        
        assertTrue(this.map1.getContinents()["Asien"].hasCountryByName("Country6"));
        assertFalse(this.map1.getContinents()["Asien"].hasCountryByName("Country3"));
                
        assertEquals("undefined",typeof this.map1.getContinents()["Europa"].getCountrys()["fakeCountry"]);
        
        assertEquals(this.c1, this.map1.getContinent("Europa").getCountry("Country1"));
        assertTrue(this.map1.getContinent("Europa").hasCountryByName("Country2"));
        assertFalse(this.map1.getContinent("Europa").hasCountryByName("Country4"));
        
        assertTrue(this.map1.getContinent("Asien").hasCountryByName("Country6"));
        assertFalse(this.map1.getContinent("Asien").hasCountryByName("Country3"));
    
        assertEquals("undefined",typeof this.map1.getContinent("Europa").getCountry("fakeCountry"));  
    },
    
    "test should be able to get a correct Continent-Count": function()
    {
        assertFunction(this.map1.getContinentCount);
        
        var x =  this.map1.getContinentCount();
        assertTrue(x === 0);
        
        this.map1.addContinent(this.continent1);
        x =  this.map1.getContinentCount();
        assertTrue(x === 1);
        
        this.map1.addContinent(this.continent2);
        x =  this.map1.getContinentCount();
        assertTrue(x === 2);
    }
});


