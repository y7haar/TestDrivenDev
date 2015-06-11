/* 
 * Source-Code for MapGenerator
 */

tddjs.namespace("server.controller").mapGenerator =  mapGenerator;

function mapGenerator()
{
    //Gewissermaßen die Welt
    var _grid = {};
    var countriesInContinents = [];
    var allCountries = [];
    
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
    
    function getCountriesInContinents()
    {
        return countriesInContinents;
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
    
    //Kompletter Aufruf aller Schritte
    function generateMap()
    {
        if(typeof(_grid.cellGrid) === "undefined")
            throw new Error("Didnt set grid before");
        
        initCountries();
        initBorders();
        combineCountryCells();
        combineRemainingCountries();
        var map = new tddjs.client.map.map();
        initLogicMap(map);
        return map;
    }
    /*test-funktion für die UI*/
    function initLogicMap(map)
    {
        var continent = new tddjs.client.map.continent();
        continent.setName("Continent 1");
        var continent2 = new tddjs.client.map.continent();
        continent2.setName("Continent 2");
        
        var cache_id=[];
        for(var i=0;i<getMapWidth()/2;i++)
        {
            for(var j=0;j<getMapHeight();j++)
            {
                if(cache_id.indexOf(_grid.cellGrid[i][j].id) === -1)
                {
                    _grid.cellGrid[i][j].setName("ID: "+_grid.cellGrid[i][j].id);
                    continent.addCountry(_grid.cellGrid[i][j]);
                }
                cache_id.push(_grid.cellGrid[i][j].id);
            }
        }
        for(var i=Math.floor(getMapWidth()/2);i<getMapWidth();i++)
        {
            for(var j=0;j<getMapHeight();j++)
            {
                if(cache_id.indexOf(_grid.cellGrid[i][j].id) === -1)
                {
                    _grid.cellGrid[i][j].setName("ID: "+_grid.cellGrid[i][j].id);
                    continent2.addCountry(_grid.cellGrid[i][j]);
                }
                cache_id.push(_grid.cellGrid[i][j].id);
            }
        }
        
        map.addContinent(continent);
        map.addContinent(continent2);
    }
    
    //Belegt jede Zelle mit einem neuen Land
    function initCountries()
    {
        if(typeof(_grid.cellGrid) === "undefined")
            throw new Error("Didnt set grid before");
        
        var id = 1;
        
        //Auf gesamter Breite
        for(var i = 0; i < getMapWidth(); i++)
        {   //Auf gesamter Höhe
            for(var j = 0; j < getMapHeight(); j++)           
            {
                _grid.cellGrid[i][j] = new tddjs.client.map.country();
                _grid.cellGrid[i][j].id = id++;
                _grid.cellGrid[i][j].setName("Id:" + id);
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
                
                var lastX= x-1;
                var lastY= y-1;
                    
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
    
    function collectAllCountriesBelowMinSize()
    {
        if(!calledInitBorders)
            throw new Error("There are no Borders to work with yet");
        
        var countries = [];
        
        //Länder hinzufügen
        for(var i = 0; i < _grid.borders.length; i++)
        {
            if(_grid.borders[i].getLeftCountry().size < minimumCountrySize)
                if(countries.indexOf(_grid.borders[i].getLeftCountry()) === -1)
                    countries.push(_grid.borders[i].getLeftCountry());
            
            if(_grid.borders[i].getRigthCountry().size < minimumCountrySize)
                if(countries.indexOf(_grid.borders[i].getRigthCountry()) === -1)
                    countries.push(_grid.borders[i].getRigthCountry());
        }
        
        return countries;
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
            if(countries.indexOf(_grid.borders[i].getLeftCountry()) === -1)
                countries.push(_grid.borders[i].getLeftCountry());
            
            if(countries.indexOf(_grid.borders[i].getRigthCountry()) === -1)
                countries.push(_grid.borders[i].getRigthCountry());
        }
        
        return countries;
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
                if(countries.indexOf(_grid.borders[i].getLeftCountry()) === -1)
                    countries.push(_grid.borders[i].getRigthCountry());
            
            if(_grid.borders[i].getRigthCountry() === country)
                if(countries.indexOf(_grid.borders[i].getRigthCountry()) === -1)
                    countries.push(_grid.borders[i].getLeftCountry());
        }
        
        return countries;
    }
    
    //Sammelt alle Nachbarländer von Kontinenten
    function collectUnusedNeighborCountriesOfContinent(continent)
    {
        if(!calledInitBorders)
            throw new Error("There are no Borders to work with yet");
        if(!(continent instanceof tddjs.client.map.continent))
            throw new TypeError("Given value is not a Continent");
        
        var neigbors = [];
        
        for(var i in continent.getCountrys())
        {
            var countryNeigbors = collectNeighborCountries(continent.getCountrys()[i]);
            
            for(j = 0; j < countryNeigbors.length; j++)
            {
                if(countriesInContinents.indexOf(countryNeigbors[j]) === -1)
                    neigbors.push(countryNeigbors[j]);
            }
        }
        
        return neigbors;
    }
    
    function calculateUnitBonus(continent)
    {
        if(!calledInitBorders)
            throw new Error("There are no Borders to work with yet");
        if(!(continent instanceof tddjs.client.map.continent))
            throw new TypeError("Given value is not a Continent");
        
        var borderlands = 0;
        
        for(var i in continent.getCountrys())
        {
            var country = continent.getCountrys()[i];
            var countryNeighbors = collectNeighborCountries(country);
            
            for(j = 0; j < countryNeighbors.length; j++)
            {
                if(!continent.hasCountryByObject(countryNeighbors[j]))
                {
                    borderlands++;
                    break;
                }
            }
        }
        
        console.log(borderlands);
        
        //Anzahl an Reiche die Grenzländer sind =  neighbors.length
        //Anzahl der Reiche
        var numberOfCountries = continent.getCountryCount();      
        var dividor = (numberOfCountries+borderlands)/2;
        
        if(dividor === 0)
            return 0;
        
        return Math.round((numberOfCountries * borderlands)/dividor);
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
        
        allCountries = collectAllCountries();
        
        //Kombinieren
        for(var i = 0; i < combineCount; i++)
        {
            //Zielland
            var winnerCountry = getRandom(allCountries);
            //Aufgelöstes Land
            var loserCountry = getRandom(collectNeighborCountries(winnerCountry));

            //Falls das Land zu groß wird
            if((loserCountry.size + winnerCountry.size >= maximumCountrySize))
            {
                i--;
                continue;
            }

            //Gemergetes Land entfernen
            allCountries.splice(allCountries.indexOf(loserCountry), 1);
            
            mergeIntoCountry(loserCountry, winnerCountry);
            removeCircularAndDuplicateBorders();
        }
        
        //Id zuweisen
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
        
        //Größe umsetzen
        targetCountry.size = targetCountry.size + country.size;
        
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
    
    function combineRemainingCountries()
    {
        if(!calledInitBorders)
            throw new Error("There are no Borders to work with yet");
        
        var remainingCountries = collectAllCountriesBelowMinSize();
        
        while(remainingCountries.length > 0)
        {           
            var loser = getRandom(remainingCountries);
            var neigbours = (collectNeighborCountries(loser));
            //var notOnly = true;
            
            //Prüfen
            //Ob es merge optionen gibt!
            
            //Spezialfall falls Land umschlossen
            //if(neigbours.length === 1)
                //notOnly = false;
            
            var winner = getRandom(neigbours);
            
            //Falls das gleiche Land erwischt wird oder es zu groß wird
            //if(winner === loser /*|| (winner.size + loser.size > maximumCountrySize && notOnly)*/)
            //{
            //    throw new Error("happens");
            //    continue;
            //}

            mergeIntoCountry(loser, winner);
            removeCircularAndDuplicateBorders();
            remainingCountries = collectAllCountriesBelowMinSize();
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
    this.getCountriesInContinents = getCountriesInContinents;
    this.generateMap = generateMap;
   
    //Eig private
    this.collectAllCountriesBelowMinSize = collectAllCountriesBelowMinSize;
    this.collectAllCountries = collectAllCountries;
    this.collectNeighborCountries = collectNeighborCountries;  
    this.collectUnusedNeighborCountriesOfContinent = collectUnusedNeighborCountriesOfContinent;
    this.calculateUnitBonus = calculateUnitBonus;
    this.initCountries = initCountries;
    this.initBorders = initBorders;
    this.combineCountryCells = combineCountryCells;
    this.mergeIntoCountry = mergeIntoCountry;
    this.removeCircularAndDuplicateBorders = removeCircularAndDuplicateBorders;
};