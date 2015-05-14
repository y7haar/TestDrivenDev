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
    
    "test if MapGenerator can set a GridSize": function() {
        assertFunction(this.mapGenerator.setGridSize);
        assertFunction(this.mapGenerator.getMapHeight);
        assertFunction(this.mapGenerator.getMapWidth);
        this.mapGenerator.setGridSize(this.x,this.y);
        assertEquals(this.mapGenerator.getMapWidth(),this.x);
        assertEquals(this.mapGenerator.getMapHeight(),this.y);
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
    
    "test After initBorders every possible Border should have been created": function()
    {
        assertFunktion(this.mapGenerator.initBorders);
    },
    
    "test Shouldnt be able to generate a Map without doing the neccessary steps first": function(){
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