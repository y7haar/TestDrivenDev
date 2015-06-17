/* 
 * Source-Code for MapGenerator
 */
if(typeof module !== "undefined")
{
    module.exports = mapGenerator;
}
else
    tddjs.namespace("server.controller").mapGenerator =  mapGenerator;

function mapGenerator()
{
    //###############################################################################################################
    //Variablen
    //###############################################################################################################
    //Gewissermaßen die Welt
    var cellGrid;
    //Länder die bereits in Kontinenten sind
    var countriesInContinents = [];
    //Alle Länder
    var allCountries = [];
    //Länder die nicht in Kontinenten sind
    var countriesNotInContinents = [];
    
    //Variablen für den bisherigen Aufruf
    var calledInitCountries = false;
    var calledInitBorders = false;
    
    //Variablen für die Erstellung der Karte
    var GRID_CELL_COMBINES_PER_COUNTRY = 2.5;
    
    //Variablen für Ländergrößen
    var minimumCountrySize = 3;
    var maximumCountrySize = 20;
    
    //Variablen für Kontinentgrößen
    var minimumContinentNumber = 4;
    var maximumContinentNumber = 8;
    var minimumContinentSize = 2;
    
    //###############################################################################################################
    //Setter und Getter
    //###############################################################################################################
    
    //Setzt das Grid neu
    function setGridSize(x,y)
    {
        if(isNaN(x) || isNaN(y))
            throw new TypeError;
        
        if(x <= 0 || y <= 0)
            throw new Error("A Grid is not allowed to be zero or less Width or Height");
        
        //Array erzeugen
        cellGrid = createArray(x,y);
        
        calledInitCountries = false;
        calledInitBorders = false;
    }
 
    //Holt grid
    function getMapGrid(){
        return cellGrid;
    }
    
    //Holt Breite
    function getMapWidth(){
        return cellGrid.length;
    }
    
    //Holt Höhe
    function getMapHeight(){
        return cellGrid[0].length;
    }
    
    //Holt Minimale Ländergröße
    function getMinimumCountrySize()
    {
        return minimumCountrySize;
    }
    
    //Setzt minimale Ländergröße
    function setMinimumCountrySize(size)
    {
        if(isNaN(size))
            throw new TypeError;
        
        if(size <= 0)
            throw new Error("Size musst be one or higher");
        
        minimumCountrySize = size;
    }
    
    //Holt maximal Größe
    function getMaximumCountrySize()
    {
        return maximumCountrySize;
    }
    
    //Setzt maximale Größe
    function setMaximumCountrySize(size)
    {
        if(isNaN(size))
            throw new TypeError;
        
        if(size <= 0)
            throw new Error("Size musst be one or higher");
        
        if(size < minimumCountrySize)
            throw new Error("Size cant be below minCountrySize");
        
        maximumCountrySize = size;
    }
    
    //Holt Minimale Ländergröße
    function getMinimumContinentNumber()
    {
        return minimumContinentNumber;
    }
    
    //Setzt minimale Ländergröße
    function setMinimumContinentNumber(size)
    {
        if(isNaN(size))
            throw new TypeError;
        
        if(size <= 1)
            throw new Error("Size musst be two or higher");
        
        minimumContinentNumber = size;
    }
    
    //Holt maximal Größe
    function getMaximumContinentNumber()
    {
        return maximumContinentNumber;
    }
    
    //Setzt maximale Größe
    function setMaximumContinentNumber(size)
    {
        if(isNaN(size))
            throw new TypeError;
        
        if(size <= 0)
            throw new Error("Size musst be one or higher");
        
        if(size < minimumContinentNumber)
            throw new Error("Size cant be below minimumContinentNumber");
        
        maximumContinentNumber = size;
    }
    
    //Holt Länder in Kontinenten
    function getCountriesInContinents()
    {
        return countriesInContinents;
    }
    
    //Erzeugt Array
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
        
        //Von einem eventuell vorgerigen Aufruf leeren
        allCountries = [];
        
        //Länder initialisieren
        initCountries();
        //Grenzen initializieren
        initBorders();
        //Erste Kombinationen
        combineCountryCells();
        //Zu kleine Länder beseitigen
        combineRemainingCountries();
        //Karte erzeugen
        var map = createMap();
        //Kontinente erzeugen
        map.continents = buildContinents();
        //initLogicMap(map);
        return map;
    }
    
    //###############################################################################################################
    //Funktionen
    //###############################################################################################################
    
    /*test-funktion für die UI
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
    }*/
    
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
                cellGrid[width][height] = createCountry(id++);
                //Zur Liste hinzufügen
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
                    addBorderHelper(cellGrid[width][height],cellGrid[width][lastHeight]);   //<<------------------
                }             
                //Land links hinzufügen
                if(lastWidth >= 0)
                {
                    addBorderHelper(cellGrid[width][height],cellGrid[lastWidth][height]);   //<<------------------
                }
                //Land rechts hinzufügen             
                if(nextWidth < getMapWidth())
                {
                    addBorderHelper(cellGrid[width][height],cellGrid[nextWidth][height]);   //<<------------------
                }
                //Land darüber hinzufügen
                if(nextHeight < getMapHeight())
                {
                    addBorderHelper(cellGrid[width][height],cellGrid[width][nextHeight]);   //<<------------------
                }
            }
        }
        
        calledInitBorders = true;
    }
    
    //Kleine Hilfsfunktion
    function addBorderHelper(srcCountry,border){                                //<<------------------
        srcCountry.borders.push(border);
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
            //Nur wenn kleiner
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
        if(!calledInitBorders)                                                //<<------------------
            throw new Error("There are no Borders to work with yet");
        
        if(!(continent.isContinent))
            throw new TypeError("Given value is not a Continent");
        
        //Nachbarn
        var neigbors = [];
        
        //Alle Länder des Kontinents durchgehen
        for(var i = 0; i < continent.countries.length ; i++)
        {
            //Nachbarländer
            var countryNeigbors = continent.countries[i].borders;
            
            //Nächbarländer durchgehen
            for(j = 0; j < countryNeigbors.length; j++)
            {
                //Wenn nicht bereits ein land in einem Kontinent hinzufügen
                if(countriesInContinents.indexOf(countryNeigbors[j]) === -1)
                    if(neigbors.indexOf(countryNeigbors[j]) === -1)
                        neigbors.push(countryNeigbors[j]);
            }
        }
        
        return neigbors;
    }
    
    //Berechnet den Bonusfaktor des Kontinents
    function calculateUnitBonus(continent)
    {
        if(!calledInitBorders)
            throw new Error("There are no Borders to work with yet");
        
        if(!(continent.isContinent))
            throw new TypeError("Given value is not a Continent");
        
        //Anzahl Länder die Grenzländer sind
        var borderlands = 0;
        //Länder des Kontinents
        var countries = continent.countries;
        
        //Länder des Kontinents durchgehen
        for(var i = 0; i < countries.length; i++)
        {
            //Nachbarländer des aktuellen Landes
            var countryNeighbors = countries[i].borders;
            
            //Nachbarländer durchgehen
            for(j = 0; j < countryNeighbors.length; j++)
            {
                //Wenn die Länder des Kontinent das Nachbarland nicht enthalten
                //Also es nur Kontinent eigene Länder zur Grenze hat
                if(countries.indexOf(countryNeighbors[j]) === -1)//!continent.hasObject
                {
                    borderlands++;
                    break;
                }
            }
        }
        
        //Anzahl der Reiche
        var numberOfCountries = continent.countries.length;
        //Erster Teil der Formel
        var dividor = (numberOfCountries+borderlands)/2;
        
        //Teiler darf nicht null sein
        if(dividor === 0)
            return 0;
        
        //Berechne Endwert
        return Math.round((numberOfCountries * borderlands)/dividor);
    }
    
    //Wählt ein zufälliges Element
    function getRandom(countries)
    {
        var random = Math.floor(Math.random()*(countries.length));
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
            var loserCountry = getRandom(winnerCountry.borders);                //<<------------------

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
        
        if(!(loserCountry.isCountry && targetCountry.isCountry))
            throw new TypeError("Can only work with countries");
        
        if(loserCountry === targetCountry)
            throw new Error("Cannot merge one country into himself");
              
        //Grenzen des "gefallenen" Landes
        var loserBorders = loserCountry.borders;
        
        //Grenzen des Ziellandes holen
        var targetBorders = targetCountry.borders;       
        
        //Grenzen des anderen Landes hinzufügen
        for(var i = 0; i < loserBorders.length; i++)
        {
            //Zielland darf nicht nochmal eingefügt werden
            if(!(loserBorders[i] === targetCountry))
            {
                //Keine Grenze sollte doppelt sein
                if(targetBorders.indexOf(loserBorders[i]) === -1)
                {                
                    targetBorders.push(loserBorders[i]);
                }
            }
        }
        
        //Gemergtes Land aus den BorderListen entfernen
        for(var i = 0; i < loserBorders.length; i++)
        {
            //Land das an das verlorene Land angrenzt
            var neighborCountry = loserBorders[i];
            //Grenzen dieses Nachbarlandes
            var neighborCountryList = neighborCountry.borders;                  //<<------------------
            //Stelle des verloren Landes in der Grenzliste
            var slot = neighborCountryList.indexOf(loserCountry);           
            
            //Grenze entfernen
            neighborCountryList.splice(slot,1);
            
            //Darf nicht gemacht werden wenn targetCountry sich selbst enthalten würde
            if(neighborCountry !== targetCountry)
            {
                //Sollte nicht doppelt hinzugefügt werden
                if(neighborCountryList.indexOf(targetCountry) === -1)
                {
                    neighborCountryList.push(targetCountry);
                }
            }
        }
        
        //Länderfelder umlegen
        for(var width = 0; width < getMapWidth(); width++)
        {
            for(var height = 0; height < getMapHeight(); height++)
            {
                if(cellGrid[width][height] === loserCountry)
                    cellGrid[width][height] = targetCountry;
            }
        }
        
        //Größe umsetzen
        targetCountry.size = targetCountry.size + loserCountry.size;
        
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
            //Verlierer
            var loser = getRandom(remainingCountries);
            //Nachbarn des verlierers
            var neigbours = loser.borders;
            
            //Prüfen ob es merge-optionen gibt die nicht zu zu großen Länder führen
            var notGettingToBig = [];
            for(var i = 0; i < neigbours.length; i++)
            {
                if((loser.size + neigbours[i].size) <= maximumCountrySize)
                    notGettingToBig.push(neigbours[i]);
            }
            
            //Gewinner aus den Nachbarn suchen
            var winner;
            if(notGettingToBig.length === 0)
            {
                winner = getRandom(neigbours);
            }
            else 
            {
                winner = getRandom(notGettingToBig);
            }

            //Mergen
            mergeIntoCountry(loser, winner);
            
            //Loser entfernen
            remainingCountries.splice(remainingCountries.indexOf(loser),1);
            //Gewinner entfernen falls er auch ein zu kleines Land war
            if(winner.size >= minimumCountrySize)
            {
                if(remainingCountries.indexOf(winner) !== -1)
                    remainingCountries.splice(remainingCountries.indexOf(winner),1);
            }
        }
    }
    
    //Erstellt die Kontinente
    function buildContinents()
    {
        //Anzahl konnte würfeln
        var factor = maximumContinentNumber - minimumContinentNumber;
        var random = Math.round(Math.random()*factor + minimumContinentNumber);
        
        //Wenn es zu wenige Länder gibt gehts halt nicht
        if(random*minimumContinentSize > allCountries.length)
        {
            random = minimumContinentNumber;
            if(minimumContinentNumber*minimumContinentSize > allCountries.length)
                throw new Error("This grid might be to small for map-generation");
                
        }
        
        //Array anlegen
        countriesNotInContinents = allCountries.slice();
        countriesInContinents = [];
        
        //Kontinente anlegen
        var continents = [];
        
        //id
        var id = 1;
        
        while(random > 0)
        {
            var worked = true;
            
            //Neuer Kontinent
            var newContinent = createContinent(id++);
            //Startland
            var seed = getRandom(countriesNotInContinents);
            //Startland hinzufügen
            newContinent.countries.push(seed);
            //Arrays bearbeiten
            countriesInContinents.push(seed);
            countriesNotInContinents.splice(countriesNotInContinents.indexOf(seed), 1);
            
            //Bis zur Mindestgröße mergen
            while(newContinent.countries.length < minimumContinentSize)
            {
                //Hinzufügbare Länder sammeln
                var neighbors = collectUnusedNeighborCountriesOfContinent(newContinent);
                
                if(neighbors.length < 1)
                {
                    worked = false;
                    break;
                }
                
                //Land auswählen
                var countrie = getRandom(neighbors);
                //Land dem Kontinent hinzufügen
                newContinent.countries.push(countrie);
                //Arrays bearbeiten
                countriesInContinents.push(countrie);
                countriesNotInContinents.splice(countriesNotInContinents.indexOf(countrie),1);
            }
            
            if(!worked)
            {
                console.log("Happened");

                //Rückgängig machen
                while(newContinent.countries.length > 0)
                {
                    var x = newContinent.countries.pop();
                    countriesNotInContinents.push(x);
                    countriesInContinents.splice(countriesInContinents.indexOf(x),1);
                }
            }
            else
            {
                //Mindestgröße hat Funtioniert
                random--;
                //-> Kontinent hinzufügen
                continents.push(newContinent);
            }
        }
        
        //Weiter mergen
        while(countriesNotInContinents.length > 0)
        {
            //Kontinent aussuchen
            var continent = getRandom(continents);
            //Kandidaten sammeln
            var candidates = collectUnusedNeighborCountriesOfContinent(continent);
            
            //Kann ja sein
            if(candidates.length === 0)
                continue;
  
            var country = getRandom(candidates);
            continent.countries.push(country);
            countriesInContinents.push(country);
            countriesNotInContinents.splice(countriesNotInContinents.indexOf(country),1);
        }
        
        //Bonus berechnen
        for(var i = 0; i < continents.length; i++)
        {
            continents[i].unitBonus = calculateUnitBonus(continents[i]);
        }
        
        return continents;
    }
    
    //###############################################################################################################
    //Pseudo-Kartenobjekt-Erzeugung
    //###############################################################################################################
    //Hilfsmethode zur Ländererzeugung
    function createCountry(id)
    {
        var country = {};
        country.id = id;
        country.name = "Id:" + id;                    
        country.borders = [];                         
        country.size = 1;
        country.isCountry = true;
        return country;
    }
    
    //Hilfsmethode zur Kontinent Erzeugung
    function  createContinent(id)
    {
        var continent = {};
        continent.id = id;
        continent.name = "Id:" + id;
        continent.unitBonus = 0;
        continent.countries = [];
        continent.isContinent = true;
        return continent;
    }
    
    //Hilfsmethode zur Map
    function createMap()
    {
        var map = {};
        map.continents = [];
        map.isMap = true;
        return map;
    }
    
    //Serialisieren
    function serializeAsJSON(map){
        var json = {};
        json.continents = [];
        
        for(var c=0;c<map.continents.length;c++){
            json.continents[c]={};
            json.continents[c].id = map.continents[c].id;
            json.continents[c].name = map.continents[c].name;
            json.continents[c].unitBonus = map.continents[c].unitBonus;
            
            json.continents[c].countries = [];
            for(var countr=0;countr<map.continents[c].countries.length;countr++){
                json.continents[c].countries[countr] = {};
                json.continents[c].countries[countr].id = map.continents[c].countries[countr].id;
                json.continents[c].countries[countr].name = map.continents[c].countries[countr].name;
                json.continents[c].countries[countr].size = map.continents[c].countries[countr].size;
                
                json.continents[c].countries[countr].borders = [];
                for(var b=0;b<map.continents[c].countries[countr].borders.length;b++){
                    json.continents[c].countries[countr].borders[b] = map.continents[c].countries[countr].borders[b].id;
                }
            }
        }
        
        json.gridMap = createArray(getMapWidth(),getMapHeight());
        for(var x=0; x<getMapWidth(); x++){
            for(var y=0; y<getMapHeight(); y++){
                json.gridMap[x][y] = {};
                json.gridMap[x][y].id = cellGrid[x][y].id;
            }
        }
        
        
        return JSON.stringify(json);
    }
    //###############################################################################################################
    //Funktionsdeklaration
    //###############################################################################################################
    this.setGridSize = setGridSize;
    this.getMapGrid = getMapGrid;
    this.getMapWidth = getMapWidth;
    this.getMapHeight = getMapHeight;
    this.getMinimumCountrySize = getMinimumCountrySize;
    this.setMinimumCountrySize = setMinimumCountrySize;
    this.getMaximumCountrySize = getMaximumCountrySize;
    this.setMaximumCountrySize = setMaximumCountrySize;
    this.getMinimumContinentNumber = getMinimumContinentNumber;
    this.setMinimumContinentNumber = setMinimumContinentNumber;
    this.getMaximumContinentNumber = getMaximumContinentNumber;
    this.setMaximumContinentNumber = setMaximumContinentNumber;
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
    
    this.createCountry = createCountry;
    this.createContinent = createContinent;
    this.createMap = createMap;
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