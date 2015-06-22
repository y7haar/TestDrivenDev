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
    //alle Kontinente
    var allContinents = [];
    
    //Variablen für den bisherigen Aufruf
    var calledInitCountries = false;
    var calledInitBorders = false;
    
    //Variablen für die Erstellung der Karte
    var gridCellCombinesPerCountry = 2.5;
    
    //Variablen für Ländergrößen
    var minimumCountrySize = 3;
    var maximumCountrySize = 20;
    
    //Variablen für Wassergenerierung
    var minimumWaterSize = 2;
    var maximumWaterSize = 4;
    var minimumWaterNumber = 2;
    var maximumWaterNumber = 4;
    
    var randomWaterNumber = 0;
    
    //Variablen für Kontinentgrößen
    var minimumContinentNumber = 6;
    var maximumContinentNumber = 10;
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
        
        if(maximumCountrySize < minimumCountrySize)
            maximumCountrySize = minimumCountrySize;
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
    
    //Holt die Kombinationszahl
    function getGridCellCombinesPerCountry()
    {
        return gridCellCombinesPerCountry;
    }
    
    //Setzt die Kombinationszahl der ersten merge-Stufe
    function setGridCellCombinesPerCountry(size)
    {
        if(isNaN(size))
            throw new TypeError;
        
        if(size <= 0)
            throw new Error("Combines musst be bigger than zero");
        
        gridCellCombinesPerCountry = size;
    }
    
    //Holt minimale Kontinent-Größe
    function getMinimumContinentSize()
    {
        return minimumContinentSize;
    }
    
    //Setzt minmale Kontinent-Größe
    function setMinimumContinentSize(size)
    {
        if(isNaN(size))
            throw new TypeError;
        
        if(size <= 1)
            throw new Error("Size musst be two or higher");
        
        minimumContinentSize = size;
    }
    
    //Setzt minimale Kontinent-Größe
    
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
        
        if(maximumContinentNumber < minimumContinentNumber)
            maximumContinentNumber = minimumContinentNumber;
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
    
    //Holt Minimale Gewässeranzahl
    function getMinimumWaterNumber()
    {
        return minimumWaterNumber;
    }
    
    //Setzt minimale Gewässerzahl
    function setMinimumWaterNumber(size)
    {
        if(isNaN(size))
            throw new TypeError;
        
        if(size <= 0)
            throw new Error("Size musst be one or higher");
        
        minimumWaterNumber = size;
        
        if(maximumWaterNumber < minimumWaterNumber)
            maximumWaterNumber = minimumWaterNumber;
    }
    
    //Holt maximal Gewässerzahl
    function getMaximumWaterNumber()
    {
        return maximumWaterNumber;
    }
    
    //Setzt maximale Gewässerzahl
    function setMaximumWaterNumber(size)
    {
        if(isNaN(size))
            throw new TypeError;
        
        if(size <= 0)
            throw new Error("Size musst be one or higher");
        
        if(size < minimumWaterNumber)
            throw new Error("Size cant be below minimumWaterNumber");
        
        maximumWaterNumber = size;
    }
    
    //Holt minimale Gewässergröße
    function getMinimumWaterSize()
    {
        return minimumWaterSize;
    }
    
    //Setzt minimale Gewässergröße
    function setMinimumWaterSize(size)
    {
        if(isNaN(size))
            throw new TypeError;
        
        if(size <= 0)
            throw new Error("Size musst be one or higher");
        
        minimumWaterSize = size;
        
        if(maximumWaterSize < minimumWaterSize)
            maximumWaterSize = minimumWaterSize;
    }
    
    //Holt maximal Gewässergröße
    function getMaximumWaterSize()
    {
        return maximumWaterSize;
    }
    
    //Setzt maximale Gewässergröße
    function setMaximumWaterSize(size)
    {
        if(isNaN(size))
            throw new TypeError;
        
        if(size <= 0)
            throw new Error("Size musst be one or higher");
        
        if(size < minimumWaterSize)
            throw new Error("Size cant be below minimumWaterSize");
        
        maximumWaterSize = size;
    }
    
    //Holt Länder in Kontinenten
    function getCountriesInContinents()
    {
        return countriesInContinents;
    }
    
    //Holt alle Kontinente
    function getAllContinents()
    {
        return allContinents;
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
        calledInitCountries = false;
        calledInitBorders = false;
        
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
        
        //Anzahl Wasserflächen auswürfeln
        var factor = maximumWaterNumber - minimumWaterNumber;
        randomWaterNumber = Math.round(Math.random()*factor + minimumWaterNumber);
        
        //Kontinente erzeugen
        allContinents = buildContinents();
        //Wasser 
        map.water = generateWater();
        //Kontinente anfügen
        map.continents = allContinents;
        //return
        return map;
    }
    
    //###############################################################################################################
    //Funktionen
    //###############################################################################################################
    
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
        var combineCount = (( getMapWidth() * getMapHeight()) * (gridCellCombinesPerCountry - 1))/ gridCellCombinesPerCountry;

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
        replaceFields(loserCountry, targetCountry);
        
        //Größe umsetzen
        targetCountry.size = targetCountry.size + loserCountry.size;
        
        //Gemergetes Land entfernen
        allCountries.splice(allCountries.indexOf(loserCountry), 1);
    }
    
    //Legt Felder um
    function replaceFields(loserCountry, targetCountry)
    {
        for(var width = 0; width < getMapWidth(); width++)
        {
            for(var height = 0; height < getMapHeight(); height++)
            {
                if(cellGrid[width][height] === loserCountry)
                    cellGrid[width][height] = targetCountry;
            }
        }
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
        if(!calledInitBorders)
            throw new Error("There are no borders to work with yet");
        
        //Anzahl kontinente würfeln
        var factor = maximumContinentNumber - minimumContinentNumber;
        var random = Math.round(Math.random()*factor + minimumContinentNumber);
        random = random + randomWaterNumber;
        
        //Wenn es zu wenige Länder gibt gehts halt nicht
        if(random*minimumContinentSize > allCountries.length)
        {
            random = minimumContinentNumber + randomWaterNumber;
            if(random*minimumContinentSize > allCountries.length)
                throw new Error("This grid might be to small for map-generation");              
        }
        
        //Array anlegen
        countriesNotInContinents = allCountries.slice();
        countriesInContinents = [];
        
        //Kontinente anlegen
        var continents = [];
        
        //id
        var id = 1;
        //Fehlschlagzähler
        var counter = 0;
        
        //Bis genügend Kontinente erzeugt worden sind
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
                
                //Falls es nicht möglich ist die Mindestzahl einzuhalten
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
            
            //Im Falle eines Fehlschlages
            if(!worked)
            {
                counter++;

                //Rückgängig machen
                while(newContinent.countries.length > 0)
                {
                    //Land holen
                    var x = newContinent.countries.pop();
                    //Arrays berichtigen
                    countriesNotInContinents.push(x);
                    countriesInContinents.splice(countriesInContinents.indexOf(x),1);
                }
                
                //Neuer Versuch bei zu vielen Fehlschlägen
                if(counter > 100)
                    return buildContinents();
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
    
        //Wassererstellung
    function generateWater()
    {             
        //Das Gewässer
        var water = createWater(-1);
        //Verfügbare Kontinent
        var availableContinents = allContinents.slice();     
        
        //Alle Wasserflächen erzeugen
        while(randomWaterNumber > 0)
        {         
            //Zufälliges Ziel das Wasser wird
            var seed = getRandom(availableContinents);
            //Ergebnisse sammeln
            var result = collectNeighbourContinents(seed);
            //Nachbar-Kontinente
            var neighborContinents = result.continents;
            //Nachbar-Länder
            var neighborCountries = result.neighbourCountries;
            
            //Darf nicht sein
            if(neighborContinents.length === 0)
                throw new Error("This cant be");
            
            
            //Grenzländer des gewählten Kontinents bearbeiten
            for(var i = 0; i < neighborCountries.length; i++)
            {
                var borders = neighborCountries[i].borders;
                    
                //Alle Kontinent-Länder durchgehen
                for(var k = 0; k < seed.countries.length; k++)
                {
                    var slot = borders.indexOf(seed.countries[k]);
                        
                    if(slot >= 0)
                        borders.splice(slot, 1);
                }
            }
            
            //Länder löschen
            while(seed.countries.length > 0)
            {
                var loser = seed.countries.pop();
                //water.size = water.size+loser.size;
                //Felder umsetzen
                replaceFields(loser, water);
                //Löschen
                allCountries.splice(allCountries.indexOf(loser), 1);
            }
              
            //Wenn der Kontinent nur einen Nachbarn hat muss man nix machen
            if(neighborContinents.length > 1)
            {
                //Nachbarkontinente durchgehen
                for(var i = 0; i < neighborContinents.length; i++)
                {
                    //Nachbarkontinente des Nachbarkontinents
                    var res = collectNeighbourContinents(neighborContinents[i]);
                    var doubleNeighbours = res.continents;
                    
                    //Kopie 
                    var copie = neighborContinents.slice();
                    //Sich selber rausstreichen
                    copie.splice(copie.indexOf(neighborContinents[i]), 1);
                    
                    //Nachbarn des Nachbarn durchgehen
                    for(var j; j < doubleNeighbours.length; j++)
                    {
                        //Enthalten -> Nachbar -> entfernen
                        var slot = copie.indexOf(doubleNeighbours);
                        
                        if(slot >= 0)
                            copie.splice(slot, 1);
                    }
                    
                    //Grenzländer des aktuellen Kontinents
                    var currentCountries = [];
                    
                    //Nachbarländer des entfernten Continents durchgehen um Grenzländer zu ermitteln
                    for(var j = 0; j < neighborCountries.length; j++)
                    {
                        //Wenn vorhanden hinzufügen
                        var slot = neighborContinents[i].countries.indexOf(neighborCountries[j]);
                        
                        if(slot >= 0)
                            currentCountries.push(neighborCountries[j]);
                    }
                    
                    //Ziel-Kontinent
                    var randomContinent = getRandom(copie);
                    
                    //Grenzländer des anderen Kontinents
                    var borderlands = [];
                        
                    //Grenzländer ermitteln
                    for(var k = 0; k < neighborCountries.length; k++)
                    {
                        //Wenn vorhanden hinzufügen
                        var slot = randomContinent.countries.indexOf(neighborCountries[k]);
                            
                        if(slot >= 0)
                            borderlands.push(neighborCountries[k]);
                    }
                        
                    //Zufällig auswählen
                    var border1 = getRandom(currentCountries);
                    var border2 = getRandom(borderlands);
                        
                    //Gegenseitig reinschreiben
                    if(border1.borders.indexOf(border2) === -1)
                        border1.borders.push(border2);
                    if(border2.borders.indexOf(border1) === -1)
                        border2.borders.push(border1);
                        
                    //Wasser-Objekt bearbeiten
                    if(water.borders.indexOf([border1, border2]) === -1 
                       && water.borders.indexOf([border2, border1]) === -1)
                        water.borders.push([border1, border2]);
                }
            }
               
            randomWaterNumber--;
            water.size++;
            //Seed-Kontinent entfernen
            allContinents.splice(allContinents.indexOf(seed), 1);
            availableContinents.splice(availableContinents.indexOf(seed), 1);
        }
        
        //Wasser zurückgeben
        return water;
    }
    
    //Hilfsmethode die Nachbar-Kontinente sammelt
    function collectNeighbourContinents(continent)
    {
        if(!continent.isContinent)
            throw new TypeError("Can only work with continents");
        
        //Ergebnis-Liste
        var continents = [];
        //Länder des Kontinents
        var countries = continent.countries;
        //Nachbarländer des Kontinents
        var neighbourCountries = [];
        
        //Alle Länder durchgehen
        for(var i = 0; i < countries.length; i++)
        {
            //Nachbarländer
            var borders = countries[i].borders;
            
            //Alle Borders durchen
            for(var j = 0; j < borders.length; j++)
            {
                //Nur hinzufügen wenn nicht im Kontinent
                if(continent.countries.indexOf(borders[j]) === -1)
                    if(neighbourCountries.indexOf(borders[j]) === -1)
                        neighbourCountries.push(borders[j]);
            }
        }
        
        //Alle Kontinente durchgehen
        for(var i = 0 ; i < allContinents.length; i++)
        {
            var current = allContinents[i];
            
            //Alle Nachbar-Länder durchgehen
            for(var j = 0; j < neighbourCountries.length; j++)
            {
                //Im Kontinent enthalten?
                if(current.countries.indexOf(neighbourCountries[j]) >= 0)
                {
                    //Kontinent hinzufügen
                    continents.push(allContinents[i]);
                    break;
                }
            }
        }
        
        //Ergebnisse
        var result = {};
        result.continents = continents;
        result.neighbourCountries = neighbourCountries;
        
        return result;
    }
    
    //###############################################################################################################
    //Pseudo-Kartenobjekt-Erzeugung
    //###############################################################################################################
    //Hilfsmethode zur Ländererzeugung
    function createCountry(id)
    {
        var country = {};
        country.id = id;
        country.name = "Id: " + id;                    
        country.borders = [];                         
        country.size = 1;
        country.isCountry = true;
        return country;
    }
    
    //Hilfsmethode zur Wassererzeugung
    function createWater(id)
    {
        var water = {};
        water.id = id;
        water.name = "Wasser";
        water.borders = [[]];
        water.size = 0;
        water.fields = 0;
        water.isWater = true;
        return water;
    }
    
    //Hilfsmethode zur Kontinent Erzeugung
    function  createContinent(id)
    {
        var continent = {};
        continent.id = id;
        continent.name = "Id: " + id;
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
        map.water = createWater();
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
        
        json.water={};
        json.water.id = map.water.id;
        json.water.name = map.water.name;
        json.water.size = map.water.size;
        json.water.fields = map.water.fields;
        json.water.border = [[]];
        for(var i in map.water.borders){
            if(i>0)
            json.water.border.push([map.water.borders[i][0].id,map.water.borders[i][1].id]);
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
    this.getGridCellCombinesPerCountry = getGridCellCombinesPerCountry;
    this.setGridCellCombinesPerCountry = setGridCellCombinesPerCountry;
    this.getMinimumContinentSize = getMinimumContinentSize;
    this.setMinimumContinentSize = setMinimumContinentSize;
    this.getMinimumContinentNumber = getMinimumContinentNumber;
    this.setMinimumContinentNumber = setMinimumContinentNumber;
    this.getMaximumContinentNumber = getMaximumContinentNumber;
    this.setMaximumContinentNumber = setMaximumContinentNumber;
    this.getMinimumWaterNumber = getMinimumWaterNumber;
    this.setMinimumWaterNumber = setMinimumWaterNumber;
    this.getMaximumWaterNumber = getMaximumWaterNumber;
    this.setMaximumWaterNumber = setMaximumWaterNumber;
    this.getMinimumWaterSize = getMinimumWaterSize;
    this.setMinimumWaterSize = setMinimumWaterSize;
    this.getMaximumWaterSize = getMaximumWaterSize;
    this.setMaximumWaterSize = setMaximumWaterSize;   
    this.getCountriesInContinents = getCountriesInContinents;
    this.generateMap = generateMap;
    this.serializeAsJSON = serializeAsJSON;
   
    //Eig private
    this.collectAllCountriesBelowMinSize = collectAllCountriesBelowMinSize;
    this.getAllCountries = getAllCountries;  
    this.getAllContinents = getAllContinents;
    this.collectUnusedNeighborCountriesOfContinent = collectUnusedNeighborCountriesOfContinent;
    this.collectNeighbourContinents = collectNeighbourContinents;
    this.calculateUnitBonus = calculateUnitBonus;
    this.initCountries = initCountries;
    this.initBorders = initBorders;
    this.combineCountryCells = combineCountryCells;
    this.mergeIntoCountry = mergeIntoCountry;
    this.buildContinents = buildContinents;
    
    //Pseudo-Objekte
    this.createCountry = createCountry;
    this.createWater = createWater;
    this.createContinent = createContinent;
    this.createMap = createMap;
};

//###############################################################################################################################
//Ausgemusterter Code
//###############################################################################################################################
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
}

Sammelt Nachbarländer eines Landes
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
Aus merge ausgetauscht
Borders umbelegen
for(var i = 0; i < _grid.borders.length; i++)
{
   var border = _grid.borders[i];
   if(border.getLeftCountry() === country)
        border.setLeftCountry(targetCountry);
            
   if(border.getRigthCountry() === country)
       border.setRigthCountry(targetCountry);
}*/