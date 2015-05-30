/* 
 * All tests for MapGenerator
 */
TestCase("MapGeneratorTest for private Functions", {
    setUp: function ()
    {
        this.mapGenerator = new tddjs.server.controller.mapGenerator();
        this.x = 15;
        this.y = 15;
    },
    
    tearDown: function () {},
    
    "test Shouldnt be able to initialize Countries without setting a grid first": function()
    {
        var gen = this.mapGenerator;
        
        assertException(function(){gen.initCountries();}, "Error");
    },
    
    "test After initCountries every gridCell should contain a country": function()
    {
        this.mapGenerator.setGridSize(7,7);
        this.mapGenerator.initCountries();
        var grid = this.mapGenerator.getMapGrid();
        
        assertTrue(grid.cellGrid[0][0] instanceof(tddjs.client.map.country));
        assertTrue(grid.cellGrid[1][0] instanceof(tddjs.client.map.country));
        assertTrue(grid.cellGrid[0][1] instanceof(tddjs.client.map.country));
        assertTrue(grid.cellGrid[3][3] instanceof(tddjs.client.map.country));
        assertTrue(grid.cellGrid[6][5] instanceof(tddjs.client.map.country));
        assertTrue(grid.cellGrid[5][6] instanceof(tddjs.client.map.country));
        assertTrue(grid.cellGrid[6][6] instanceof(tddjs.client.map.country));
    },
    
    "test After initCountries every gridCell should contain a contry with id -1": function()
    {
        this.mapGenerator.setGridSize(7,7);
        this.mapGenerator.initCountries();
        var grid = this.mapGenerator.getMapGrid();
        
        assertEquals(-1, grid.cellGrid[0][0].id);
        assertEquals(-1, grid.cellGrid[1][0].id);
        assertEquals(-1, grid.cellGrid[0][1].id);
        assertEquals(-1, grid.cellGrid[3][3].id);
        assertEquals(-1, grid.cellGrid[5][5].id);
        assertEquals(-1, grid.cellGrid[5][6].id);
        assertEquals(-1, grid.cellGrid[6][5].id);
        assertEquals(-1, grid.cellGrid[6][6].id);
    },
    
    "test After Initialisation every country should have the size 1": function()
    {
        this.mapGenerator.setGridSize(7,7);
        this.mapGenerator.initCountries();
        var grid = this.mapGenerator.getMapGrid();
        
        assertEquals(1, grid.cellGrid[0][0].size);
        assertEquals(1, grid.cellGrid[1][0].size);
        assertEquals(1, grid.cellGrid[0][1].size);
        assertEquals(1, grid.cellGrid[3][3].size);
        assertEquals(1, grid.cellGrid[5][5].size);
        assertEquals(1, grid.cellGrid[5][6].size);
        assertEquals(1, grid.cellGrid[6][5].size);
        assertEquals(1, grid.cellGrid[6][6].size);
    },
    
    "test After initBorders every possible Border should have been created correctly": function()
    {
        this.mapGenerator.setGridSize(7,6);
        this.mapGenerator.initCountries();
        this.mapGenerator.initBorders();
        
        var borders = this.mapGenerator.getMapGrid().borders;
        
        assertEquals(71, borders.length);
        assertTrue(borders[0] instanceof tddjs.client.map.border);
        assertTrue(borders[42] instanceof tddjs.client.map.border);
        assertTrue(borders[70] instanceof tddjs.client.map.border);
    },
    
    "test Should only create valid borders": function ()
    {
        this.mapGenerator.setGridSize(7,6);
        this.mapGenerator.initCountries();
        this.mapGenerator.initBorders();
        
        var borders = this.mapGenerator.getMapGrid().borders;
        
        assertTrue(borders[0].getLeftCountry() !== borders[0].getRigthCountry());
        assertTrue(borders[42].getLeftCountry() !== borders[42].getRigthCountry());
        assertTrue(borders[70].getLeftCountry() !== borders[70].getRigthCountry());
    },
    
    "test Shouldnt be able to call initBorders without calling initCountries and setGrid first": function()
    {
        var gen = this.mapGenerator;
        
        assertException(function(){gen.initBorders();}, "Error");
        
        gen.setGridSize(7,6);
        assertException(function(){gen.initBorders();}, "Error");     
    },
    
    "test Should be able to call initBorders once": function()
    {
        var gen = this.mapGenerator;
        gen.setGridSize(7,6);
        gen.initCountries();
        
        assertNoException(function(){gen.initBorders();});
        assertException(function(){gen.initBorders();}, "Error");
    },
    
    "test Should be able to collect all current countries": function()
    {
        this.mapGenerator.setGridSize(7,6);
        this.mapGenerator.initCountries();
        this.mapGenerator.initBorders();
        
        var size = this.mapGenerator.collectAllCountries().length;
        
        assertTrue(size >= 0);
        assertEquals(42, size);
    },
    
    "test Should be able to collect all neighbor countries of a countrie": function()
    {
        this.mapGenerator.setGridSize(7,6);
        this.mapGenerator.initCountries();
        this.mapGenerator.initBorders();
        
        var neighbors = this.mapGenerator.collectNeighborCountries(this.mapGenerator.getMapGrid().cellGrid[0][0]);
        var neighbors2 = this.mapGenerator.collectNeighborCountries(this.mapGenerator.getMapGrid().cellGrid[1][1]);
        
        assertEquals(2, neighbors.length );
        assertEquals(this.mapGenerator.getMapGrid().cellGrid[0][1], neighbors.pop());
        assertEquals(this.mapGenerator.getMapGrid().cellGrid[1][0], neighbors.pop());
        
        assertEquals(4, neighbors2.length);
        assertEquals(this.mapGenerator.getMapGrid().cellGrid[1][2], neighbors2.pop());
        assertEquals(this.mapGenerator.getMapGrid().cellGrid[2][1], neighbors2.pop());
        assertEquals(this.mapGenerator.getMapGrid().cellGrid[1][0], neighbors2.pop());
        assertEquals(this.mapGenerator.getMapGrid().cellGrid[0][1], neighbors2.pop());
    },
    
     "test Shouldnt be able to call collectAllCountries without neccassary initialisisations": function()
    {
        var gen = this.mapGenerator;
        
        assertException(function(){gen.collectAllCountries();}, "Error");
        
        gen.setGridSize(7,6);
        assertException(function(){gen.collectAllCountries();}, "Error");
        
        gen.initCountries();
        assertException(function(){gen.collectAllCountries();}, "Error");    
    },
    
    "test Shouldnt be able to call collectNeigbourCountries without initialisation": function()
    {
        var country = new tddjs.client.map.country();
        var gen = this.mapGenerator;
        
        assertException(function(){gen.collectNeighborCountries(country);}, "Error");
        
        gen.setGridSize(7,6);
        assertException(function(){gen.collectNeighborCountries(country);}, "Error");
        
        gen.initCountries();
        assertException(function(){gen.collectNeighborCountries(country);}, "Error");
    },
    
    "test Should be able to call collectAllCountries after initialisation": function()
    {
        var gen = this.mapGenerator;
        
        gen.setGridSize(7,6);
        gen.initCountries();
        gen.initBorders();
        
        assertNoException(function(){gen.collectAllCountries();});
    },
    
    "test Should be able to call collectNeigbourCountries after initialisation": function()
    {
        var country = new tddjs.client.map.country();
        var gen = this.mapGenerator;
       
        gen.setGridSize(7,6);
        gen.initCountries();
        gen.initBorders();
        
        assertNoException(function(){gen.collectNeighborCountries(country);});
    },
    
    "test Shouldnt be able to call CollectNeighbors with something thats not a country": function()
    {
        var gen = this.mapGenerator;
        var x = 5;
        var country = new tddjs.client.map.country();
        
        this.mapGenerator.setGridSize(7,6);
        this.mapGenerator.initCountries();
        this.mapGenerator.initBorders();
        
        assertException(function(){gen.collectNeighborCountries(x);}, "TypeError");
        assertNoException(function(){gen.collectNeighborCountries(country);});
    },
    
    "test If Borders are useless for the map generation, they have to be removed": function()
    {
        this.mapGenerator.setGridSize(7,6);
        this.mapGenerator.initCountries();
        this.mapGenerator.initBorders();
        
        this.mapGenerator.mergeIntoCountry(this.mapGenerator.getMapGrid().cellGrid[0][0],this.mapGenerator.getMapGrid().cellGrid[0][1]);
        this.mapGenerator.removeCircularAndDuplicateBorders();
        
        assertEquals(70, this.mapGenerator.getMapGrid().borders.length);
    },
    
    "test Cant remove useless borders if there arent one created yet": function()
    {
        var gen = this.mapGenerator;
        
        assertException(function(){gen.removeCircularAndDuplicateBorders();}, "Error");
        
        this.mapGenerator.setGridSize(7,6);
        assertException(function(){gen.removeCircularAndDuplicateBorders();}, "Error");
        
        this.mapGenerator.initCountries();
        assertException(function(){gen.removeCircularAndDuplicateBorders();}, "Error");     
    },
    
    "test Can remove useless Borders if they are created": function()
    {
        var gen = this.mapGenerator;
        
        this.mapGenerator.setGridSize(7,6);
        this.mapGenerator.initCountries();
        this.mapGenerator.initBorders();
        
        assertNoException(function(){gen.removeCircularAndDuplicateBorders();});
    },
     
    "test mergeIntoCountry should combine two countries into one": function()
    {
        this.mapGenerator.setGridSize(7,6);
        this.mapGenerator.initCountries();
        this.mapGenerator.initBorders();        
        var country1 = this.mapGenerator.getMapGrid().cellGrid[0][0];
        var country2 = this.mapGenerator.getMapGrid().cellGrid[0][1];
        var country3 = this.mapGenerator.getMapGrid().cellGrid[1][1];
        var country4 = this.mapGenerator.getMapGrid().cellGrid[1][0];
        
        this.mapGenerator.mergeIntoCountry(country1, country2);
        this.mapGenerator.removeCircularAndDuplicateBorders();   
        
        assertEquals(this.mapGenerator.getMapGrid().cellGrid[0][0], country2);
        
        this.mapGenerator.mergeIntoCountry(country4,country3);
        this.mapGenerator.removeCircularAndDuplicateBorders();
        
        assertEquals(this.mapGenerator.getMapGrid().cellGrid[1][0], country3);
        
        this.mapGenerator.mergeIntoCountry(country2, country3);
        this.mapGenerator.removeCircularAndDuplicateBorders();
        
        assertEquals(this.mapGenerator.getMapGrid().cellGrid[0][0], country3);
        assertEquals(this.mapGenerator.getMapGrid().cellGrid[1][0], country3);
        assertEquals(this.mapGenerator.getMapGrid().cellGrid[0][1], country3);     
        assertEquals(this.mapGenerator.collectAllCountries().length, 39);
    },
    
    "test Shouldn´t be able to call merge without initialisation": function()
    {
        var gen = this.mapGenerator;
        var country = new tddjs.client.map.country();
        var country2 = new tddjs.client.map.country();
        
        assertException(function(){gen.mergeIntoCountry(country,country2);}, "Error");
        
        this.mapGenerator.setGridSize(7,6);
        assertException(function(){gen.mergeIntoCountry(country,country2);}, "Error");
        
        this.mapGenerator.initCountries();
        assertException(function(){gen.mergeIntoCountry(country,country2);}, "Error");    
    },
    
    "test Should be able to call merge after initialisation": function()
    {
        var gen = this.mapGenerator;
        var country = new tddjs.client.map.country();
        var country2 = new tddjs.client.map.country();
        
        this.mapGenerator.setGridSize(7,6);    
        this.mapGenerator.initCountries();
        this.mapGenerator.initBorders();
        
        assertNoException(function(){gen.mergeIntoCountry(country,country2);});
    },
    
    "test Should only able to call mergeCountries with valid countries": function()
    {
        var x =5;
        var country = new tddjs.client.map.country();
        var gen =this.mapGenerator;
        
        this.mapGenerator.setGridSize(7,6);    
        this.mapGenerator.initCountries();
        this.mapGenerator.initBorders();
        
        assertException(function(){gen.mergeIntoCountry(x,x);}, "TypeError");
        assertException(function(){gen.mergeIntoCountry(country,x);}, "TypeError");
        assertException(function(){gen.mergeIntoCountry(x,country);}, "TypeError");
        assertException(function(){gen.mergeIntoCountry(country,country);}, "Error");
    },
    
    //Hier
    "test Should have generated bigger countries after Combination": function()
    {
        this.mapGenerator.setGridSize(7,6);
        this.mapGenerator.initCountries();
        this.mapGenerator.initBorders();
        this.mapGenerator.combineCountryCells();
        
        var size = this.mapGenerator.collectAllCountries().length;
        
        assertEquals(16 ,size);
    },
    
    "test Countries should have a id after Combination": function()
    {
        this.mapGenerator.setGridSize(7,6);
        this.mapGenerator.initCountries();
        this.mapGenerator.initBorders();
        this.mapGenerator.combineCountryCells();
        
        var countries = this.mapGenerator.collectAllCountries();
        
        assertTrue(countries[0].id >= 1);
        assertTrue(countries[5].id >= 1);
        assertTrue(countries[10].id >= 1);
        assertTrue(countries[15].id >= 1);
    },
    
    "test Shouldnt be able to call Combination without neccessary steps first": function()
    {
        var gen = this.mapGenerator;
        
        assertException(function(){gen.combineCountryCells();},"Error");
        
        this.mapGenerator.setGridSize(7,6);
        assertException(function(){gen.combineCountryCells();},"Error");
        
        this.mapGenerator.initCountries();
        assertException(function(){gen.combineCountryCells();},"Error"); 
    },
    
    "test Should be able to call Combination after initialisation": function()
    {
        var gen = this.mapGenerator;
        
        this.mapGenerator.setGridSize(7,6);
        this.mapGenerator.initCountries();
        this.mapGenerator.initBorders();
        
        assertNoException(function(){gen.combineCountryCells();});
    },
    
    "test CollectAllCountriesBelowMinSize returns a List of Countries smaller than min size": function()
    {
        var grid = this.mapGenerator.getMapGrid();
        this.mapGenerator.setGridSize(3,3);
        this.mapGenerator.initCountries();
        this.mapGenerator.initBorders();
        this.mapGenerator.mergeIntoCountry(grid.cellGrid[0][0], grid.cellGrid[0][1]);
        this.mapGenerator.mergeIntoCountry(grid.cellGrid[1][0], grid.cellGrid[0][1]);
        
        var result = this.mapGenerator.collectAllCountriesBelowMinSize();
        
        assertEquals(7, result.length);
        assertEquals(1, result[0].size);
        assertEquals(1, result[1].size);
        assertEquals(1, result[2].size);
        assertEquals(1, result[3].size);
        assertEquals(1, result[4].size);
        assertEquals(1, result[5].size);
        assertEquals(1, result[6].size);
    },
    
    "test CollectAllCountriesBelowMinSize shouldnt be able to be called before initialisation": function()
    {
        var gen = this.mapGenerator;
        
        assertException(function(){gen.collectAllCountriesBelowMinSize();}, "Error");
        
        this.mapGenerator.setGridSize(3,3);
        assertException(function(){gen.collectAllCountriesBelowMinSize();}, "Error");
        
        this.mapGenerator.initCountries();
        assertException(function(){gen.collectAllCountriesBelowMinSize();}, "Error");
    },
    
    "test CollectAllCountryBelowMinSize should be able to be called after initialisation": function()
    {
        var gen = this.mapGenerator;
        this.mapGenerator.setGridSize(3,3);
        this.mapGenerator.initCountries();
        this.mapGenerator.initBorders();
        
        assertNoException(function(){gen.collectAllCountriesBelowMinSize();});
        
    }
}),

TestCase("MapGeneratorTest", {
    
    setUp: function () {
        this.mapGenerator = new tddjs.server.controller.mapGenerator();
        this.x = 15;
        this.y = 15;
    },
    
    tearDown: function () {},
    
    "test object of MapGenerator should not be undefined": function () { 
       assertObject(this.mapGenerator);
    },
    
    "test Object of MapGenerator should have the needed functions": function (){
        assertFunction(this.mapGenerator.setGridSize);
        assertFunction(this.mapGenerator.getMapHeight);
        assertFunction(this.mapGenerator.getMapWidth);
        assertFunction(this.mapGenerator.generateMap);
        assertFunction(this.mapGenerator.initCountries);
        assertFunction(this.mapGenerator.initBorders);
        assertFunction(this.mapGenerator.collectAllCountries);
        assertFunction(this.mapGenerator.collectNeighborCountries);
        assertFunction(this.mapGenerator.removeCircularAndDuplicateBorders);
        assertFunction(this.mapGenerator.combineCountryCells);
    },
    
     "test grid should be a object": function()
    {
        assertObject(this.mapGenerator.getMapGrid());
    },
    
    "test if MapGenerator can get a correct GridSize": function()
    {            
        this.mapGenerator.setGridSize(this.x,this.y);
        
        assertEquals(this.mapGenerator.getMapWidth(),this.x);
        assertEquals(this.mapGenerator.getMapHeight(),this.y);     
    },
    
    "test if MapGenerator can only set a correct GridSize": function()
    {
        var gen = this.mapGenerator;
        var x = "fff";
        
        assertException(function(){gen.setGridSize(5,-2);},"Error");
        assertException(function(){gen.setGridSize(-5,2);},"Error");
        assertException(function(){gen.setGridSize(0,0);},"Error");
        assertException(function(){gen.setGridSize(x,x);},"TypeError");
    },
    
    "test Should be able to get a Minimum-Countrysize": function()
    {   
        assertEquals(3, this.mapGenerator.getMinimumCountrySize());
    },
    
    "test Should be able to set the Minimum-Countrysize": function()
    {
        this.mapGenerator.setMinimumCountrySize(4);
        
        assertEquals(4, this.mapGenerator.getMinimumCountrySize());
    },
    
    "test Shouldnt be able to set invalid Minimum-Countrysize": function()
    {
        var gen = this.mapGenerator;
        
        assertException(function(){gen.setMinimumCountrySize("fff");}, "TypeError");
        assertException(function(){gen.setMinimumCountrySize(-10);}, "Error");
    },
    
    "test Should be able to get a Maximum-Countrysize": function()
    {   
        assertEquals(20, this.mapGenerator.getMaximumCountrySize());
    },
    
    "test Should be able to set the Maximum-Countrysize": function()
    {
        this.mapGenerator.setMaximumCountrySize(4);
        
        assertEquals(4, this.mapGenerator.getMaximumCountrySize());
    },
    
    "test Shouldnt be able to set invalid Maximum-Countrysize": function()
    {
        var gen = this.mapGenerator;
        
        assertException(function(){gen.setMaximumCountrySize("fff");}, "TypeError");
        assertException(function(){gen.setMaximumCountrySize(-10);}, "Error");
    },
    
    "test generateMap() should return a Map-Object":  function()
    {
        this.mapGenerator.setGridSize(this.x,this.y);
        
        var map = this.mapGenerator.generateMap();
        
        assertObject(map);
        assertTrue(map instanceof tddjs.client.map.map);
    },
    
    //??
    "test Shouldnt be able to generate a Map without doing the neccessary steps first": function()
    {
        var gen = this.mapGenerator;
        
        assertException(function(){gen.generateMap();}, "Error");
    },
    
    "test generateMap should return a map-object with atleast one continent": function()
    {
        this.mapGenerator.setGridSize(this.x,this.y);
        var map = this.mapGenerator.generateMap();
        
        assertTrue(map.getContinentCount() > 0);
    }
});