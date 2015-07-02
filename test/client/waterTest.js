/* 
 * Testcases for Water
 */


TestCase("WaterBorderTest", {
    setUp: function () {
        this.country1 = new tddjs.client.map.country();
        this.country2 = new tddjs.client.map.country(); 
        this.country3 = new tddjs.client.map.country(); 
        this.water = new tddjs.client.map.water();
    }, 
    tearDown: function ()
    {
        this.country1 = null;
        this.country2 = null;
        this.country3 = null;
        this.water = null;
    },
    "test object of country should not be undefined": function () {  
            
        assertObject(this.country1); 
    },
    "test object of water should not be undefined": function () {  
            
        assertObject(this.water); 
    },
    
    "test Should be able to get the Borders": function()
    {
        assertObject(this.water.getBorders());
        assertEquals(0, this.water.getBorders().length);
    },
    
    "test water should store other countrys, exception if not a Country": function ()
    {   
        assertEquals(0, this.water.getBorderCount());
        this.country1.addBorder(this.country1,this.country2);
        assertEquals(1, this.water.getBorderCount());
        this.country1.addBorder(this.country1,this.country3);
        assertEquals(2, this.water.getBorderCount());
    },
    
    "test Shouldnt store something thats not a country": function()
    {
        var country = this.country1;
        var fakeCountry = {name:"Franzaken"};
        var water = this.water;
        
        assertException(function()
        {
            water.addBorder(fakeCountry, country);
        },"TypeError");
        
        assertException(function()
        {
            water.addBorder(country, fakeCountry);
        },"TypeError");
    }
});

TestCase("WaterNameTest", {
    setUp: function () {
        this.water = new tddjs.client.map.water();
    },
    tearDown: function ()
    {
        this.water = null;
    },
    
    "test country shoulde store name as a String": function () {

        assertFunction(this.water.setName);
        assertFunction(this.water.getName);

        var name = "Usee";
        var water = this.water;
        
        assertNoException(function () {
            water.setName(name);
        });
        assertEquals(name, this.water.getName());
        
        name = "Rotes Meer";
        this.water.setName(name);
        assertEquals(name, this.water.getName());
    },
    
    "test Shouldnt be able to set incorrect Names": function()
    {
        var name = "Usee";
        var water = this.water;
        var fakeName = {name: "Schwarzes Meer"};
        
        this.water.setName(name);
        assertException(function () {
            water.setName(fakeName);
        }, "TypeError");

        assertEquals(name, this.water.getName());
    },
    
    "test Shouldnt be able to get Name before it was setted": function()
    {
        var water = this.water;
        
        assertException(function(){
            water.getName();
        },"initError");
    }
});
