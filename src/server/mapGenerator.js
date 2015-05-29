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
    
    //Variablen für die Erstellung der Karte
    var GRID_CELL_COMBINES_PER_COUNTRY = 2.5;
    
    var minimumCountrySize = 3;
    var maximumCountrySize = 20;
    
    //Setzt das Grid neu
    function setGridSize(x,y)
    {
        if(isNaN(x) || isNaN(y))
            throw new TypeError;
        
        if(x <= 0 || y <= 0)
            throw new Error("A Grid is not allowed to be zero or less Width or Height");
        
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
    
    function getMinimumCountrySize()
    {
        return minimumCountrySize;
    }
    
    function setMinimumCountrySize(size)
    {
        if(isNaN(size))
            throw new TypeError;
        
        if(size <= 0)
            throw new Error("Size musst be one or higher");
        
        minimumCountrySize = size;
    }
    
    function getMaximumCountrySize()
    {
        return maximumCountrySize;
    }
    
    function setMaximumCountrySize(size)
    {
        if(isNaN(size))
            throw new TypeError;
        
        if(size <= 0)
            throw new Error("Size musst be one or higher");
        
        maximumCountrySize = size;
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
                _grid.cellGrid[i][j].size = 1;
            }
        }
        
        calledInitCountries = true;
    }
    
    //Erzeugt die alle Borders
    function initBorders()
    {
        if(!calledInitCountries)
            throw new Error("Didnt call required Functions before");
        
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
    
    //Wählt ein zufälliges Element
    function getRandom(countries)
    {
        var random = Math.round(Math.random()*(countries.length-1));
        return countries[random];
    }
    
    //Kombiniert Länder zufällig
    function combineCountryCells()
    {
        if(!calledInitBorders)
            throw new Error("There are no Borders to work with yet");
        
        //Kombinationswert
        var combineCount = (( getMapWidth() * getMapHeight()) * (GRID_CELL_COMBINES_PER_COUNTRY - 1))/ GRID_CELL_COMBINES_PER_COUNTRY;
        
        //
        for(var i = 0; i < combineCount; i++)
        {
            //Zielland
            winnerCountry = getRandom(collectAllCountries());
            //Aufgelöstes Land
            loserCountry = getRandom(collectNeighborCountries(winnerCountry));

            //Falls das gleiche Land erwischt wird
            if(winnerCountry === loserCountry)
            {
                i--;
                continue;
            }

            mergeIntoCountry(loserCountry, winnerCountry);
            removeCircularAndDuplicateBorders();
        }
        var countries = collectAllCountries();
        for(var x = 0; x < countries.length; x++)
            countries[x].id = x+1;
    }
    
    //Verbindet ein Land in ein anderes
    function mergeIntoCountry(country, targetCountry)
    {
        if(!calledInitBorders)
            throw new Error("There are no borders to work with yet");
        
        if(!(country instanceof tddjs.client.map.country) || !(targetCountry instanceof tddjs.client.map.country))
            throw new TypeError("Can only work with countries");
        
        if(country === targetCountry)
            throw new Error("Cannot merge one country into himself");
        
        //Borders umbelegen
        for(var i = 0; i < _grid.borders.length; i++)
        {
           var border = _grid.borders[i];
           if(border.getLeftCountry() === country)
                border.setLeftCountry(targetCountry);
            
           if(border.getRigthCountry() === country)
               border.setRigthCountry(targetCountry);
        }
        
        //Länderfelder umlegen
        for(var width = 0; width < getMapWidth(); width++)
        {
            for(var height = 0; height < getMapHeight(); height++)
            {
                if(_grid.cellGrid[width][height] === country)
                    _grid.cellGrid[width][height] = targetCountry;
            }
        }
    }
    
    //Entfernt nicht mehr benötigte Borders
    function removeCircularAndDuplicateBorders()
    {
        if(!calledInitBorders)
            throw new Error("There are not borders to work with yet");
        
        var oldBorders = _grid.borders;
        var length = _grid.borders.length;
        _grid.borders = [];
        
        for(var i = 0; i < length; i++)
        {
            var current = oldBorders.pop();
            
            //Nur pushen wenn angrenzendes Land nicht gleich
            if(current.getLeftCountry() !== current.getRigthCountry())
                _grid.borders.push(current);
        }
    }
    
    //###############################################################################################################
    //Funktionsdeklaration
    //############################################################################################################
    this.setGridSize = setGridSize;
    this.getMapGrid = getMapGrid;
    this.getMapWidth = getMapWidth;
    this.getMapHeight = getMapHeight;
    this.getMinimumCountrySize = getMinimumCountrySize;
    this.setMinimumCountrySize = setMinimumCountrySize;
    this.getMaximumCountrySize = getMaximumCountrySize;
    this.setMaximumCountrySize = setMaximumCountrySize;
    this.generateMap = generateMap;
    
    this.collectAllCountries = collectAllCountries;
    this.collectNeighborCountries = collectNeighborCountries;   
    this.initCountries = initCountries;
    this.initBorders = initBorders;
    this.combineCountryCells = combineCountryCells;
    this.mergeIntoCountry = mergeIntoCountry;
    this.removeCircularAndDuplicateBorders = removeCircularAndDuplicateBorders;
};