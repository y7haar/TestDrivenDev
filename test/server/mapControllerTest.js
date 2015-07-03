/* 
 * Testcases for MapController
 */
TestCase("MapControllerTest",
{
    setUp: function ()
    {
        this.mapCon = new tddjs.server.controller.mapController();
        
        //Namen für Generation Testweise!
        var countryList = ["Bakaresh", "Rodkaresh", "Bastion Akundur", "Ankh Morpork", "Serandur", "Sturmgipfel",
                    "Kristallnarbe", "Kristallwüste", "Gewundener Wald", "Piltover", "Zaun", "Demacia", 
                    "Schicksalsschlucht", "Cavalon", "Haus zu Heltzer", "Zentrum von Kaineng", "Kloster von Shingjea",
                    "Borlispass", "Gunnars Feste", "Ratasum", "Droknars Schmiede", "Oase Amnoon", 
                    "Steinkreis von Denravi", "Löwenstein", "Wachturmküste", "Frosttor", "Nolani-Akademie",
                    "Der große Nordwall", "Fort Ranik", "Erntetempel", "Skyrim", "Kamadan", "Halle der Sonnenspeere",
                    "Faring", "Valorian", "Sardelek-Sanatorium", "Drascir", "Die schwarze Zitadelle", "Ebonhawk",
                    "Kluft der Beschwörer", "Abbadons Maul", "Tor des Wahnsinns", "Tor der Angst", "Tor der Schmerzen",
                    "Tor der Pein", "Vaabi", "Schwarzwasserküste", "Eisminen von Moladune", "Ödland", "Rin",
                    "Markt von Faible", "Seufzer-Graftschaft", "Dünen der Verzweiflung", "Fels der Weissagung",
                    "Maguuma-Dschungel", "Zittergipfelgebirge", "Ruinen von Surmia", "Drachenschlund ",
                    "Pockennarbenebene", "Grooble-Schlucht", "Signalfeuerposten", "Lornarpass", "Arah", 
                    "Das Trockene Meer", "Auroralichtung", "Ostgrenze", "Tempel der Zeitalter", "Halle der Helden",
                    "Idylissches Tal", "Noxus", "Ionia", "Shurima", "Platonien", "Gefrorenes Herz",
                    "Tal des Erzengels", "Trauerschlucht", "Kimberleys Tränen", "Tal des Schreckens", "Minental",
                    "Khorinis", "Jharkendar", "Irdorath", "Myrtana", "Nordmar", "Varant", "Velen", "Novigrad",
                    "Skellige", "Weißgarten", "Oxenfurt", "Kaer Morhen", "Wyzima", "Weißlauf", "Flusswald", "Riften",
                    "Winterfeste", "Morthal", "Windhelm", "Markarth", "Helgen"];
        //Kontinentnamen
        var list = ["Aranonda", "Lorna", "Lors", "Faridon", "Elona", "Cantha", "Tyria",
                    "Nod", "Rod", "Kryta", "Ascalon", "Elysium", "Braktarien", "Karatie"];
                
        this.mapCon.getMapGenerator().getContinentNameGenerator().setNameList(countryList);
        this.mapCon.getMapGenerator().getCountryNameGenerator().setNameList(list);
   
        //Spieler
        this.player1 = new tddjs.server.player();
        this.player1.setId(1);
        this.player1.setName("Ranol");
        this.player1.setColor("#FFA500");
        this.player2 = new tddjs.server.player();
        this.player2.setId(2);
        this.player2.setName("Kimberley");
        this.player2.setColor("#FFFF00");
        this.player3 = new tddjs.server.player();
        this.player3.setId(3);
        this.player3.setName("Riodian");
        this.player3.setColor("#7FFF00");
        this.player4 = new tddjs.server.player();
        this.player4.setId(4);
        this.player4.setName("Merowinger");
        this.player4.setColor("#87CEFA");
        
        //Spielergruppen
        this.one = [this.player1];
        this.two = [this.player1, this.player2];
        this.three = [this.player1, this.player2, this.player3];
        this.four = [this.player1, this.player2, this.player3, this.player4];
    }, 
    
    tearDown: function ()
    {
        delete this.mapCon;
    },
    
    "test object of mapController should not be undefined": function()
    {  
        assertObject(this.mapCon);
    },
    
    "test Cant init with a playersize below two": function()
    {
        var mapCon = this.mapCon;
        var one = this.one;
        
        assertException(function(){mapCon.init(one);}, "Error");
    },
    
    "test if mapController has a instance of mapGenerator after init": function()
    {  
        this.mapCon.init(this.two);
        var mapGen = this.mapCon.getMapGenerator();
        
        assertTrue(mapGen instanceof tddjs.server.controller.mapGenerator);
    },
    
    "test mapController should be setup before getMap is called":function()
    {
        var mapCon = this.mapCon;
        
        assertException(function(){mapCon.getMap();},"Error");
    },
    
    "test mapController should be setup before getSerializedMap is called":function()
    {
        var mapCon = this.mapCon;
        
        assertException(function(){mapCon.getSerializedMap();},"Error");
    },
    
    "test mapController should be reseted when reset is called":function()
    {
        this.mapCon.init(this.two);
        this.mapCon.reset();
        var mapCon = this.mapCon;
        
        assertException(function(){mapCon.getMap();},"Error");
    },
    
    "test if mapController return valid serverMap": function()
    {  
        this.mapCon.init(this.two);
        //TODO: strukture überlegen, wie was aufgerufen werden muss
        
        var map = this.mapCon.getMap();
        //TODO: test map
    },
    
    "test if mapController return valid serialized clientMap": function()
    {  
        //TODO: test für serialisierte map
    },
    
    "test mapController should return same map if not reseted": function()
    {  
        //TODO: gleicher test wie "test if mapController return valid serverMap"
        // nur 2mal, um zu testen ob 2mal die selbe map kommt
        
        this.mapCon.init(this.four);
        var map = this.mapCon.getMap();
        var map2 = this.mapCon.getMap();
        
        assertEquals(map,map2);
    },
    
    "test mapController should return same server map if not reseted": function()
    {        
        this.mapCon.init(this.four);
        var map = this.mapCon.getServerMap();
        var map2 = this.mapCon.getServerMap();
        
        assertEquals(map,map2);
    },
    
    "test mapController should return same serialized map if not reseted": function()
    {         
        this.mapCon.init(this.four);
        var map = this.mapCon.getServerMap();
        var map2 = this.mapCon.getServerMap();
        
        assertEquals(map,map2);
    },
    
    "test if mapController produce different mapSizes for different Playercount": function()
    {       
        this.mapCon.init(this.two);
        var map = this.mapCon.getMap();
        this.mapCon.reset();
        
        assertEquals(110, map.cellGrid.length);
        assertEquals(110, map.cellGrid[0].length);
        
        this.mapCon.init(this.three);
        map = this.mapCon.getMap();
        this.mapCon.reset();
        
        assertEquals(130, map.cellGrid.length);
        assertEquals(130, map.cellGrid[0].length);
        
        this.mapCon.init(this.four);
        map = this.mapCon.getMap();
        this.mapCon.reset();
        
        assertEquals(150, map.cellGrid.length);
        assertEquals(150, map.cellGrid[0].length);
    } 
});
