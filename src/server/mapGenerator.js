/* 
 * Source-Code for MapGenerator
 */

tddjs.namespace("server.controller").mapGenerator =  mapGenerator;

function mapGenerator()
{
    //Gewissermaßen die Welt
    var _grid = {};
    //Variablen für den bisherigen Aufruf
    var calledInitCountries = false;
    var calledInitBorders = false;
    
    var GRID_CELL_COMBINES_PER_COUNTRY =2.5;
    
    function setGridSize(x,y)
    {
        if(x <= 0 || y <= 0)
            throw new Error("A Grid is not allowed to be zero Width or Height");
        _grid.cellGrid = createArray(x,y);
        calledInitCountries = false;
        calledInitBorders = false;
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
    
    //Theoretisch gehört hier die Endabfertigung rein
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
        //Auf gesamter Breite
        for(var i = 0; i < getMapWidth(); i++)
        {   //Auf gesamter Höhe
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
        {
            //Array erzeugen
            _grid.borders = [];
            //Auf gesamter Breite
            for(var x = 0; x < getMapWidth(); x++)
            {
                //Auf gesamter Höhe
                for(var y = 0; y < getMapHeight(); y++)
                {
                    var nextX = x+1;
                    var nextY = y+1;
                    
                    //Rechtsliegende Border hinzufügen
                    if(nextX < getMapWidth())
                    {
                        var border = new tddjs.client.map.border();
                        border.setLeftCountry(_grid.cellGrid[x][y]);
                        border.setRigthCountry(_grid.cellGrid[nextX][y]);
                        _grid.borders.push(border);
                    }
                    //Obere Border hinzufügen
                    if(nextY < getMapHeight())
                    {
                        var border = new tddjs.client.map.border();
                        border.setLeftCountry(_grid.cellGrid[x][y]);
                        border.setRigthCountry(_grid.cellGrid[x][nextY]);
                        _grid.borders.push(border);
                    }
                }
            }
            calledInitCountries = false;
            calledInitBorders = true;
        }
    }
    
    //Sammelt alle Länder
    function collectAllCountries()
    {
        if(!calledInitBorders)
            throw new Error("There are no Borders to work with yet");
        
        var countries = [];
        
        //Länder hinzufügen
        for(var i = 0; i < _grid.borders.length; i++)
        {
            countries.push(_grid.borders[i].getLeftCountry());
            countries.push(_grid.borders[i].getRigthCountry());
        }
        //Duplikate entfernen
        countries = removeDuplicates(countries);
        return countries;
    }
    
    //Hilfsmethode um Duplikate in Listen zu vermeiden vll später verbessern
    function removeDuplicates(array)
    {
        var newArray = [];
        
        for(var i = 0; i < array.length; i++)
        {
            var value = array[i];
            var double = false;
            
            for(var j = 0; j < newArray.length; j++)
            {
                if(newArray[j] === value)
                    double = true;
            }
            
            if(!double)
                newArray.push(value);
        }
        return newArray;
    }
    
    //Sammelt Nachbarländer eines Landes
    function collectNeighborCountries(country)
    {
        if(!calledInitBorders)
            throw new Error("There are no Borders to work with yet");
        if(!(country instanceof tddjs.client.map.country))
            throw new TypeError("Given value is not a country");
        
        var countries = [];
        
         //Länder hinzufügen
        for(var i = 0; i < _grid.borders.length; i++)
        {
            if(_grid.borders[i].getLeftCountry() === country)
                countries.push(_grid.borders[i].getRigthCountry());
            
            if(_grid.borders[i].getRigthCountry() === country)
                countries.push(_grid.borders[i].getLeftCountry());
        }
        //Duplikate entfernen
        countries = removeDuplicates(countries);
        return countries;
    }
    
    //Kombiniert Länder zu größeren Ländern
    function combineCountryCells()
    {
        if(!calledInitBorders)
            throw new Error("There are no Borders to work with yet");
        
        //Kombinationswert
        var combineCount = (( getMapWidth() * getMapHeight()) * (GRID_CELL_COMBINES_PER_COUNTRY - 1))/ GRID_CELL_COMBINES_PER_COUNTRY;
    }
    
    this.setGridSize = setGridSize;
    this.getMapGrid = getMapGrid;
    this.getMapWidth = getMapWidth;
    this.getMapHeight = getMapHeight;
    
    this.collectAllCountries = collectAllCountries;
    this.collectNeighborCountries = collectNeighborCountries;
    
    this.generateMap = generateMap;
    this.initCountries = initCountries;
    this.initBorders = initBorders;
    this.combineCountryCells = combineCountryCells;
};