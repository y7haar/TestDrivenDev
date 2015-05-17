/* 
 * Source-Code for MapGenerator
 */

tddjs.namespace("server.controller").mapGenerator =  mapGenerator;

function mapGenerator()
{
    var _grid = {};
    var calledInitCountries = false;
    
    function setGridSize(x,y){
        _grid.cellGrid = createArray(x,y);
        calledInitCountries = false;
    }
    
    function getMapGrid(){
        return _grid;
    }
    function getMapWidth(){
        return _grid.cellGrid.length;
    }
    function getMapHeight(){
        return _grid.cellGrid[0].length;
    }
    
    function createArray(length) {
        var arr = new Array(length || 0),
            i = length;

        if (arguments.length > 1) {
            var args = Array.prototype.slice.call(arguments, 1);
            while(i--) arr[length-1 - i] = createArray.apply(this, args);
        }

        return arr;
    }
    
    function generateMap()
    {
        if(typeof(_grid.cellGrid) === "undefined")
            throw new Error("Didnt set grid before");
        
        return new tddjs.client.map.map();
    }
    
    //Belegt jede Zelle mit einem neuen Land
    function initCountries()
    {
        if(typeof(_grid.cellGrid) === "undefined")
            throw new Error("Didnt set grid before");
        
        for(var i = 0; i < getMapWidth(); i++)
        {
            for(var j = 0; j < getMapHeight(); j++)           
            {
                _grid.cellGrid[i][j] = new tddjs.client.map.country();
                _grid.cellGrid[i][j].id = -1;
            }
        }
        
        calledInitCountries = true;
    }
    
    //Erzeugt die alle Borders
    function initBorders()
    {
        if(!calledInitCountries)
            throw new Error("Didnt call required Functions before");
        else
        calledInitCountries = false;
    }
    
    this.setGridSize = setGridSize;
    this.getMapGrid = getMapGrid;
    this.getMapWidth = getMapWidth;
    this.getMapHeight = getMapHeight;
    this.generateMap = generateMap;
    this.initCountries = initCountries;
    this.initBorders = initBorders;
};