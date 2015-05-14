/* 
 * Source-Code für Border zur Maperstellung
 */

TestCase("BorderTest", {
    
    setUp: function () {
        this.border = new tddjs.client.map.border();
        this.country1 = new tddjs.client.map.country();
        this.country2 = new tddjs.client.map.country();
    },
    
    tearDown: function () {

    },
    
    "test Border should be a Object": function()
    {
        assertObject(this.border);
    },
    
    "test A Left and Right Country should be able to be set and get": function()
    {
        assertFunction(this.border.setLeftCountry);
        assertFunction(this.border.setRigthCountry);
        assertFunction(this.border.getLeftCountry);
        assertFunction(this.border.getRigthCountry);
        this.border.setLeftCountry(this.country1);
        this.border.setRigthCountry(this.country2);
        assertEquals(this.border.getLeftCountry(), this.country1);
        assertEquals(this.border.getRigthCountry(), this.country2);
    },
    
    "test Should be only able to set Countrys": function()
    {
        var x = 5;
        var border1 = this.border;
        assertException(function(){border1.setLeftBorder(x);}, "TypeError");
        assertException(function(){border1.setRigthBorder(x);}, "TypeError");
    }
});

