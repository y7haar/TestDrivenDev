/* 
 *  Some global variables
 */

var BASE_URL = "http://93.209.209.144:8181/";

var COUNTRY_NAMES_ARRAY = ["Bakaresh", "Rodkaresh", "Bastion Akundur", "Ankh Morpork", "Serandur", "Sturmgipfel",
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

var CONTINENT_NAMES_ARRAY = ["Aranonda", "Lorna", "Lors", "Faridon", "Elona", "Cantha", "Tyria",
    "Nod", "Rod", "Kryta", "Ascalon", "Elysium", "Braktarien", "Karatie"];



function generateMap()
{
    // map for testing    
    var map1 = new tddjs.client.map.map();
    var player1 = new tddjs.client.player();
    player1.setName('Peter');
    var player2 = new tddjs.client.player();
    player2.setName('Hanswurst');

    //Continent1--- EUROPA ----------------------
    var continent1 = new tddjs.client.map.continent();
    continent1.setName("Europa");

    var c1 = new tddjs.client.map.country();
    c1.setName("Country1");
    c1.setOwner(player1);

    var c2 = new tddjs.client.map.country();
    c2.setName("Country2");
    c2.setOwner(player2);

    var c3 = new tddjs.client.map.country();
    c3.setName("Country3");
    c3.setOwner(player2);

    continent1.addCountry(c1);
    continent1.addCountry(c2);
    continent1.addCountry(c3);

    //Continent2--- ASIEN ------------------------
    var continent2 = new tddjs.client.map.continent();
    continent2.setName("Asien");
    var c4 = new tddjs.client.map.country();
    c4.setName("Country4");
    c4.setOwner(player2);

    var c5 = new tddjs.client.map.country();
    c5.setName("Country5");
    c5.setOwner(player2);

    var c6 = new tddjs.client.map.country();
    c6.setName("Country6");
    c6.setOwner(player1);

    continent2.addCountry(c4);
    continent2.addCountry(c5);
    continent2.addCountry(c6);
    //Borders-------------------------------
    c1.addBorder(c2);
    c2.addBorder(c1);
    //add continets to map -----------------
    map1.addContinent(continent1);
    map1.addContinent(continent2);

    return map1;
}