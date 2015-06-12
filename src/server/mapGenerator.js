/* 
 * Source-Code for MapGenerator
 */

tddjs.namespace("server.controller").mapGenerator =  mapGenerator;

function mapGenerator()
{
    //Gewissermaßen die Welt
    var cellGrid;
    var countriesInContinents = [];
    var allCountries = [];
    var xx = 0;
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
        
        cellGrid = createArray(x,y);
        
        calledInitCountries = false;
        calledInitBorders = false;
    }
    
    function getMapGrid(){
        return cellGrid;
    }
    
    function getMapWidth(){
        return cellGrid.length;
    }
    
    function getMapHeight(){
        return cellGrid[0].length;
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
        if(typeof(cellGrid) === "undefined")
            throw new Error("Didnt set grid before");
        
        initCountries();
        initBorders();
        combineCountryCells();
        combineRemainingCountries();
        var map = new tddjs.client.map.map();
        //initLogicMap(map);
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
                if(cache_id.indexOf(cellGrid[i][j].id) === -1)
                {
                    cellGrid[i][j].setName("ID: "+cellGrid[i][j].id);
                    continent.addCountry(cellGrid[i][j]);
                }
                cache_id.push(cellGrid[i][j].id);
            }
        }
        for(var i=Math.floor(getMapWidth()/2);i<getMapWidth();i++)
        {
            for(var j=0;j<getMapHeight();j++)
            {
                if(cache_id.indexOf(cellGrid[i][j].id) === -1)
                {
                    cellGrid[i][j].setName("ID: "+ cellGrid[i][j].id);
                    continent2.addCountry(cellGrid[i][j]);
                }
                cache_id.push(cellGrid[i][j].id);
            }
        }
        
        map.addContinent(continent);
        map.addContinent(continent2);
    }
    
    //Belegt jede Zelle mit einem neuen Land
    function initCountries()
    {
        if(typeof(cellGrid) === "undefined")
            throw new Error("Didnt set grid before");
        
        //Id für Länder
        var id = 1;        
        
        //Auf gesamter Höhe
        for(var height = 0; height < getMapHeight(); height++)           
        {
            //Auf gesamter Breite
            for(var width = 0; width < getMapWidth(); width++)
            {   
                //Neues Land erzeugen
                cellGrid[width][height] = new tddjs.client.map.country();
                
                cellGrid[width][height].id = id++;
                cellGrid[width][height].setName("Id:" + id);
                cellGrid[width][height].size = 1;
                allCountries.push(cellGrid[width][height]);
            }
        }
        
        calledInitCountries = true;
    }
    
    //Erzeugt alle Borders in den Countries
    function initBorders()
    {
        if(!calledInitCountries)
            throw new Error("Didnt call required Functions before");
        
        if(calledInitBorders)
            throw new Error("Already generated Borders");
        
        
        //Auf gesamter Höhe
        for(var height = 0; height < getMapHeight(); height++)
        {
            //Auf gesamter Breite
            for(var width = 0; width < getMapWidth(); width++)
            {
                var nextWidth = width+1;
                var nextHeight = height+1;
                
                var lastWidth= width-1;
                var lastHeight= height-1;
                
                //Nachbarländer falls vorhanden als Grenze hinzufügen
                //Land darunter hinzufügen
                if(lastHeight >= 0)
                {
                    cellGrid[width][height].addBorder(cellGrid[width][lastHeight]);
                }             
                //Land links hinzufügen
                if(lastWidth >= 0)
                {
                    cellGrid[width][height].addBorder(cellGrid[lastWidth][height]);
                }
                //Land rechts hinzufügen             
                if(nextWidth < getMapWidth())
                {
                    cellGrid[width][height].addBorder(cellGrid[nextWidth][height]);
                }
                //Land darüber hinzufügen
                if(nextHeight < getMapHeight())
                {
                    cellGrid[width][height].addBorder(cellGrid[width][nextHeight]);
                }
            }
        }
        
        calledInitBorders = true;
    }
    
    //Sammelt alle Länder unter der Mindestgröße
    function collectAllCountriesBelowMinSize()
    {
        if(!calledInitBorders)
            throw new Error("There are no Borders to work with yet");
        
        var countries = [];
        
        //Länder hinzufügen
        for(var i = 0; i < allCountries.length; i++)
        {
            if(allCountries[i].size < minimumCountrySize)
                countries.push(allCountries[i]);
        }
        
        return countries;
    }
    
    //Holt alle Länder
    function getAllCountries()
    {
        if(!calledInitCountries)
            throw new Error("There are no Countries to work with yet");
        
        return allCountries;
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
            var countryNeigbors = continent.getCountrys()[i].getBorders();
            
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
        //Anzahl Länder die Grenzländer sind
        var borderlands = 0;
        //
        for(var i in continent.getCountrys())
        {
            var country = continent.getCountrys()[i];
            var countryNeighbors = country.getBorders();
            
            for(j = 0; j < countryNeighbors.length; j++)
            {
                if(!continent.hasCountryByObject(countryNeighbors[j]))
                {
                    borderlands++;
                    break;
                }
            }
        }
        
        //Anzahl der Reiche
        var numberOfCountries = continent.getCountryCount();
        //Erster Teil der Formel
        var dividor = (numberOfCountries+borderlands)/2;
        
        //Teiler darf nicht null sein
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
        
        //Kombinieren
        for(var i = 0; i < combineCount; i++)
        {
            //Zielland
            var winnerCountry = getRandom(allCountries);
            //Aufgelöstes Land
            var loserCountry = getRandom(winnerCountry.getBorders());

            //Falls das Land zu groß wird
            if((loserCountry.size + winnerCountry.size >= maximumCountrySize))
            {
                i--;
                continue;
            }
            else
            {
                //Land einmergen
                mergeIntoCountry(loserCountry, winnerCountry);
            }
        }
    }
    
    //Verbindet ein Land in ein anderes
    function mergeIntoCountry(loserCountry, targetCountry)
    {
        if(!calledInitBorders)
            throw new Error("There are no borders to work with yet");
        
        if(!(loserCountry instanceof tddjs.client.map.country) || !(targetCountry instanceof tddjs.client.map.country))
            throw new TypeError("Can only work with countries");
        
        if(loserCountry === targetCountry)
            throw new Error("Cannot merge one country into himself");
              
        //Grenzen des "gefallenen" Landes
        var loserBorders = loserCountry.getBorders();
        
        //Gemergtes Land aus den BorderListen entfernen
        for(var i = 0; i < loserBorders.length; i++)
        {
            //Land das an das verlorene Land angrenzt
            var neighborCountry = loserBorders[i];
            //Grenzen dieses Nachbarlandes
            var neighborCountryList = neighborCountry.getBorders();
            //Stelle des verloren Landes in der Grenzliste
            var slot = neighborCountryList.indexOf(loserCountry);
            
            
            //Tritt auf warum?
            //Würde in dem Fall der merge abgebrochen werden?
            if(slot === -1)
                throw new Error("Darf nicht sein");
            
            //Darf nicht gemacht werden wenn targetCountry sich selbst enthalten würde
            if(neighborCountry !== targetCountry)
            {
                //Sollte nicht doppelt hinzugefügt werden
                //if(neighborCountryList.indexOf(targetCountry) === -1)
                    neighborCountryList[slot] = targetCountry;
                //else
                   // neighborCountryList.splice(loserCountry, 1);
            }
        }
        
        //Grenzen des Ziellandes holen
        var targetBorders = targetCountry.getBorders();
        //Eingemergtes Land aus der List von targetCountry entfernen
        targetBorders.splice(targetBorders.indexOf(loserCountry), 1);
        
        
        //Grenzen des anderen Landes hinzufügen
        for(var i = 0; i < loserBorders.length; i++)
        {
            //Zielland darf nicht nochmal eingefügt werden
            if(!(loserBorders[i] === targetCountry))
            {
                //Keine Grenze sollte doppelt sein oder?
                if(targetBorders.indexOf(loserBorders) === -1)
                {                
                    targetBorders.push(loserBorders[i]);
                }
                else
                {
                    //Tritt nie auf hm
                    console.log(xx++);
                }
            }
        }
        
        //Größe umsetzen
        targetCountry.size = targetCountry.size + loserCountry.size;
        
        //Länderfelder umlegen
        for(var width = 0; width < getMapWidth(); width++)
        {
            for(var height = 0; height < getMapHeight(); height++)
            {
                if(cellGrid[width][height] === loserCountry)
                    cellGrid[width][height] = targetCountry;
            }
        }
        
        //Gemergetes Land entfernen
        allCountries.splice(allCountries.indexOf(loserCountry), 1);
    }
   
    //Verbindet die Verbleibenden Länder
    function combineRemainingCountries()
    {
        if(!calledInitBorders)
            throw new Error("There are no Borders to work with yet");
        
        //Zu kleine Länder sammeln
        var remainingCountries = collectAllCountriesBelowMinSize();
        
        while(remainingCountries.length > 0)
        {           
            var loser = getRandom(remainingCountries);
            var neigbours = loser.getBorders();
            var winner = getRandom(neigbours);
            //var notOnly = true;
            
            //Prüfen
            //Ob es merge optionen gibt!
            
            //Spezialfall falls Land umschlossen
            //if(neigbours.length === 1)
                //notOnly = false;
            
            
            //Falls das gleiche Land erwischt wird oder es zu groß wird
            //if(winner === loser /*|| (winner.size + loser.size > maximumCountrySize && notOnly)*/)
            //{
            //    throw new Error("happens");
            //    continue;
            //}

            //Mergen
            mergeIntoCountry(loser, winner);
            //Loser entfernen
            remainingCountries = collectAllCountriesBelowMinSize();
            //remainingCountries.splice(remainingCountries.indexOf(loser),1);
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
    this.getAllCountries = getAllCountries;  
    this.collectUnusedNeighborCountriesOfContinent = collectUnusedNeighborCountriesOfContinent;
    this.calculateUnitBonus = calculateUnitBonus;
    this.initCountries = initCountries;
    this.initBorders = initBorders;
    this.combineCountryCells = combineCountryCells;
    this.mergeIntoCountry = mergeIntoCountry;
};


//Altes Zeug Zwischenlager
/*Entfernt nicht mehr benötigte Borders
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
    }*/
/*Sammelt Nachbarländer eines Landes
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
    }*/
/*Borders umbelegen
        for(var i = 0; i < _grid.borders.length; i++)
        {
           var border = _grid.borders[i];
           if(border.getLeftCountry() === country)
                border.setLeftCountry(targetCountry);
            
           if(border.getRigthCountry() === country)
               border.setRigthCountry(targetCountry);
        }*/