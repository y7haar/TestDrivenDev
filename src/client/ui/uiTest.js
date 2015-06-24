/* 
 * 
 */


function startGame(){
    var controller;
    var m;
    var m2;

    //Einstellungen Generator
    m=new tddjs.server.controller.mapGenerator();
    m.setGridSize(150,150);
    m.setMaximumCountrySize(300);
    m.setMinimumCountrySize(200);
    m.setMinimumContinentNumber(6);
    m.setMaximumContinentNumber(10);
    m.setMinimumContinentSize(4);
    m.setMinimumWaterNumber(6);
    m.setMinimumWaterNumber(4);
    
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
    m.getCountryNameGenerator().setNameList(countryList);
    //Kontinentnamen
    var list = ["Aranonda", "Lorna", "Lors", "Faridon", "Elona", "Cantha", "Tyria",
                    "Nod", "Rod", "Kryta", "Ascalon", "Elysium", "Braktarien", "Karatie"];
    m.getContinentNameGenerator().setNameList(list); 
    
    canvas = document.getElementById('game');
    if (canvas && canvas.getContext) {
       ctx = canvas.getContext("2d");
       if (ctx) {
            controller = new tddjs.client.ui.gameUiController(null,ctx);
            
            m2 = m.generateMap();
            // nur zur hilfe  mfg Alex
            console.log("MAP: \n"+m2);
            m2 = m.serializeAsJSON(m2);
            //controller._getMap(m2);
            //controller._initMap();
            controller.addButton( new tddjs.client.ui.button(30,canvas.height-60,"TEST",ctx));
            //window.requestAnimationFrame(controller.drawLoading);
            controller.init(m2);
       }
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
