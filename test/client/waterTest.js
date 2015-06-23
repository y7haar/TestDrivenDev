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
    
    "test water should store other countrys, exception if not a Country": function () {
        
        var fakeCountry = {name:"Franzaken"};
        var water = this.water;
        
        assertException(function(){
            water.addBorder(fakeCountry);
        },"TypeError");
        
        assertEquals(0, this.water.getBorderCount());
        this.country1.addBorder(this.country1,this.country2);
        assertEquals(1, this.water.getBorderCount());
        this.country1.addBorder(this.country1,this.country3);
        assertEquals(2, this.water.getBorderCount());

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
        var fakeName = {name: "Schwarzes Meer"};
        var water = this.water;
        
        assertException(function(){
            water.getName();
        },"initError");
        
        assertNoException(function () {
            water.setName(name);
        });
        
        assertException(function () {
            water.setName(fakeName);
        }, "TypeError");

        assertEquals(name, this.water.getName());
        name = "Rotes Meer";
        this.water.setName(name);
        assertEquals(name, this.water.getName());

    }
});
