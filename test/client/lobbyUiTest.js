/* 
 *  Test cases for the lobby UI
 */

function lobbyUiSetup()
{
    this.lobbyRequestController = new tddjs.client.controller.lobbyRequestController();
    this.lobbyUi = new tddjs.client.ui.lobbyUi(this.lobbyRequestController);
    this.lobbyRequestController.setLobbyUi(this.lobbyUi);

    this.lobby1 = new tddjs.client.model.lobby();
    this.lobby2 = new tddjs.client.model.lobby();
    this.lobby3 = new tddjs.client.model.lobby();

    this.player1 = new tddjs.client.player();
    this.player2 = new tddjs.client.player();
    this.player3 = new tddjs.client.player();
    this.player4 = new tddjs.client.player();
    this.player5 = new tddjs.client.player();

    this.player1.setId(1);
    this.player2.setId(2);
    this.player3.setId(3);
    this.player4.setId(4);
    this.player5.setId(5);

    this.player1.setName("P1");
    this.player2.setName("P2");
    this.player3.setName("P3");
    this.player4.setName("P4");
    this.player5.setName("P5");

    this.player1.setColor("#000000");
    this.player2.setColor("#111111");
    this.player3.setColor("#222222");
    this.player4.setColor("#333333");
    this.player5.setColor("#dddddd");

    this.player4.setType("bot");

    this.lobby1.setId(0);
    this.lobby2.setId(1);
    this.lobby3.setId(1);

    this.lobby1.setName("L1");
    this.lobby2.setName("L2");
    this.lobby3.setName("L2");

    this.lobby1.addPlayer(this.player1);
    this.lobby1.addPlayer(this.player2);
    this.lobby2.addPlayer(this.player3);
    this.lobby2.addPlayer(this.player4);

    this.lobby3.addPlayer(this.player3);
    this.lobby3.addPlayer(this.player4);
    this.lobby3.addPlayer(this.player5);

    this.lobby1.setLeader(this.player1);
    this.lobby2.setLeader(this.player3);

    this.lobby3.setLeader(this.player3);

    this.lobby1.setMaxPlayers(2);
    this.lobby2.setMaxPlayers(3);

    this.lobby3.setMaxPlayers(4);

    this.lobby1Json = this.lobby1.serialize();
    this.lobby2Json = this.lobby2.serialize();

    this.lobbyUi.setCurrentLobby(this.lobby3);

    this.sandbox = sinon.sandbox.create();
}

function lobbyUiTeardown()
{
    delete this.lobbyUi;
    delete this.lobby1;
    delete this.lobby2;

    this.sandbox.restore();
}


TestCase("LobbyUiTest", {
    setUp: lobbyUiSetup,
    tearDown: lobbyUiTeardown,
    "test lobbyUi should not be undefined after constructor call": function() {
        assertObject(this.lobbyUi);
    },
    "test lobbyUi should have a function to create div wrapper": function() {
        assertFunction(this.lobbyUi.createWrapper);
    },
    "test lobbyUi should have a function to add a new Lobby": function() {
        assertFunction(this.lobbyUi.addLobby);
    },
    "test lobbyUi should have a function to be called on join submit button": function() {
        assertFunction(this.lobbyUi.onJoinSubmit);
    },
    "test onJoinSubmit must have parameter of type number, else throw an Error": function() {
        var ui = this.lobbyUi;
        var player = this.player1;

        assertNoException(function() {
            ui.onJoinSubmit(4, player);
        });
        assertException(function() {
            ui.onJoinSubmit("4");
        }, "TypeError");
    },
    "test class should have getter for lobbyRequestController instance": function() {
        assertFunction(this.lobbyUi.getLobbyRequestController);
        assertTrue(this.lobbyUi.getLobbyRequestController() instanceof tddjs.client.controller.lobbyRequestController);
    },
    "test onJoinSubmit should call method in lobbyRequestController to do a POST request": function() {
        var ui = this.lobbyUi;
        var requestController = ui.getLobbyRequestController();
        var spy = this.sandbox.spy(requestController, "requestJoin");

        sinon.assert.notCalled(spy);
        ui.onJoinSubmit(1, this.player1);
        sinon.assert.calledOnce(spy);
    },
    "test onJoinSubmit should call method in lobbyRequestController witch correct parameters": function() {
        var ui = this.lobbyUi;
        var requestController = ui.getLobbyRequestController();
        var spy = this.sandbox.spy(requestController, "requestJoin");

        var defaultPlayer = new tddjs.client.player();
        defaultPlayer.setName("Unnamed Player");
        defaultPlayer.setColor("#ffffff");

        ui.onJoinSubmit(1, this.player1);
        sinon.assert.calledWith(spy, 1, this.player1);

        ui.onJoinSubmit(1);
        sinon.assert.calledWith(spy, 1);

        assertEquals("Unnamed Player", spy.args[1][1].getName());
        assertEquals("#ffffff", spy.args[1][1].getColor());
    },
    "test lobbyUi should have a function to display an error message": function() {
        assertFunction(this.lobbyUi.showErrorMessage);
    },
    // DOM Tests

    "test createWrapper should append the content with correct class": function() {
        /*:DOC += <div class = "content" id = "content"></div> */

        this.content = document.getElementById("content");

        assertEquals("", this.content.innerHTML);

        this.lobbyUi.createWrapper();

        var wrapper = document.getElementById("lobbyWrapper");
        assertTagName("div", wrapper);
        assertClassName("lobbyWrapper", wrapper);

        assertEquals(wrapper, this.content.childNodes[0]);
    },
    "test addLobby should append wrapper with given lobby": function() {
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
    },
    "test lobbyUi should have function to add new lobby button": function() {
        assertFunction(this.lobbyUi.addNewLobbyButton);
    },
    "test addNewLobbyButton should append a button ": function() {
        /*:DOC += <div class = "content" id = "content"><div class = "lobbyWrapper" id = "lobbyWrapper"></div></div> */

        this.wrapper = document.getElementById("lobbyWrapper");

        this.lobbyUi.addNewLobbyButton();

        var lobbies = this.wrapper.childNodes;
        var buttonDiv = lobbies[lobbies.length - 1];

        assertTagName("div", buttonDiv);
        assertEquals("newLobbyButton", buttonDiv.className);
        assertEquals("New Lobby", buttonDiv.innerHTML);
    },
    "test lobbyUi should have function to show lobby overview": function() {
        assertFunction(this.lobbyUi.showLobbyOverview);
    },
    "test lobbyUi should call methods to create Lobby Overview UI": function() {

        var requestController = this.lobbyUi.getLobbyRequestController();

        var createContentSpy = this.sandbox.spy(this.lobbyUi, "createContent");
        var createWrapperSpy = this.sandbox.spy(this.lobbyUi, "createWrapper");
        var requestAllLobbiesSpy = this.sandbox.spy(requestController, "requestAllLobbies");


        sinon.assert.notCalled(createContentSpy);
        sinon.assert.notCalled(createWrapperSpy);
        sinon.assert.notCalled(requestAllLobbiesSpy);

        this.lobbyUi.showLobbyOverview();

        sinon.assert.calledOnce(createContentSpy);
        sinon.assert.calledOnce(createWrapperSpy);
        sinon.assert.calledOnce(requestAllLobbiesSpy);
    }
});

TestCase("SingleLobbyUiTest", {
    setUp: lobbyUiSetup,
    tearDown: lobbyUiTeardown,
    // Tests for single Lobby instance

    "test ui should have function to display a Lobby": function() {
        assertFunction(this.lobbyUi.showLobby);
    },
    "test showLobby should show a lobby with correct title name": function() {
        /*:DOC += <div class = "content" id = "content"><div class = "lobbyWrapper" id = "lobbyWrapper"></div></div> */
        this.lobbyUi.createWrapper();
        this.lobbyUi.showLobby(this.lobby1);

        var wrapper = document.getElementById("lobbyWrapper");
        var wrapperNodes = wrapper.childNodes;
        var h1 = wrapperNodes[0];
        assertTagName("h1", h1);
        assertEquals("lobbyTitle", h1.className);
        assertEquals("#" + 0 + " " + "L1", h1.innerHTML);
    },
    "test showLobby should show a lobby with correct players / maxPlayers": function() {
        /*:DOC += <div class = "content" id = "content"><div class = "lobbyWrapper" id = "lobbyWrapper"></div></div> */
        this.lobbyUi.createWrapper();
        this.lobbyUi.showLobby(this.lobby1);

        var wrapper = document.getElementById("lobbyWrapper");
        var wrapperNodes = wrapper.childNodes;
        var p = wrapperNodes[1];
        assertTagName("p", p);
        assertEquals("lobbyMaxPlayers", p.className);
        assertEquals("2 / 2 Players", p.innerHTML);
    },
    "test multiple calls of showLobby should not append the body": function() {
        /*:DOC += <div class = "content" id = "content"><div class = "lobbyWrapper" id = "lobbyWrapper"></div></div> */
        this.lobbyUi.createWrapper();
        this.lobbyUi.showLobby(this.lobby1);

        var count = document.getElementById("lobbyWrapper").childNodes.length;
        this.lobbyUi.showLobby(this.lobby1);

        assertEquals(count, document.getElementById("lobbyWrapper").childNodes.length);

    },
    "test showLobby should show a lobby with correct max Players divs": function() {
        /*:DOC += <div class = "content" id = "content"><div class = "lobbyWrapper" id = "lobbyWrapper"></div></div> */
        this.lobbyUi.createWrapper();
        this.lobbyUi.showLobby(this.lobby2);

        var playerWrapper = document.getElementById("playerWrapper");
        assertTagName("div", playerWrapper);
        assertEquals("playerWrapper", playerWrapper.className);

        // Max Player count
        assertEquals(3, playerWrapper.childNodes.length);
        assertTagName("div", playerWrapper.childNodes[0]);
        assertTagName("div", playerWrapper.childNodes[1]);
        assertTagName("div", playerWrapper.childNodes[2]);

        assertEquals("playerId" + "3", playerWrapper.childNodes[0].id);
        assertEquals("playerId" + "4", playerWrapper.childNodes[1].id);
        assertEquals("", playerWrapper.childNodes[2].id);

        assertEquals("lobbyPlayer", playerWrapper.childNodes[0].className);
        assertEquals("lobbyPlayer", playerWrapper.childNodes[1].className);
        assertEquals("lobbyPlayer", playerWrapper.childNodes[2].className);
    },
    "test player Div should contain correct container": function() {
        /*:DOC += <div class = "content" id = "content"><div class = "lobbyWrapper" id = "lobbyWrapper"></div></div> */
        this.lobbyUi.createWrapper();
        this.lobbyUi.showLobby(this.lobby2);

        var playerWrapper = document.getElementById("playerWrapper");
        var players = playerWrapper.childNodes;

        assertTagName("table", players[0].childNodes[0]);
        assertTagName("table", players[1].childNodes[0]);
        assertTagName("table", players[2].childNodes[0]);

        assertTagName("tr", players[0].childNodes[0].childNodes[0]);
        assertTagName("tr", players[1].childNodes[0].childNodes[0]);
        assertTagName("tr", players[2].childNodes[0].childNodes[0]);

        assertTagName("td", players[0].childNodes[0].childNodes[0].childNodes[0]);
        assertTagName("td", players[0].childNodes[0].childNodes[0].childNodes[1]);
        assertTagName("td", players[0].childNodes[0].childNodes[0].childNodes[2]);

        assertTagName("td", players[1].childNodes[0].childNodes[0].childNodes[0]);
        assertTagName("td", players[1].childNodes[0].childNodes[0].childNodes[1]);
        assertTagName("td", players[1].childNodes[0].childNodes[0].childNodes[2]);

        assertTagName("td", players[2].childNodes[0].childNodes[0].childNodes[0]);
        assertTagName("td", players[2].childNodes[0].childNodes[0].childNodes[1]);
        assertTagName("td", players[2].childNodes[0].childNodes[0].childNodes[2]);


        assertEquals("playerColor", players[0].childNodes[0].childNodes[0].childNodes[0].className);
        assertEquals("playerColor", players[1].childNodes[0].childNodes[0].childNodes[0].className);
        assertEquals("playerColor", players[2].childNodes[0].childNodes[0].childNodes[0].className);

        assertEquals("playerName", players[0].childNodes[0].childNodes[0].childNodes[1].className);
        assertEquals("playerName", players[1].childNodes[0].childNodes[0].childNodes[1].className);
        assertEquals("playerName", players[2].childNodes[0].childNodes[0].childNodes[1].className);

        assertEquals("playerType", players[0].childNodes[0].childNodes[0].childNodes[2].className);
        assertEquals("playerType", players[1].childNodes[0].childNodes[0].childNodes[2].className);
        assertEquals("playerType", players[2].childNodes[0].childNodes[0].childNodes[2].className);

    },
    "test player Div should contain correct data in container": function() {
        /*:DOC += <div class = "content" id = "content"><div class = "lobbyWrapper" id = "lobbyWrapper"></div></div> */
        this.lobbyUi.createWrapper();
        this.lobbyUi.showLobby(this.lobby2);

        var playerWrapper = document.getElementById("playerWrapper");
        var players = playerWrapper.childNodes;


        assertEquals("", players[0].childNodes[0].childNodes[0].childNodes[0].innerHTML);
        assertEquals("", players[1].childNodes[0].childNodes[0].childNodes[0].innerHTML);
        assertEquals("", players[2].childNodes[0].childNodes[0].childNodes[0].innerHTML);

        assertEquals("rgb(34, 34, 34)", players[0].childNodes[0].childNodes[0].childNodes[0].style.backgroundColor);
        assertEquals("rgb(51, 51, 51)", players[1].childNodes[0].childNodes[0].childNodes[0].style.backgroundColor);
        assertEquals("rgb(255, 255, 255)", players[2].childNodes[0].childNodes[0].childNodes[0].style.backgroundColor);



        assertEquals("P3", players[0].childNodes[0].childNodes[0].childNodes[1].innerHTML);
        assertEquals("P4", players[1].childNodes[0].childNodes[0].childNodes[1].innerHTML);
        assertEquals("", players[2].childNodes[0].childNodes[0].childNodes[1].innerHTML);

        assertEquals("Human", players[0].childNodes[0].childNodes[0].childNodes[2].innerHTML);
        assertEquals("Bot", players[1].childNodes[0].childNodes[0].childNodes[2].innerHTML);
        assertEquals("Open Slot", players[2].childNodes[0].childNodes[0].childNodes[2].innerHTML);

    },
    // Tests for editable inputs

    "test lobbyUi should have function to make input elements editable": function() {
        assertFunction(this.lobbyUi.setPlayerEditable);
    },
    "test setPlayerEditable should throw Error if id is not a number": function() {
        /*:DOC += <div class = "content" id = "content"><div class = "lobbyWrapper" id = "lobbyWrapper"></div></div> */
        this.lobbyUi.createWrapper();
        this.lobbyUi.showLobby(this.lobby2);

        var ui = this.lobbyUi;

        assertException(function() {
            ui.setPlayerEditable("playerId3");
        }, "TypeError");
        assertNoException(function() {
            ui.setPlayerEditable(3);
        });
    },
    "test setPlayerEditable should throw Error if player with given Id is not there": function() {
        /*:DOC += <div class = "content" id = "content"><div class = "lobbyWrapper" id = "lobbyWrapper"></div></div> */
        this.lobbyUi.createWrapper();
        this.lobbyUi.showLobby(this.lobby2);

        var ui = this.lobbyUi;

        assertException(function() {
            ui.setPlayerEditable(1);
        }, "Error");
        assertNoException(function() {
            ui.setPlayerEditable(3);
        });
    },
    "test setPlayerEditable should change player name to editable and active": function() {
        /*:DOC += <div class = "content" id = "content"><div class = "lobbyWrapper" id = "lobbyWrapper"></div></div> */
        this.lobbyUi.createWrapper();
        this.lobbyUi.showLobby(this.lobby2);

        this.lobbyUi.setPlayerEditable(3);

        var playerDiv = document.getElementById("playerId3");
        var playerName = playerDiv.childNodes[0].childNodes[0].childNodes[1];

        assertEquals("true", playerName.contentEditable);
        assertEquals("", playerName.innerHTML);
    },
    "test setPlayerEditable should set onClick Event on colorBox": function() {
        /*:DOC += <div class = "content" id = "content"><div class = "lobbyWrapper" id = "lobbyWrapper"></div></div> */
        this.lobbyUi.createWrapper();
        this.lobbyUi.showLobby(this.lobby2);

        this.lobbyUi.setPlayerEditable(3);

        var playerDiv = document.getElementById("playerId3");
        var colorBox = playerDiv.childNodes[0].childNodes[0].childNodes[0];

        assertFunction(colorBox.onclick);
    },
    "test onclick Event in colorBox should change Color": function() {
        /*:DOC += <div class = "content" id = "content"><div class = "lobbyWrapper" id = "lobbyWrapper"></div></div> */
        this.lobbyUi.createWrapper();
        this.lobbyUi.showLobby(this.lobby2);

        this.lobbyUi.setPlayerEditable(3);

        var playerDiv = document.getElementById("playerId3");
        var colorBox = playerDiv.childNodes[0].childNodes[0].childNodes[0];
        var colorValue = colorBox.style.backgroundColor;

        colorBox.onclick();
        assertNotEquals(colorValue, colorBox.style.backgroundColor);

        colorValue = colorBox.style.backgroundColor;

        colorBox.onclick();
        assertNotEquals(colorValue, colorBox.style.backgroundColor);
    }


});

TestCase("SingleLobbyUiLeaderTest", {
    setUp: lobbyUiSetup,
    tearDown: lobbyUiTeardown,
    // Tests for single Lobby instance seen as Lobby Leader

    "test ui should have function to display a Lobby": function() {
        assertFunction(this.lobbyUi.showLeaderLobby);
    },
    "test showLobby should show a lobby with correct title name": function() {
        /*:DOC += <div class = "content" id = "content"><div class = "lobbyWrapper" id = "lobbyWrapper"></div></div> */
        this.lobbyUi.createWrapper();
        this.lobbyUi.showLeaderLobby(this.lobby1);

        var wrapper = document.getElementById("lobbyWrapper");
        var wrapperNodes = wrapper.childNodes[0].childNodes[0];

        var h1 = wrapperNodes.childNodes[1].childNodes[0];
        var h12 = wrapperNodes.childNodes[0].childNodes[0];

        assertTagName("h1", h1);
        assertEquals("lobbyTitle", h1.className);
        assertEquals("L1", h1.innerHTML);

        assertTagName("h1", h12);
        assertEquals("lobbyId", h12.className);
        assertEquals("#0", h12.innerHTML);
    },
    "test title name should be editable": function() {
        /*:DOC += <div class = "content" id = "content"><div class = "lobbyWrapper" id = "lobbyWrapper"></div></div> */
        this.lobbyUi.createWrapper();
        this.lobbyUi.showLeaderLobby(this.lobby1);

        var wrapper = document.getElementById("lobbyWrapper");
        var wrapperNodes = wrapper.childNodes[0].childNodes[0];

        var h1 = wrapperNodes.childNodes[1].childNodes[0];
        var h12 = wrapperNodes.childNodes[0].childNodes[0];

        assertEquals("true", h1.contentEditable);

    },
    "test player Div should contain correct container": function() {
        /*:DOC += <div class = "content" id = "content"><div class = "lobbyWrapper" id = "lobbyWrapper"></div></div> */
        this.lobbyUi.createWrapper();
        this.lobbyUi.showLeaderLobby(this.lobby2);

        var playerWrapper = document.getElementById("playerWrapper");
        var players = playerWrapper.childNodes;

        assertTagName("table", players[0].childNodes[0]);
        assertTagName("table", players[1].childNodes[0]);
        assertTagName("table", players[2].childNodes[0]);

        assertTagName("tr", players[0].childNodes[0].childNodes[0]);
        assertTagName("tr", players[1].childNodes[0].childNodes[0]);
        assertTagName("tr", players[2].childNodes[0].childNodes[0]);

        assertTagName("td", players[0].childNodes[0].childNodes[0].childNodes[0]);
        assertTagName("td", players[0].childNodes[0].childNodes[0].childNodes[1]);
        assertTagName("td", players[0].childNodes[0].childNodes[0].childNodes[2]);

        assertTagName("td", players[1].childNodes[0].childNodes[0].childNodes[0]);
        assertTagName("td", players[1].childNodes[0].childNodes[0].childNodes[1]);
        assertTagName("td", players[1].childNodes[0].childNodes[0].childNodes[2]);

        assertTagName("td", players[2].childNodes[0].childNodes[0].childNodes[0]);
        assertTagName("td", players[2].childNodes[0].childNodes[0].childNodes[1]);
        assertTagName("td", players[2].childNodes[0].childNodes[0].childNodes[2]);

        assertTagName("select", players[1].childNodes[0].childNodes[0].childNodes[2].childNodes[0]);
        assertTagName("select", players[2].childNodes[0].childNodes[0].childNodes[2].childNodes[0]);

        assertEquals("playerTypeSelect", players[1].childNodes[0].childNodes[0].childNodes[2].childNodes[0].className);
        assertEquals("playerTypeSelect", players[2].childNodes[0].childNodes[0].childNodes[2].childNodes[0].className);

        assertEquals("playerColor", players[0].childNodes[0].childNodes[0].childNodes[0].className);
        assertEquals("playerColor", players[1].childNodes[0].childNodes[0].childNodes[0].className);
        assertEquals("playerColor", players[2].childNodes[0].childNodes[0].childNodes[0].className);

        assertEquals("playerName", players[0].childNodes[0].childNodes[0].childNodes[1].className);
        assertEquals("playerName", players[1].childNodes[0].childNodes[0].childNodes[1].className);
        assertEquals("playerName", players[2].childNodes[0].childNodes[0].childNodes[1].className);

        assertEquals("playerType", players[0].childNodes[0].childNodes[0].childNodes[2].className);
        assertEquals("playerType", players[1].childNodes[0].childNodes[0].childNodes[2].className);
        assertEquals("playerType", players[2].childNodes[0].childNodes[0].childNodes[2].className);

    },
    "test player Div should contain correct data in container": function() {
        /*:DOC += <div class = "content" id = "content"><div class = "lobbyWrapper" id = "lobbyWrapper"></div></div> */
        this.lobbyUi.createWrapper();
        this.lobbyUi.showLeaderLobby(this.lobby3);

        var playerWrapper = document.getElementById("playerWrapper");
        var players = playerWrapper.childNodes;


        assertEquals("", players[0].childNodes[0].childNodes[0].childNodes[0].innerHTML);
        assertEquals("", players[1].childNodes[0].childNodes[0].childNodes[0].innerHTML);
        assertEquals("", players[2].childNodes[0].childNodes[0].childNodes[0].innerHTML);

        assertEquals("rgb(34, 34, 34)", players[0].childNodes[0].childNodes[0].childNodes[0].style.backgroundColor);
        assertEquals("rgb(51, 51, 51)", players[1].childNodes[0].childNodes[0].childNodes[0].style.backgroundColor);
        assertEquals("rgb(221, 221, 221)", players[2].childNodes[0].childNodes[0].childNodes[0].style.backgroundColor);
        assertEquals("rgb(255, 255, 255)", players[3].childNodes[0].childNodes[0].childNodes[0].style.backgroundColor);


        assertTagName("option", players[1].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0]);
        assertTagName("option", players[1].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[1]);

        assertTagName("option", players[2].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0]);
        assertTagName("option", players[2].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[1]);

        assertTagName("option", players[3].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0]);
        assertTagName("option", players[3].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[1]);
        assertTagName("option", players[3].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[2]);

        assertEquals("Open Slot", players[1].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0].innerHTML);
        assertEquals("Bot", players[1].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[1].innerHTML);

        assertEquals("Open Slot", players[2].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0].innerHTML);
        assertEquals("Bot", players[2].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[1].innerHTML);
        assertEquals("Human", players[2].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[2].innerHTML);

        assertEquals("Open Slot", players[3].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0].innerHTML);
        assertEquals("Bot", players[3].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[1].innerHTML);

        var value1 = players[1].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0].value;
        var value2 = players[2].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0].value;
        var value3 = players[3].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0].value;

        assertEquals("Bot", value1);
        assertEquals("Human", value2);
        assertEquals("Open Slot", value3);


        assertEquals("P4", players[1].childNodes[0].childNodes[0].childNodes[1].innerHTML);
        assertEquals("", players[2].childNodes[0].childNodes[0].childNodes[1].innerHTML);

        assertEquals("Human", players[0].childNodes[0].childNodes[0].childNodes[2].innerHTML);
        assertEquals("Bot", players[1].childNodes[0].childNodes[0].childNodes[2].innerHTML);
        assertEquals("Open Slot", players[2].childNodes[0].childNodes[0].childNodes[2].innerHTML);

    },
    "test ui should have a button to start the game": function() {
        /*:DOC += <div class = "content" id = "content"><div class = "lobbyWrapper" id = "lobbyWrapper"></div></div> */
        this.lobbyUi.createWrapper();
        this.lobbyUi.showLeaderLobby(this.lobby3);

        var wrapper = document.getElementById("lobbyWrapper");
        assertTagName("div", wrapper.childNodes[wrapper.childNodes.length - 1]);
        assertEquals("lobbyStartButton", wrapper.childNodes[wrapper.childNodes.length - 1].className);
        assertEquals("Start", wrapper.childNodes[wrapper.childNodes.length - 1].innerHTML);
    },
    "test ui should have a max Players select input": function() {
        /*:DOC += <div class = "content" id = "content"><div class = "lobbyWrapper" id = "lobbyWrapper"></div></div> */
        this.lobbyUi.createWrapper();
        this.lobbyUi.showLeaderLobby(this.lobby3);

        var wrapper = document.getElementById("lobbyWrapper");
        var table = wrapper.childNodes[0];
        var tr = table.childNodes[0];
        var td1 = tr.childNodes[2];
        var td2 = tr.childNodes[3];

        var maxPlayersSpan = td1.childNodes[0];
        var maxPlayersSelect = td2.childNodes[0];

        assertTagName("span", maxPlayersSpan);
        assertTagName("select", maxPlayersSelect);

        assertEquals("Max Players", maxPlayersSpan.innerHTML);
        assertEquals(3, maxPlayersSelect.childNodes.length);

        assertTagName("option", maxPlayersSelect.childNodes[0]);
        assertTagName("option", maxPlayersSelect.childNodes[1]);
        assertTagName("option", maxPlayersSelect.childNodes[2]);

        assertEquals("2", maxPlayersSelect.childNodes[0].innerHTML);
        assertEquals("3", maxPlayersSelect.childNodes[1].innerHTML);
        assertEquals("4", maxPlayersSelect.childNodes[2].innerHTML);

        assertEquals("lobbyMaxPlayersSpan", maxPlayersSpan.className);
        assertEquals("lobbyMaxPlayersSelect", maxPlayersSelect.className);
    }
});

TestCase("LobbyUiEventTest", {
    setUp: lobbyUiSetup,
    tearDown: lobbyUiTeardown,
    "test ui should have function submitPlayerName": function() {
        assertFunction(this.lobbyUi.submitPlayerName);
    },
    "test submitPlayerName should call correct request in controller": function() {
        var spy = this.sandbox.spy(this.lobbyRequestController, "updatePlayerName");
        sinon.assert.notCalled(spy);

        this.lobbyUi.submitPlayerName(3, "NewName");
        sinon.assert.calledOnce(spy);
        sinon.assert.calledWith(spy, 1, 3, "NewName");
    },
    "test ui should have function submitPlayerColor": function() {
        assertFunction(this.lobbyUi.submitPlayerColor);
    },
    "test submitPlayerColor should call correct request in controller": function() {
        var spy = this.sandbox.spy(this.lobbyRequestController, "updatePlayerColor");
        sinon.assert.notCalled(spy);

        this.lobbyUi.submitPlayerColor(3, "#ffffff");
        sinon.assert.calledOnce(spy);
        sinon.assert.calledWith(spy, 1, 3, "#ffffff");
    },
    "test ui should have function submitLobbyName": function() {
        assertFunction(this.lobbyUi.submitLobbyName);
    },
    "test submitLobbyName should call correct request in controller": function() {
        var spy = this.sandbox.spy(this.lobbyRequestController, "updateLobbyName");
        sinon.assert.notCalled(spy);

        this.lobbyUi.submitLobbyName("NewName");
        sinon.assert.calledOnce(spy);
        sinon.assert.calledWith(spy, 1, "NewName");
    },
    "test ui should have function submitMaxPlayers": function() {
        assertFunction(this.lobbyUi.submitMaxPlayers);
    },
    "test submitMaxPlayers should call correct request in controller": function() {
        var spy = this.sandbox.spy(this.lobbyRequestController, "updateMaxPlayers");
        sinon.assert.notCalled(spy);

        this.lobbyUi.submitMaxPlayers(3);
        sinon.assert.calledOnce(spy);
        sinon.assert.calledWith(spy, 1, 3);
    },
    "test ui should have function submitPlayerType": function() {
        assertFunction(this.lobbyUi.submitPlayerType);
    },
    "test ui should have function submitLobbyStart": function() {
        assertFunction(this.lobbyUi.submitLobbyStart);
    },
    "test submitLobbyStart should call correct request in controller": function() {
        var spy = this.sandbox.spy(this.lobbyRequestController, "startGame");
        sinon.assert.notCalled(spy);

        this.lobbyUi.submitLobbyStart();
        sinon.assert.calledOnce(spy);
        sinon.assert.calledWith(spy, 1);
    },
    "test submitLobbyStart should not call request in controller if player count is less than 2": function() {
        this.lobby3.kickPlayer(this.player4);
        this.lobby3.kickPlayer(this.player5);

        var alertStub = this.sandbox.stub(window, "alert");

        var spy = this.sandbox.spy(this.lobbyRequestController, "startGame");
        sinon.assert.notCalled(spy);

        this.lobbyUi.submitLobbyStart();
        sinon.assert.notCalled(spy);
    },
    "test submitLobbyStart should call alert if player count is less than 2": function() {
        this.lobby3.kickPlayer(this.player4);
        this.lobby3.kickPlayer(this.player5);

        var spy = this.sandbox.stub(window, "alert");
        sinon.assert.notCalled(spy);

        this.lobbyUi.submitLobbyStart();
        sinon.assert.calledOnce(spy);
        sinon.assert.calledWith(spy, "Player count must be greater than 2");
    }

});



TestCase("SingleLobbyUiEventTest", {
    setUp: function(){
    this.lobbyRequestController = new tddjs.client.controller.lobbyRequestController();
    this.lobbyUi = new tddjs.client.ui.lobbyUi(this.lobbyRequestController);
    this.lobbyRequestController.setLobbyUi(this.lobbyUi);

    this.lobby3 = new tddjs.client.model.lobby();

    this.player3 = new tddjs.client.player();
    this.player4 = new tddjs.client.player();
    this.player5 = new tddjs.client.player();

    this.player3.setId(3);
    this.player4.setId(4);
    this.player5.setId(5);

    this.player3.setName("P3");
    this.player4.setName("P4");
    this.player5.setName("P5");

    this.player3.setColor("#222222");
    this.player4.setColor("#333333");
    this.player5.setColor("#dddddd");

    this.player4.setType("bot");

    this.lobby3.setId(1);

    this.lobby3.setName("L2");

    this.lobby3.addPlayer(this.player3);
    this.lobby3.addPlayer(this.player4);
    this.lobby3.addPlayer(this.player5);

    this.lobby3.setLeader(this.player3);
    this.lobby3.setMaxPlayers(4);

    this.lobbyUi.setCurrentLobby(this.lobby3);

    this.sandbox = sinon.sandbox.create();

    this.lobbyUi.createLobbyContent();
    this.lobbyUi.createWrapper();
    this.lobbyUi.showLobby(this.lobby3);
    },
    tearDown: function(){
        delete this.lobbyUi;
        delete this.lobby3;

    this.sandbox.restore();
    },
    
    "test lobbyUi should have function to update color on event": function() {
        assertFunction(this.lobbyUi.updateColor);
    },
    
    "test updateColor should throw Error if playerId is no number": function() {
        var ui = this.lobbyUi;
        
        assertException(function() { ui.updateColor("a", "#ffffff"); }, "TypeError");
        assertNoException(function() { ui.updateColor(3, "#ffffff"); });
    },
    
    "test updateColor should throw Error if color is no string": function() {
        var ui = this.lobbyUi;
        
        assertException(function() { ui.updateColor(3, 5); }, "TypeError");
        assertNoException(function() { ui.updateColor(3, "#ffffff"); });
    },
    
    "test updateColor should throw Error if no ColorBox with given Id exists": function() {
        var ui = this.lobbyUi;
        
        assertException(function() { ui.updateColor(1, "#ffffff"); }, "Error");
        assertNoException(function() { ui.updateColor(3, "#ffffff"); });
    },
    
    "test updateColor should change the color correct": function() {
         var ui = this.lobbyUi;
        
        var colorBox = ui.getPlayerColorBoxById(3);
        ui.updateColor(3, "#000000");
        
        assertEquals("rgb(0, 0, 0)", colorBox.style.backgroundColor);
        
        ui.updateColor(3, "#ffffff");
        
        assertEquals("rgb(255, 255, 255)", colorBox.style.backgroundColor);
        
        colorBox = ui.getPlayerColorBoxById(5);
        
        ui.updateColor(5, "#000000");
        
        assertEquals("rgb(0, 0, 0)", colorBox.style.backgroundColor);
        
        ui.updateColor(5, "#ffffff");
        
        assertEquals("rgb(255, 255, 255)", colorBox.style.backgroundColor);
        
    },
    
   "test lobbyUi should have function to update lobby on event": function() {
        assertFunction(this.lobbyUi.updateLobby);
    },
    
    "test updateLobby should throw Error if Lobby is no Lobby": function() {
        var ui = this.lobbyUi;
        var lobby = this.lobby3;
        
        assertException(function() { ui.updateLobby("a"); }, "TypeError");
        assertNoException(function() { ui.updateLobby(lobby); });
    }
 
});