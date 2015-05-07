/* 
 * Testcases für Map
 */
TestCase("Map-Test",
{
    setUp: function ()
    {
        this.map1 = Object.create(tddjs.client.Map);
        this.continent1 = Object.create(tddjs.client.map.Continent);
    },
    
    "test Map Object should be created": function()
    {
        assertObject(this.map1);
    },
    
    "test Should be able to add a Continent and find it afterwards": function()
    {
        this.map1.addContinent(this.continent1);
        assertTrue(this.map1.hasContinent(this.continent1));
    },
    
    "test Shouldnt be able to add something thats not a Continent": function()
    {
        
    } ,
    
    "test Shouldnt be able to search for something thats not a Continent": function()
    {
        
    }
});

