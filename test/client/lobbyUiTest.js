/* 
 *  Test cases for the lobby UI
 */


TestCase("LobbyUiTest", {
    setUp: function () {
        this.lobbyUi = new tddjs.client.ui.lobbyUi();
        
      this.lobby1 = new tddjs.server.model.lobby();
      this.lobby2 = new tddjs.server.model.lobby();
      
      this.player1 = new tddjs.client.player();
      this.player2 = new tddjs.client.player();
      this.player3 = new tddjs.client.player();
      this.player4 = new tddjs.client.player();
      
      this.player1.setId(1);
      this.player2.setId(2);
      this.player3.setId(3);
      this.player4.setId(4);
      
      this.player1.setName("P1");
      this.player2.setName("P2");
      this.player3.setName("P3");
      this.player4.setName("P4");
      
      this.player1.setColor("#000000");
      this.player2.setColor("#111111");
      this.player3.setColor("#222222");
      this.player4.setColor("#333333");
      
      this.lobby1.setId(0);
      this.lobby2.setId(1);
      
      this.lobby1.setName("L1");
      this.lobby2.setName("L2");
      
      this.lobby1.addPlayer(this.player1);
      this.lobby1.addPlayer(this.player2);
      this.lobby2.addPlayer(this.player3);
      this.lobby2.addPlayer(this.player4);
      
      this.lobby1.setLeader(this.player1);
      this.lobby2.setLeader(this.player4);
      
      this.lobby1.setMaxPlayers(2);
      this.lobby2.setMaxPlayers(3);
      
      this.lobby1Json = this.lobby1.serialize();
      this.lobby2Json = this.lobby2.serialize();
      
      
    }, 
    tearDown: function ()
    {
        delete this.lobbyUi;
        delete this.lobby1;
        delete this.lobby2;
    },
    
    "test lobbyUi should not be undefined after constructor call": function () {  
        assertObject(this.lobbyUi);
    },
    
    "test lobbyUi should have a function to create div wrapper": function () {  
        assertFunction(this.lobbyUi.createWrapper);
    },
    
     "test lobbyUi should have a function to add a new Lobby": function () {  
        assertFunction(this.lobbyUi.addLobby);
    },
    
     "test lobbyUi should have a function to be called on join submit button": function () {  
        assertFunction(this.lobbyUi.onJoinSubmit);
    },
    
    "test onJoinSubmit must have parameter of type object, else throw an Error": function () {  
       var ui = this.lobbyUi;
        
       assertNoException(function() { ui.onJoinSubmit({}); } );
       assertException(function() { ui.onJoinSubmit(4); }, "TypeError" );
    },
    
    "test lobbyUi should have a function to display an error message": function () {  
        assertFunction(this.lobbyUi.showErrorMessage);
    },
    
    // DOM Tests
    
    "test createWrapper should append the content with correct class": function () {  
        /*:DOC += <div class = "content" id = "content"></div> */
        
        this.content = document.getElementById("content");
        
        assertEquals("", this.content.innerHTML);

        this.lobbyUi.createWrapper();

        var wrapper = document.getElementById("lobbyWrapper");
        assertTagName("div", wrapper);
        assertClassName("lobbyWrapper", wrapper);

        assertEquals(wrapper, this.content.childNodes[0]);
    },
    
    "test addLobby should append wrapper with given lobby": function () {  
        /*:DOC += <div class = "content" id = "content"><div class = "lobbyWrapper" id = "lobbyWrapper"></div></div> */
        
        this.wrapper = document.getElementById("lobbyWrapper");

        assertEquals("", this.wrapper.innerHTML);
        
        this.lobbyUi.addLobby(JSON.parse(this.lobby1Json));
        this.lobbyUi.addLobby(JSON.parse(this.lobby2Json));
        
        var lobbies = this.wrapper.childNodes;
        assertEquals(2, lobbies.length);
        
        assertTagName("div", lobbies[0]);
        assertTagName("div", lobbies[1]);
        
        
        var lobbyTable1 = lobbies[0].getElementsByTagName("table")[0];
        var lobbyTable2 = lobbies[1].getElementsByTagName("table")[0];
        
        assertTagName("table", lobbyTable1);
        assertTagName("table", lobbyTable2);
        
        assertTagName("tr", lobbyTable1.getElementsByTagName("tr")[0]);
        assertTagName("tr", lobbyTable2.getElementsByTagName("tr")[0]);
        
        var lobbyTrContent1 = lobbyTable1.getElementsByTagName("tr")[0].childNodes;
        var lobbyTrContent2 = lobbyTable2.getElementsByTagName("tr")[0].childNodes;
        
        assertTagName("td", lobbyTrContent1[0]);
        assertTagName("td", lobbyTrContent1[1]);
        assertTagName("td", lobbyTrContent1[2]);
        assertTagName("td", lobbyTrContent1[3]);
        
        assertTagName("div", lobbyTrContent1[3].childNodes[0]);
        
        assertTagName("td", lobbyTrContent2[0]);
        assertTagName("td", lobbyTrContent2[1]);
        assertTagName("td", lobbyTrContent2[2]);
        assertTagName("td", lobbyTrContent2[3]);
        
        assertTagName("div", lobbyTrContent2[3].childNodes[0]);
        
        assertEquals("#0", lobbyTrContent1[0].innerHTML);
        assertEquals("L1", lobbyTrContent1[1].innerHTML);
        assertEquals("2 / 2", lobbyTrContent1[2].innerHTML);
        assertEquals("Join", lobbyTrContent1[3].childNodes[0].innerHTML);
        
        assertEquals("#1", lobbyTrContent2[0].innerHTML);
        assertEquals("L2", lobbyTrContent2[1].innerHTML);
        assertEquals("2 / 3", lobbyTrContent2[2].innerHTML);
        assertEquals("Join", lobbyTrContent2[3].childNodes[0].innerHTML);
    }
});
