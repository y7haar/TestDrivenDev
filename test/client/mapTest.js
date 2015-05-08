/* 
 * Testcases für Map
 */
TestCase("MapTest",
{
    setUp: function ()
    {
        this.map1 = new tddjs.client.map();
        this.player1 = new tddjs.client.player();
        this.player2 = new tddjs.client.player();
        
        this.continent1 = new tddjs.client.map.continent();
        this.c1 = new tddjs.client.map.country();
        this.c1.setName("1");
        this.c1.setOwner(this.player1);
        
        this.c2 = new tddjs.client.map.country();
        this.c2.setName("2");
        this.c2.setOwner(this.player2);
        
        this.c3 = new tddjs.client.map.country();
        this.c3.setName("3");
        this.c3.setOwner(this.player1);
        
        this.continent1.addCountry(this.c1);
        this.continent1.addCountry(this.c2);
        this.continent1.addCountry(this.c3);
        
        this.continent2 = new tddjs.client.map.continent();
        this.c4 = new tddjs.client.map.country();
        this.c4.setName("4");
        this.c4.setOwner(this.player2);
        
        this.c5 = new tddjs.client.map.country();
        this.c5.setName("5");
        this.c5.setOwner(this.player2);
        
        this.c6 = new tddjs.client.map.country();
        this.c6.setName("6");
        this.c6.setOwner(this.player1);
        
        this.continent2.addCountry(this.c4);
        this.continent2.addCountry(this.c5);
        this.continent2.addCountry(this.c6);
    },
    
    "test instance of should not be undefinded and shoulde be created": function()
    {
        assertNotUndefinded(this.map1);
        assertObject(this.map1);
    }  
});

