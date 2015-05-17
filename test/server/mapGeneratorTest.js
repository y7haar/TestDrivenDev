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