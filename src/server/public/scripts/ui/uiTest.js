/* 
 * Test für die grafischen Ausgaben
 */


function startGame(){
    var controller;
    var mapController = new tddjs.server.controller.mapController();
    var map;
    var left = 5;
    
    
    //Spieler
    var players = [];
    
    var player1 = new tddjs.client.player();
    player1.setId(1);
    player1.setName("Ranol");
    player1.setColor("#FFA500");
    players.push(player1);
    var player2 = new tddjs.client.player();
    player2.setId(2);
    player2.setName("Kimberley");
    player2.setColor("#FFFF00");
    players.push(player2);
    var player3 = new tddjs.client.player();
    player3.setId(3);
    player3.setName("Riodian");
    player3.setColor("#7FFF00");
    players.push(player3);
    var player4 = new tddjs.client.player();
    player4.setId(4);
    player4.setName("Merowinger");
    player4.setColor("#87CEFA");
    players.push(player4);
    
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
                
    //Namenslisten setzen
    mapController.getMapGenerator().getCountryNameGenerator().setNameList(countryList);
    mapController.getMapGenerator().getContinentNameGenerator().setNameList(list); 
    
    canvas = document.getElementById('game');
    if (canvas && canvas.getContext) {
       ctx = canvas.getContext("2d");
       if (ctx) {
            controller = new tddjs.client.ui.gameUiController(ctx);
            
            //Karten erstellen
            mapController.init(players);

            map = mapController.getSerializedMap();
            //controller._getMap(m2);
            //controller._initMap();
            //window.requestAnimationFrame(controller.drawLoading);
            
            //buttons
            var buttons={};
            buttons["placingState"]=[];
            buttons["placingState"][0]=new tddjs.client.ui.button(40,635,"str",ctx);
            buttons["placingState"][0].click=place;
            buttons["attackingState"]=[];
            buttons["attackingState"][0]=new tddjs.client.ui.button(40,635,"Attack!",ctx);
            buttons["attackingState"][1]=new tddjs.client.ui.button(130,635,"Finish",ctx);
            buttons["waitingState"]=[];
            buttons["waitingState"][0]=new tddjs.client.ui.button(40,635,"str",ctx);
            
            controller.setPlayerColor(player1.getColor());
            controller.setStateStr(player1.getName() +": "+ "placingState")
            controller.setButtons(buttons["placingState"]);
            buttons["placingState"][0].setText("Finished ("+left+")");
            
            controller.mapDown = mousePlace;
            
            controller.init(map);
       }
   }
   function place(){
       //window.alert("jo");
       left=5;
       buttons["placingState"][0].setText("Finished ("+left+")");
   }
   function mousePlace(x,y){
       var _gridMap = controller.getGridMap();
       
       
       var id = _gridMap[x][y].id;
        
        if(id>=0 & left !==0 & _gridMap[x][y].getOwner() === controller.getPlayerById(1)){ //kein wasser
            _gridMap[x][y].addUnits(1);
            left--;
        }
       
       controller.updateUnitCounts();
       buttons["placingState"][0].setText("Finished ("+left+")");
       //window.alert(x+"|"+y);
   }
}
// gernateMap ist schon in globals definiert 
// entwerder testfile nicht global machen oder andern namen verwenden
/*
function generateMapTOCHANGE(){
    ctx.strokeStyle="#000";
    ctx.fillStyle = "#552700";
    ctx.lineWidth="1";
    ctx.font = "30px Arial";
    ctx.fillText("generating map...",10,50);
    
    m2 = m.generateMap();
    m2= m.serializeAsJSON(m2);
    window.requestAnimationFrame(renderMap);
}
function renderMap(){
    ctx.strokeStyle="#000";
    ctx.fillStyle = "#552700";
    ctx.lineWidth="1";
    ctx.font = "30px Arial";
    ctx.fillText("render map...",10,80);
    ctx.fillText("...this can take a while!",80,110);
    
    controller._getMap(m2);
    controller._initMap();
    window.requestAnimationFrame(controller.drawLoading);
}
*/
