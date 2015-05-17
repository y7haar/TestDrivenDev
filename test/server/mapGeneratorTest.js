/* 
 * Tests for MapGenerator
 */


TestCase("MapGeneratorTest", {
    
    setUp: function () {
        this.mapGenerator = new tddjs.server.controller.mapGenerator();
        this.x = 5;
        this.y = 5;
    },
    
    tearDown: function () {

    },
    
    "test object of MapGenerator should not be undefined": function () { 
       assertObject(this.mapGenerator);
    },
    
    "test if MapGenerator can set a  correct GridSize": function() {
        assertFunction(this.mapGenerator.setGridSize);
        assertFunction(this.mapGenerator.getMapHeight);
        assertFunction(this.mapGenerator.getMapWidth);
        this.mapGenerator.setGridSize(this.x,this.y);
        assertEquals(this.mapGenerator.getMapWidth(),this.x);
        assertEquals(this.mapGenerator.getMapHeight(),this.y);
        var gen = this.mapGenerator;
        assertException(function(){gen.setGridSize(-5,2);},"Error");
    },
    
    "test grid should be a object": function()
    {
        assertObject(this.mapGenerator.getMapGrid());
    },
    
    "test generateMap() should return a Map-Object":  function()
    {
        this.mapGenerator.setGridSize(7,7);
        var map = this.mapGenerator.generateMap();
        assertFunction(this.mapGenerator.generateMap);
        assertObject(map);
        assertTrue(map instanceof tddjs.client.map.map);
    },
    
    "test Shouldnt be able to initialize Countries without setting a grid first": function()
    {
        var gen = this.mapGenerator;
        assertFunction(this.mapGenerator.initCountries);
        assertException(function(){gen.initCountries();}, "Error");
    },
    
    "test After initCountries every gridCell should contain a country with id -1": function()
    {
        this.mapGenerator.setGridSize(7,7);
        this.mapGenerator.initCountries();
        for(var i = 0; i < this.mapGenerator.getMapWidth(); i++)
        {
            for(var j = 0; j < this.mapGenerator.getMapHeight(); j++)
            {
                var grid = this.mapGenerator.getMapGrid();
                assertTrue(grid.cellGrid[i][j] instanceof(tddjs.client.map.country));
                assertTrue(grid.cellGrid[i][j].id === -1);
            }
        }
    },
    
    "test After initBorders every possible Border should have been created correctly": function()
    {
        assertFunction(this.mapGenerator.initBorders);
        this.mapGenerator.setGridSize(7,6);
        this.mapGenerator.initCountries();
        this.mapGenerator.initBorders();
        var borders = this.mapGenerator.getMapGrid().borders;
        assertTrue(borders.length === 71);
        
        for(var i = 0; i < borders.length; i++)
        {
            assertTrue(borders[i] instanceof tddjs.client.map.border);
            assertTrue(borders[i].getLeftCountry !== borders[i].getRigthCountry);
        }
    },
    
    "test Shouldnt be able to call initBorders without calling initCountries and setGrid first": function()
    {
        var gen = this.mapGenerator;
        assertException(function(){gen.initBorders();}, "Error");
        gen.setGridSize(7,6);
        assertException(function(){gen.initBorders();}, "Error");
        gen.initCountries();
        assertNoException(function(){gen.initBorders();});
        assertException(function(){gen.initBorders();}, "Error");
    },
    
    "test Should be able to collect all current countries": function()
    {
        assertFunction(this.mapGenerator.collectAllCountries);
        this.mapGenerator.setGridSize(7,6);
        this.mapGenerator.initCountries();
        this.mapGenerator.initBorders();
        var size = this.mapGenerator.collectAllCountries().length;
        assertTrue(size >= 0);
        assertEquals(42, size);
    },
    
    "test Should be able to collect all neighbor countries of a countrie": function()
    {
        assertFunction(this.mapGenerator.collectNeighborCountries);
        this.mapGenerator.setGridSize(7,6);
        this.mapGenerator.initCountries();
        this.mapGenerator.initBorders();
        var neighbors = this.mapGenerator.collectNeighborCountries(this.mapGenerator.getMapGrid().cellGrid[0][0]);
        assertEquals(2, neighbors.length );
        neighbors = this.mapGenerator.collectNeighborCountries(this.mapGenerator.getMapGrid().cellGrid[1][1]);
        assertEquals(4, neighbors.length);
        //GGF genau überprüfen noch
    },
    
     "test Should be able to call collectCountrie-Functions without neccassary initialisisations": function()
    {
        var country = new tddjs.client.map.country();
        var gen = this.mapGenerator;
        assertException(function(){gen.collectAllCountries();}, "Error");
        assertException(function(){gen.collectNeighborCountries(country);}, "Error");
        gen.setGridSize(7,6);
        assertException(function(){gen.collectAllCountries();}, "Error");
        assertException(function(){gen.collectNeighborCountries(country);}, "Error");
        gen.initCountries();
        assertException(function(){gen.collectAllCountries();}, "Error");
        assertException(function(){gen.collectNeighborCountries(country);}, "Error");
        gen.initBorders();
        assertNoException(function(){gen.collectAllCountries();});
        assertNoException(function(){gen.collectNeighborCountries(country);});
    },
    
    "test Shouldnt be able to call CollectNeighbors with something thats not a country": function()
    {
        var gen = this.mapGenerator;
        var x = 5;
        this.mapGenerator.setGridSize(7,6);
        this.mapGenerator.initCountries();
        this.mapGenerator.initBorders();
        var country = new tddjs.client.map.country();
        assertException(function(){gen.collectNeighborCountries(x);}, "TypeError");
        assertNoException(function(){gen.collectNeighborCountries(country);});
    },
    
    "test mergeIntoCountry should combine two countries into one": function()
    {
        assertFunction(this.mapGenerator.mergeIntoCountry);
        //TODO
    },
    
    "test Shouldn´t be able to call merge with something thats not a country\n\
     or without neccassary steps before it": function()
    {
        var gen = this.mapGenerator;
        var x =5;
        var country = new tddjs.client.map.country();
        var country2 = new tddjs.client.map.country();
        
        assertException(function(){gen.mergeIntoCountry(country,country2);}, "Error");
        this.mapGenerator.setGridSize(7,6);
        assertException(function(){gen.mergeIntoCountry(country,country2);}, "Error");
        this.mapGenerator.initCountries();
        assertException(function(){gen.mergeIntoCountry(country,country2);}, "Error");
        this.mapGenerator.initBorders();
        
        assertException(function(){gen.mergeIntoCountry(x,x);}, "TypeError");
        assertException(function(){gen.mergeIntoCountry(country,x);}, "TypeError");
        assertException(function(){gen.mergeIntoCountry(x,country);}, "TypeError");
        assertException(function(){gen.mergeIntoCountry(country,country);}, "Error");
    },
    
    "test Should have generated bigger countries after Combination": function()
    {
        assertFunction(this.mapGenerator.combineCountryCells);
        this.mapGenerator.setGridSize(7,6);
        this.mapGenerator.initCountries();
        this.mapGenerator.initBorders();
        this.mapGenerator.combineCountryCells();
        var size = this.mapGenerator.collectAllCountries().length;
        assertTrue(size < 42);
        //GGF noch mehr
    },
    
    "test Shouldnt be able to call Combination without neccessary steps first": function()
    {
        var gen = this.mapGenerator;
        assertException(function(){gen.combineCountryCells();},"Error");
        this.mapGenerator.setGridSize(7,6);
        assertException(function(){gen.combineCountryCells();},"Error");
        this.mapGenerator.initCountries();
        assertException(function(){gen.combineCountryCells();},"Error");
        this.mapGenerator.initBorders();
        assertNoException(function(){gen.combineCountryCells();});
    },
    
    "test Shouldnt be able to generate a Map without doing the neccessary steps first": function()
    {
        var gen = this.mapGenerator;
        assertException(function(){gen.generateMap();}, "Error");
    },
    
    "test generateMap should return a map-object with atleast one continent": function()
    {
        this.mapGenerator.setGridSize(7,7);
        var map = this.mapGenerator.generateMap();
        assertTrue(map.getContinentCount() > 0);
    }
});