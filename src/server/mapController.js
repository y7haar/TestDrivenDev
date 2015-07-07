/* 
 * Source Code for MapController
 */
if(typeof module !== "undefined")
{
    module.exports = mapController;
}
else
    tddjs.namespace("server.controller").mapController = mapController;

function mapController()
{
    var _map;
    var _player=[];
    var _jsonMap;
    var _serverMap;
    
    var _mapGenerator;
    
    //Entscheidung ob auf Node js oder nicht
    if(typeof module !== "undefined")
    {
        var mG = module.require("./mapGenerator.js");
        _mapGenerator = new mG();
    }
    else
        _mapGenerator = new tddjs.server.controller.mapGenerator();
    
    function init(playerarr)
    {
        if(playerarr.length <= 1)
            throw new Error("To less Players for map generation");
        
        _player = playerarr;
        
        //Karteeinstellungen je nach Spielerzahl
        if(_player.length === 2)
            setUp2Player();
        else if(_player.length === 3)
            setUp3Player();
        else
            setUp4Player();
        
        //Karte generieren
        _map = _mapGenerator.generateMap();
        
        //Länder an Spieler verteilen
        //Soll der Spieler wissen was sein Land ist?
        handOutCountries();
        
        //Serialisierte Version erzeugen
        _jsonMap = serializeAsJSON();
        //ServerMap erzeugen
        _serverMap = generateServerMap();
    }
    
    //Teilt Länder an Spieler aus
    function handOutCountries()
    {
        //Array kopieren
        var allCountries = _map.allCountries.slice();
        
        //Solange es noch Länder zu verteilen gibt
        while(allCountries.length > 0)
        {
            //Alle Spieler durchgehen
            for(var i = 0; i < _player.length; i++)
            {
                //Abbruch wenn Länder alle
                if(allCountries.length === 0)
                    break;
                
                //Land verteilen
                var random = Math.floor(Math.random()*(allCountries.length));
                allCountries[random].player = _player[i];
                allCountries.splice(random, 1);
            }
        }
    }
    
    // <editor-fold defaultstate="collapsed" desc="init-functions">
    
    //Einstellungen für 2 Spieler
    function setUp2Player()
    {
        _mapGenerator.setGridSize(110,110);
        _mapGenerator.setMaximumCountrySize(300);
        _mapGenerator.setMinimumCountrySize(200);
        _mapGenerator.setMinimumContinentNumber(4);
        _mapGenerator.setMaximumContinentNumber(7);
        _mapGenerator.setMinimumContinentSize(4);
        _mapGenerator.setMaximumWaterNumber(4);
        _mapGenerator.setMinimumWaterNumber(2);
    }
    
    //Einstellungen für 3 Spieler
    function setUp3Player()
    {
        _mapGenerator.setGridSize(130,130);
        _mapGenerator.setMaximumCountrySize(300);
        _mapGenerator.setMinimumCountrySize(200);
        _mapGenerator.setMinimumContinentNumber(5);
        _mapGenerator.setMaximumContinentNumber(9);
        _mapGenerator.setMinimumContinentSize(4);
        _mapGenerator.setMaximumWaterNumber(5);
        _mapGenerator.setMinimumWaterNumber(3);
    }
    
    //Einstellungen für 4 Spieler
    function setUp4Player()
    {
        _mapGenerator.setGridSize(150,150);
        _mapGenerator.setMaximumCountrySize(300);
        _mapGenerator.setMinimumCountrySize(200);
        _mapGenerator.setMinimumContinentNumber(6);
        _mapGenerator.setMaximumContinentNumber(10);
        _mapGenerator.setMinimumContinentSize(4);
        _mapGenerator.setMaximumWaterNumber(6);
        _mapGenerator.setMinimumWaterNumber(4);
    }   
    // </editor-fold>
    
    //Holt die Server-Map
    function getServerMap()
    {
        if(!_map)
            throw new Error("Call init first!");
        return _serverMap;
    }
    
    //Holt die Map
    function getMap()
    {
        if(!_map)
            throw new Error("Call init first!");
        return _map;
    }
    
    function getSerializedMap(obj)
    {
        if(!_map)
            throw new Error("Call init first!");
        //TODO: serialisieren
        var out = _jsonMap;
        out.info = obj;
        return JSON.stringify(out);
    }
    
    //Setzt Werte zurück
    function reset()
    {
        _map = null;
        _player=[];
        _jsonMap = null;
        _serverMap = null;
    }
    
    //Holt den Map-Generator
    function getMapGenerator()
    {
        return _mapGenerator;
    }
    
    //ServerMap
    function generateServerMap()
    {
        var sMap;
        var sContinent;
        var sCountry;
        
        //Entscheidung ob Server oder nicht
        if(typeof module !== "undefined")
        {
            sMap = module.require("./serverMap.js");
            sContinent = module.require("./serverContinent.js");
            sCountry = module.require("./serverCountry.js");
        }
        else
        {
            sMap = tddjs.server.map.map;
            sContinent = tddjs.server.map.continent;
            sCountry = tddjs.server.map.country;
        }
        
        //Servermap
        var serverMap = new sMap();
        
        var countrys= [];
        
        //Alle Länder durchgehen
        for(var i = 0; i < _map.allCountries.length; i++)
        {
            var currentPseudo = _map.allCountries[i];
            
            var current = new sCountry();
            current.setName(currentPseudo.name);
            current.setOwner(currentPseudo.player);
            countrys[currentPseudo.id] = current;
        }
        
        //Nochmal
        for(var i = 0; i < _map.allCountries.length; i++)
        {
            var currentBorders = _map.allCountries[i].borders;
            
            //Alle Grenzen durchgehen
            for(var j = 0; j < currentBorders.length; j++)
            {
                countrys[_map.allCountries[i].id].addBorder(countrys[currentBorders[j].id]);
            }
        }
        
        //Kontinente durchgehen
        for(var i = 0; i < _map.continents.length; i++)
        {
            var currentPseudo = _map.continents[i];
            var current = new sContinent();
            
            current.setName(currentPseudo.name);
            current.setUnitBonus(currentPseudo.unitBonus);
            
            //Länder durchgehen
            for(var j = 0; j < currentPseudo.countries.length; j++)
            {
                current.addCountry(countrys[currentPseudo.countries[j].id]);
            }
            
            serverMap.addContinent(current);
        }
        
        return serverMap;
    }
            
    //Serialisieren
    function serializeAsJSON()
    {
        var json = {};
        json.continents = [];
        json.countries = [];
        json.players = [];
        
        //Alle Spieler durchgehen
        for(var i = 0; i < _player.length; i++)
        {
            json.players.push(_player[i].serializeAsObject());
        }
        
        //Alle Länder durchgehen
        for(var i = 0; i < _map.allCountries.length; i++)
        {
            json.countries[i] = {};
            json.countries[i].id = _map.allCountries[i].id;
            json.countries[i].name = _map.allCountries[i].name;
            json.countries[i].size = _map.allCountries[i].size;
            json.countries[i].player = _map.allCountries[i].player.getId();
        }
        
        //Alle Kontinente durchgehen
        for(var c = 0; c < _map.continents.length; c++)
        {
            //Kontinentwerte schreiben
            json.continents[c] = {};
            json.continents[c].id = _map.continents[c].id;
            json.continents[c].name = _map.continents[c].name;
            json.continents[c].unitBonus = _map.continents[c].unitBonus;           
            json.continents[c].countries = [];
            
            //Alle Länder des aktuellen Kontinents durchgehen
            for(var countr=0; countr < _map.continents[c].countries.length; countr++)
            {
                //Aktuelle Länderwerte schreiben
                json.continents[c].countries[countr] = {};
                json.continents[c].countries[countr].id = _map.continents[c].countries[countr].id;            
                json.continents[c].countries[countr].borders = [];
                
                //Grenzen des aktuellen Landes durchgehen
                for(var b=0; b < _map.continents[c].countries[countr].borders.length; b++)
                {
                    json.continents[c].countries[countr].borders[b] = _map.continents[c].countries[countr].borders[b].id;
                }
            }
        }
        
        //Wasserwerte schreiben
        json.water = {};
        json.water.id = _map.water.id;
        json.water.name = _map.water.name;
        json.water.size = _map.water.size;
        json.water.fields = _map.water.fields;
        json.water.border = [[]];
        
        //Wassergrenzen durchgehen
        for(var i in _map.water.borders)
        {
            if(_map.water.borders[i].length > 0)
                json.water.border.push([_map.water.borders[i][0].id, _map.water.borders[i][1].id]);
        }
        
        //Grid werte holen
        var width = _mapGenerator.getMapWidth();
        var height = _mapGenerator.getMapHeight();
        var cellGrid = _mapGenerator.getMapGrid();
        
        //Grid schreiben
        json.gridMap = createArray(width, height);
        for(var x=0; x < width; x++)
        {
            for(var y=0; y < height; y++)
            {
                json.gridMap[x][y] = {};
                json.gridMap[x][y].id = cellGrid[x][y].id;
            }
        }        
        
        return json;
    }
    
    //Erzeugt Array
    function createArray(length)
    {
        var arr = new Array(length || 0),
            i = length;

        if (arguments.length > 1) {
            var args = Array.prototype.slice.call(arguments, 1);
            while(i--) arr[length-1 - i] = createArray.apply(this, args);
        }

        return arr;
    }
    
    this.init = init;
    this.getMap = getMap;
    this.getSerializedMap = getSerializedMap;
    this.getServerMap = getServerMap;
    
    this.reset = reset;
    
    this.getMapGenerator = getMapGenerator;
}
