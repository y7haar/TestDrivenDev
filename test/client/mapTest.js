/* 
 * Testcases für Map
 */
TestCase("Map-Test",
{
    setUp: function ()
    {
        this.map1 = Object.create(tddjs.client.Map);
    },
    
    "test Map Object should be created": function()
    {
        assertObject(this.map1);
    }
});

