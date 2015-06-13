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
        var cellGrid = this.mapGenerator.getMapGrid();
        
        assertTrue(cellGrid[0][0].isCountry);
        assertTrue(cellGrid[1][0].isCountry);
        assertTrue(cellGrid[0][1].isCountry);
        assertTrue(cellGrid[3][3].isCountry);
        assertTrue(cellGrid[6][5].isCountry);
        assertTrue(cellGrid[5][6].isCountry);
        assertTrue(cellGrid[6][6].isCountry);
    },
    
    "test After initCountries every gridCell should contain a contry with a valid id": function()
    {
        this.mapGenerator.setGridSize(7,7);
        this.mapGenerator.initCountries();
        var cellGrid = this.mapGenerator.getMapGrid();
        
        assertEquals(1, cellGrid[0][0].id);
        assertEquals(3, cellGrid[2][0].id);
        assertEquals(7, cellGrid[6][0].id);
        assertEquals(8, cellGrid[0][1].id);
        assertEquals(25, cellGrid[3][3].id);
        assertEquals(41, cellGrid[5][5].id);
        assertEquals(42, cellGrid[6][5].id);
        assertEquals(48, cellGrid[5][6].id);
        assertEquals(49, cellGrid[6][6].id);
    },
    
    "test After Initialisation every country should have the size 1": function()
    {
        this.mapGenerator.setGridSize(7,7);
        this.mapGenerator.initCountries();
        var cellGrid = this.mapGenerator.getMapGrid();
        
        assertEquals(1, cellGrid[0][0].size);
        assertEquals(1, cellGrid[1][0].size);
        assertEquals(1, cellGrid[0][1].size);
        assertEquals(1, cellGrid[3][3].size);
        assertEquals(1, cellGrid[5][5].size);
        assertEquals(1, cellGrid[5][6].size);
        assertEquals(1, cellGrid[6][5].size);
        assertEquals(1, cellGrid[6][6].size);
    },
    
    "test After initBorders every possible Border should have been created correctly": function()
    {
        this.mapGenerator.setGridSize(3,3);
        this.mapGenerator.initCountries();
        var grid = this.mapGenerator.getMapGrid();
        var country1 = grid[0][0];
        var country2 = grid[1][0];
        var country3 = grid[1][1];
        var country4 = grid[2][2];
        
        this.mapGenerator.initBorders();
        
        assertEquals(2, country1.borders.length);
        assertEquals(grid[1][0], country1.borders[0]);
        assertEquals(grid[0][1], country1.borders[1]);
        
        assertEquals(3, country2.borders.length);
        assertEquals(grid[0][0], country2.borders[0]);
        assertEquals(grid[2][0], country2.borders[1]);
        assertEquals(grid[1][1], country2.borders[2]);
        
        assertEquals(4, country3.borders.length);
        assertEquals(grid[1][0], country3.borders[0]);
        assertEquals(grid[0][1], country3.borders[1]);
        assertEquals(grid[2][1], country3.borders[2]);
        assertEquals(grid[1][2], country3.borders[3]);
        
        assertEquals(2, country4.borders.length);
        assertEquals(grid[2][1], country4.borders[0]);
        assertEquals(grid[1][2], country4.borders[1]);
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
    
    "test Should be able to get all current countries": function()
    {
        this.mapGenerator.setGridSize(7,6);
        this.mapGenerator.initCountries();
        this.mapGenerator.initBorders();
        
        var size = this.mapGenerator.getAllCountries().length;
        
        assertEquals(42, size);
    },
    
     "test Shouldnt be able to call getAllCountries without neccassary initialisisations": function()
    {
        var gen = this.mapGenerator;
        
        assertException(function(){gen.getAllCountries();}, "Error");
        
        gen.setGridSize(7,6);
        assertException(function(){gen.getAllCountries();}, "Error");    
    },
    
    "test Should be able to call getAllCountries after initialisation": function()
    {
        var gen = this.mapGenerator;
        
        gen.setGridSize(7,6);
        gen.initCountries();
        
        assertNoException(function(){gen.getAllCountries();});
    },
    
    "test After a merge of two Countries the borders have to be setted correctly": function()
    {
        this.mapGenerator.setGridSize(3,3);
        this.mapGenerator.initCountries();
        this.mapGenerator.initBorders();
        var grid = this.mapGenerator.getMapGrid();
        
        this.mapGenerator.mergeIntoCountry(grid[0][0], grid[1][0]);
        //Zielland
        assertEquals(3, grid[1][0].borders.length);
        assertEquals(grid[2][0], grid[1][0].borders[0]);
        assertEquals(grid[1][1], grid[1][0].borders[1]);
        assertEquals(grid[0][1], grid[1][0].borders[2]);
        //Land neben dem gemergten
        assertEquals(3, grid[0][1].borders.length);
        assertEquals(grid[1][1], grid[0][1].borders[0]);
        assertEquals(grid[0][2], grid[0][1].borders[1]);
        assertEquals(grid[1][0], grid[0][1].borders[2]);
        
        
        this.mapGenerator.mergeIntoCountry(grid[2][0], grid[1][0]);
        
        //Zielland
        assertEquals(3, grid[1][0].borders.length);
        assertEquals(grid[1][1], grid[1][0].borders[0]);
        assertEquals(grid[0][1], grid[1][0].borders[1]);
        assertEquals(grid[2][1], grid[1][0].borders[2]);
        //Land über 0/0
        assertEquals(3, grid[0][1].borders.length);
        assertEquals(grid[1][1], grid[0][1].borders[0]);
        assertEquals(grid[0][2], grid[0][1].borders[1]);
        assertEquals(grid[1][0], grid[0][1].borders[2]);
        //Land über 1/0
        assertEquals(4, grid[1][1].borders.length);
        assertEquals(grid[1][0], grid[1][1].borders[0]);
        assertEquals(grid[0][1], grid[1][1].borders[1]);
        assertEquals(grid[2][1], grid[1][1].borders[2]);
        assertEquals(grid[1][2], grid[1][1].borders[3]);
        console.log(grid[2][1].borders);
          //Land über 2/0
        assertEquals(3, grid[2][1].borders.length);
        assertEquals(grid[1][1], grid[2][1].borders[0]);
        assertEquals(grid[2][2], grid[2][1].borders[1]);
        assertEquals(grid[1][0], grid[2][1].borders[2]);
    },
     
    "test mergeIntoCountry should combine two countries into one": function()
    {
        this.mapGenerator.setGridSize(7,6);
        this.mapGenerator.initCountries();
        this.mapGenerator.initBorders();
        var cellGrid = this.mapGenerator.getMapGrid();
        var country1 = cellGrid[0][0];
        var country2 = cellGrid[0][1];
        var country3 = cellGrid[1][1];
        var country4 = cellGrid[1][0];
        
        this.mapGenerator.mergeIntoCountry(country1, country2);   
        
        assertEquals(cellGrid[0][0], country2);
        
        this.mapGenerator.mergeIntoCountry(country4,country3);
        
        assertEquals(cellGrid[1][0], country3);
        
        this.mapGenerator.mergeIntoCountry(country2, country3);
        
        assertEquals(cellGrid[0][0], country3);
        assertEquals(cellGrid[1][0], country3);
        assertEquals(cellGrid[0][1], country3);     
        assertEquals(39, this.mapGenerator.getAllCountries().length);
    },
    
    "test Shouldn´t be able to call merge without initialisation": function()
    {
        var gen = this.mapGenerator;
        var country = this.mapGenerator.createCountry(0);
        var country2 = this.mapGenerator.createCountry(0);
        
        assertException(function(){gen.mergeIntoCountry(country,country2);}, "Error");
        
        this.mapGenerator.setGridSize(7,6);
        assertException(function(){gen.mergeIntoCountry(country,country2);}, "Error");
        
        this.mapGenerator.initCountries();
        assertException(function(){gen.mergeIntoCountry(country,country2);}, "Error");    
    },
    
    "test Should be able to call merge after initialisation": function()
    {
        var gen = this.mapGenerator;
        var country = this.mapGenerator.createCountry(0);
        var country2 = this.mapGenerator.createCountry(0);
        
        this.mapGenerator.setGridSize(7,6);    
        this.mapGenerator.initCountries();
        this.mapGenerator.initBorders();
        
        assertNoException(function(){gen.mergeIntoCountry(country,country2);});
    },
    
    "test Should only able to call mergeCountries with valid countries": function()
    {
        var x =5;
        var country = this.mapGenerator.createCountry(0);
        var gen =this.mapGenerator;
        
        this.mapGenerator.setGridSize(7,6);    
        this.mapGenerator.initCountries();
        this.mapGenerator.initBorders();
        
        assertException(function(){gen.mergeIntoCountry(x,x);}, "TypeError");
        assertException(function(){gen.mergeIntoCountry(country,x);}, "TypeError");
        assertException(function(){gen.mergeIntoCountry(x,country);}, "TypeError");
        assertException(function(){gen.mergeIntoCountry(country,country);}, "Error");
    },
    
    "test After merge a Country should have the size of both countrys": function()
    {
        this.mapGenerator.setGridSize(7,6);    
        this.mapGenerator.initCountries();
        this.mapGenerator.initBorders();
        var cellGrid = this.mapGenerator.getMapGrid();
        
        this.mapGenerator.mergeIntoCountry(cellGrid[0][0], cellGrid[0][1]);
                                           
        assertEquals(2, cellGrid[0][0].size);
    },
    
    //Hier
    "test Should have generated bigger countries after Combination": function()
    {
        this.mapGenerator.setGridSize(7,6);
        this.mapGenerator.initCountries();
        this.mapGenerator.initBorders();
        
        this.mapGenerator.combineCountryCells();     
        
        assertEquals(16 , this.mapGenerator.getAllCountries().length);
    },
    
    "test Countries should have a id after Combination": function()
    {
        this.mapGenerator.setGridSize(7,6);
        this.mapGenerator.initCountries();
        this.mapGenerator.initBorders();
        this.mapGenerator.combineCountryCells();
        
        var countries = this.mapGenerator.getAllCountries();
        
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
    
    "test There Should be no Country above MaximumCountrySize after combination": function()
    {     
        this.mapGenerator.setGridSize(7,6);
        this.mapGenerator.initCountries();
        this.mapGenerator.initBorders();
        this.mapGenerator.combineCountryCells();
        var all = this.mapGenerator.getAllCountries();
        
        assertTrue(all[0].size <= 20);
        assertTrue(all[1].size <= 20);
        assertTrue(all[2].size <= 20);
        assertTrue(all[3].size <= 20);
        assertTrue(all[4].size <= 20);
        assertTrue(all[5].size <= 20);
        assertTrue(all[6].size <= 20);
        assertTrue(all[7].size <= 20);
        assertTrue(all[8].size <= 20);
        assertTrue(all[9].size <= 20);
        assertTrue(all[10].size <= 20);
        assertTrue(all[11].size <= 20);
        assertTrue(all[12].size <= 20);
        assertTrue(all[13].size <= 20);
        assertTrue(all[14].size <= 20);
        assertTrue(all[15].size <= 20);
    },
    
    "test CollectAllCountriesBelowMinSize returns a List of Countries smaller than min size": function()
    {
        this.mapGenerator.setGridSize(3,3);
        this.mapGenerator.initCountries();
        this.mapGenerator.initBorders();
        var cellGrid = this.mapGenerator.getMapGrid();
        this.mapGenerator.mergeIntoCountry(cellGrid[0][0], cellGrid[1][0]);
        this.mapGenerator.mergeIntoCountry(cellGrid[0][1], cellGrid[1][0]); 
        this.mapGenerator.mergeIntoCountry(cellGrid[2][2], cellGrid[1][2]);
        
        var result = this.mapGenerator.collectAllCountriesBelowMinSize();
        
        assertEquals(5, result.length);
        assertEquals(1, result[0].size);
        assertEquals(1, result[1].size);
        assertEquals(1, result[2].size);
        assertEquals(1, result[3].size);
        assertEquals(2, result[4].size);
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
    },
    
    "test CollectUnusedNeigborCountriesOfContinent Should Collect All unused Neighbor-Countries of a Continent": function()
    {
        var continent = this.mapGenerator.createContinent(0);
        this.mapGenerator.setGridSize(3,3);
        this.mapGenerator.initCountries();
        this.mapGenerator.initBorders();
        var grid = this.mapGenerator.getMapGrid();
        this.mapGenerator.getCountriesInContinents().push(grid[1][1]);
        continent.countries.push(grid[1][1]);
        
        var neigbors = this.mapGenerator.collectUnusedNeighborCountriesOfContinent(continent);
        
        assertEquals(4, neigbors.length);
        assertEquals(grid[1][0], neigbors[0]);
        assertEquals(grid[0][1], neigbors[1]);
        assertEquals(grid[2][1], neigbors[2]);
        assertEquals(grid[1][2], neigbors[3]);
        
        this.mapGenerator.getCountriesInContinents().push(grid[2][1]);
        continent.countries.push(grid[2][1]);
        neigbors = this.mapGenerator.collectUnusedNeighborCountriesOfContinent(continent);
        
        assertEquals(5, neigbors.length);
        assertEquals(grid[1][0], neigbors[0]);
        assertEquals(grid[0][1], neigbors[1]);
        assertEquals(grid[1][2], neigbors[2]);
        assertEquals(grid[2][0], neigbors[3]);
        assertEquals(grid[2][2], neigbors[4]);
    },
    
    "test Shouldnt be able to call CollectUnusedNeighborCountriesOfContinent before initialisation": function()
    {
        var gen = this.mapGenerator;
        var continent = gen.createContinent(0);
        
        assertException(function(){gen.collectUnusedNeighborCountriesOfContinent(continent);}, "Error");
        
        this.mapGenerator.setGridSize(3,3);
        assertException(function(){gen.collectUnusedNeighborCountriesOfContinent(continent);}, "Error");
        
        this.mapGenerator.initCountries();
        assertException(function(){gen.collectUnusedNeighborCountriesOfContinent(continent);}, "Error");
    },
    
    "test Should be able to call CollectUnusedNeighborCountriesOfContinent after initialisation": function()
    {
        var gen = this.mapGenerator;
        var continent = gen.createContinent(0);
        this.mapGenerator.setGridSize(3,3);
        this.mapGenerator.initCountries();
        this.mapGenerator.initBorders();
        
        assertNoException(function(){gen.collectUnusedNeighborCountriesOfContinent(continent);});
    },
    
    "test CollectUnusedNeighborCountriesOfContinent shouldnt be able to be called with somethings thats not a continent": function()
    {
        var gen = this.mapGenerator;
        this.mapGenerator.setGridSize(3,3);
        this.mapGenerator.initCountries();
        this.mapGenerator.initBorders();
        
        assertException(function(){gen.collectUnusedNeighborCountriesOfContinent(5);}, "TypeError");
    },
    
    "test calculateUnitBonus Should calculate the correctBonus": function()
    {
        var gen = this.mapGenerator;
        var continent = gen.createContinent(0);
        var continent1 = gen.createContinent(0);
        var continent2 = gen.createContinent(0);
        var continent3 = gen.createContinent(0);
        var continent4 = gen.createContinent(0);
        var continent5 = gen.createContinent(0);
        var continent6 = gen.createContinent(0);
        this.mapGenerator.setGridSize(3,3);
        this.mapGenerator.initCountries();
        this.mapGenerator.initBorders();
        var grid = this.mapGenerator.getMapGrid();
        continent1.countries.push(grid[2][2]);
        continent2.countries.push(grid[2][2]);
        continent2.countries.push(grid[2][1]);
        continent3.countries.push(grid[2][2]);
        continent3.countries.push(grid[2][1]);
        continent3.countries.push(grid[2][0]);
        continent4.countries.push(grid[1][1]);
        continent5.countries.push(grid[1][1]);
        continent5.countries.push(grid[0][1]);
        continent6.countries.push(grid[1][1]);
        continent6.countries.push(grid[1][2]);
        continent6.countries.push(grid[2][1]);
        continent6.countries.push(grid[2][2]);
        
        var i = this.mapGenerator.calculateUnitBonus(continent);
        assertEquals(0, i);
        
        i = this.mapGenerator.calculateUnitBonus(continent1);
        assertEquals(1, i);
        
        i = this.mapGenerator.calculateUnitBonus(continent2);
        assertEquals(2, i);
             
        i = this.mapGenerator.calculateUnitBonus(continent3);
        assertEquals(3, i);
        
        i = this.mapGenerator.calculateUnitBonus(continent4);
        assertEquals(1, i);
        
        i = this.mapGenerator.calculateUnitBonus(continent5);
        assertEquals(2, i);
        
        i = this.mapGenerator.calculateUnitBonus(continent6);
        assertEquals(3, i);
    },
    
    "test Shouldnt be able to call calculateUnitBonus before initialisation": function()
    {
        var gen = this.mapGenerator;
        var continent = gen.createContinent(0);
        
        assertException(function(){gen.calculateUnitBonus(continent);}, "Error");
        
        this.mapGenerator.setGridSize(3,3);
        assertException(function(){gen.calculateUnitBonus(continent);}, "Error");
        
        this.mapGenerator.initCountries();
        assertException(function(){gen.calculateUnitBonus(continent);}, "Error");
    },
    
    "test Should be able to call calculateUnitBonus after initialisation": function()
    {
        var gen = this.mapGenerator;
        var continent = gen.createContinent(0);
        this.mapGenerator.setGridSize(3,3);
        this.mapGenerator.initCountries();
        this.mapGenerator.initBorders();
        
        assertNoException(function(){gen.calculateUnitBonus(continent);});
    },
    
    "test calculateUnitBonus shouldnt be able to be called with somethings thats not a continent": function()
    {
        var gen = this.mapGenerator;
        this.mapGenerator.setGridSize(3,3);
        this.mapGenerator.initCountries();
        this.mapGenerator.initBorders();
        
        assertException(function(){gen.calculateUnitBonus(5);}, "TypeError");
    }
}),
        
        
TestCase("MapGeneratorTest for Pseudo-Object-Generation", {
    setUp: function ()
    {
        this.mapGenerator = new tddjs.server.controller.mapGenerator();
    },
    
    tearDown: function () {},
    
    "test Should be able to create some object like a country": function()
    {
        var country = this.mapGenerator.createCountry(0);
        
        assertEquals(true, country.isCountry);
        assertEquals(0, country.id);
        assertEquals("Id:0", country.name);
        assertEquals(1, country.size);
        assertArray(country.borders);
    },
    
    "test Should be able to create some object like a continent": function()
    {
        var continent = this.mapGenerator.createContinent(0);
        
        assertEquals(true, continent.isContinent);
        assertEquals(0, continent.id);
        assertEquals("Id:0", continent.name);
        assertEquals(0, continent.unitBonus);
        assertArray(continent.countries);
    },
    
    "test Should be able to create some object like a map": function()
    {
        var map = this.mapGenerator.createMap();
        
        assertEquals(true, map.isMap);
        assertArray(map.continents);
    }
}),
        
TestCase("MapGeneratorTest for Setter and Getters",
{   
    setUp: function () {
        this.mapGenerator = new tddjs.server.controller.mapGenerator();
        this.x = 15;
        this.y = 15;
    },
    
    tearDown: function () {},
    
     "test grid should have set the correct width and height": function ()
    {
        this.mapGenerator.setGridSize(10,5);
        
        assertEquals(10, this.mapGenerator.getMapWidth());
        assertEquals(5, this.mapGenerator.getMapHeight()); 
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
        assertException(function(){gen.setMaximumCountrySize(2);}, "Error");
    },
    
    "test Should be able to get Variable CountriesInContinents": function()
    {
        var array = this.mapGenerator.getCountriesInContinents();
        
        assertObject(array);
    },
    
    "test Shoult be able to get MinimumContinentNumber": function()
    {
        assertEquals(4, this.mapGenerator.getMinimumContinentNumber());
    },
    
    "test Shoult be able to set MinimumContinentNumber": function()
    {
        this.mapGenerator.setMinimumContinentNumber(4);
        
        assertEquals(4, this.mapGenerator.getMinimumContinentNumber());
    },
    
    "test Shouldnt be able to set invalid MinimumContinentNumber": function()
    {
        var gen = this.mapGenerator;
        
        assertException(function(){gen.setMinimumContinentNumber("fff");}, "TypeError");
        assertException(function(){gen.setMinimumContinentNumber(-10);}, "Error");
        assertException(function(){gen.setMinimumContinentNumber(1);}, "Error");
    },
    
    "test Shoult be able to get MaximumContinentNumber": function()
    {
        assertEquals(8, this.mapGenerator.getMaximumContinentNumber());
    },
    
    "test Shoult be able to setMaximumContinentNumber": function()
    {
        this.mapGenerator.setMaximumContinentNumber(6);
        
        assertEquals(6, this.mapGenerator.getMaximumContinentNumber());
    },
    
    "test Shouldnt be able to set invalid MaximumContinentNumber": function()
    {
        var gen = this.mapGenerator;
        
        assertException(function(){gen.setMaximumContinentNumber("fff");}, "TypeError");
        assertException(function(){gen.setMaximumContinentNumber(-10);}, "Error");
        assertException(function(){gen.setMaximumContinentNumber(3);}, "Error");
    }
});



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
        assertFunction(this.mapGenerator.getMaximumCountrySize);
        assertFunction(this.mapGenerator.setMaximumCountrySize);
        assertFunction(this.mapGenerator.getMinimumCountrySize);
        assertFunction(this.mapGenerator.setMinimumCountrySize);
    },
    
     "test grid should be a Array": function()
    {
        this.mapGenerator.setGridSize(5,5);
        assertArray(this.mapGenerator.getMapGrid());
    },
    
    "test generateMap() should return a Map-Object":  function()
    {
        this.mapGenerator.setGridSize(this.x,this.y);
        
        var map = this.mapGenerator.generateMap();
        
        assertObject(map);
        assertTrue(map.isMap);
    },
    
    //??
    "test Shouldnt be able to generate a Map without doing the neccessary steps first": function()
    {
        var gen = this.mapGenerator;
        
        assertException(function(){gen.generateMap();}, "Error");
    },
    
    "test After generation there Should be no countrys below minCountrySize": function()
    {
        this.mapGenerator.setGridSize(this.x,this.y);
        
        this.mapGenerator.generateMap();
        
        assertEquals(0, this.mapGenerator.collectAllCountriesBelowMinSize().length);
    },
    
    "test generateMap should return a map-object with atleast minimumContinents": function()
    {
        this.mapGenerator.setGridSize(this.x,this.y);
        var map = this.mapGenerator.generateMap();
        
        assertTrue(this.mapGenerator.getMinimumContinentNumber() >= map.continents.length);
    },
    
    "test generateMap should only generate maps with continents above minContinentSize": function()
    {
        this.mapGenerator.setGridSize(this.x,this.y);
        
        var map = this.mapGenerator.generateMap();
        var continents = map.continents;      
        
        assertTrue(continents[0].countries.length >= 2);
        assertTrue(continents[Math.floor(continents.length/2)].countries.length >= 2);
        assertTrue(continents[continents.length-1].countries.length >= 2);
    }
});


/*
 * "test Shouldnt be able to call collectNeighborCountries without initialisation": function()
    {
        var country = new tddjs.client.map.country();
        var gen = this.mapGenerator;
        
        assertException(function(){gen.collectNeighborCountries(country);}, "Error");
        
        gen.setGridSize(7,6);
        assertException(function(){gen.collectNeighborCountries(country);}, "Error");
        
        gen.initCountries();
        assertException(function(){gen.collectNeighborCountries(country);}, "Error");
    },
    
    "test Should be able to call collectNeighborCountries after initialisation": function()
    {
        var country = new tddjs.client.map.country();
        var gen = this.mapGenerator;
       
        gen.setGridSize(7,6);
        gen.initCountries();
        gen.initBorders();
        
        assertNoException(function(){gen.collectNeighborCountries(country);});
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
 */