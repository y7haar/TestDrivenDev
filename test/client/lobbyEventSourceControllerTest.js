/* 
 *  Testcases for LobbyEventSourceController
 *  
 *  This class handles data exchange with the Server via Event Source
 *  
 */

TestCase("LobbyEventSourceControllerTest", {
    setUp: function() {
        this.lobby = new tddjs.client.model.lobby();
        this.lobby.setId(1);
        this.lobby.setName("L1");
        this.lobby.setMaxPlayers(4);
        
        this.lobby2 = new tddjs.client.model.lobby();
        this.lobby2.setId(2);
        this.lobby2.setName("L2");
        this.lobby2.setMaxPlayers(4);

        this.url = BASE_URL + "lobbies/" + this.lobby.getId();
        this.url2 = BASE_URL + "lobbies/" + this.lobby2.getId();
        
        this.lobbyEventSourceController = new tddjs.client.controller.lobbyEventSourceController();
        this.sandbox = new tddjs.stubs.eventSourceSandbox();
        this.sinonSandbox = sinon.sandbox.create();
        
        this.sandbox.addServer(this.url);
        this.sandbox.addServer(this.url2);

    },
    tearDown: function(){
        this.sandbox.restore();
        this.sinonSandbox.restore();
    },
    
    "test LobbyEventSourceController should not be undefined after constructor call": function() {
        assertObject(this.lobbyEventSourceController);
    },
    
    "test LobbyEventSourceController should have function to establish an EventSource connection": function() {
        assertFunction(this.lobbyEventSourceController.establishConnection);
    },
    
    "test LobbyEventSourceController should have function to set a lobby": function() {
        assertFunction(this.lobbyEventSourceController.setLobby);
    },
    
     "test LobbyEventSourceController should have function to get a lobby": function() {
        assertFunction(this.lobbyEventSourceController.getLobby);
    },
    
    "test setter and getter for lobby should set and get lobby": function() {
        assertUndefined(this.lobbyEventSourceController.getLobby());
        this.lobbyEventSourceController.setLobby(this.lobby);
        assertSame(this.lobby, this.lobbyEventSourceController.getLobby());
    },
    
    "test setter for lobby should throw Error if parameter is no lobby": function() {
        var controller = this.lobbyEventSourceController;
        var lobby = this.lobby;
        
        assertNoException(function() { controller.setLobby(lobby); });
        assertException(function() { controller.setLobby("5"); }, "TypeError");
    },
    
    "test LobbyEventSourceController should have function to set a lobbyUi": function() {
        assertFunction(this.lobbyEventSourceController.setLobbyUi);
    },
    
     "test setter for lobbyUi should throw Error if parameter is no lobbyUi": function() {
        var controller = this.lobbyEventSourceController;
        var lobbyUi = new tddjs.client.ui.lobbyUi();
        
        assertNoException(function() { controller.setLobbyUi(lobbyUi); });
        assertException(function() { controller.setLobbyUi("6"); }, "TypeError");
    },
    
     "test LobbyEventSourceController should have function to get a lobbyUi": function() {
        assertFunction(this.lobbyEventSourceController.getLobbyUi);
    },
    
     "test setter and getter for lobbyUi should set and get lobbyUi": function() {
        var ui = new tddjs.client.ui.lobbyUi();
         
        assertUndefined(this.lobbyEventSourceController.getLobbyUi());
        this.lobbyEventSourceController.setLobbyUi(ui);
        assertSame(ui, this.lobbyEventSourceController.getLobbyUi());
    },
    
    "test establishConnection should do an EventSource request": function() {
        this.lobbyEventSourceController.setLobby(this.lobby);
        
        assertEquals(0, this.sandbox.server[this.url].clients.length);
        assertUndefined(this.lobbyEventSourceController.eventSource);
        this.lobbyEventSourceController.establishConnection();
        assertNotUndefined(this.lobbyEventSourceController.eventSource);
        assertEquals(1, this.sandbox.server[this.url].clients.length);
    },
    
    "test establishConnection should do a request to the correct URI": function() {
        this.lobbyEventSourceController.setLobby(this.lobby);
        this.lobbyEventSourceController.establishConnection();
        
        assertEquals(1, this.sandbox.server[this.url].clients.length);
        
        
        this.lobbyEventSourceController.setLobby(this.lobby2);
        this.lobbyEventSourceController.establishConnection();
        
        assertEquals(1, this.sandbox.server[this.url2].clients.length);
    },
    
    "test controller should have function to add Events to EventSource": function() {
        assertFunction(this.lobbyEventSourceController.addEventListeners);
    },
    
    "test establishConnection should call addEventListeners": function() {
        this.lobbyEventSourceController.setLobby(this.lobby);
        
        var spy = this.sinonSandbox.spy(this.lobbyEventSourceController, "addEventListeners");
        sinon.assert.notCalled(spy);
        
        this.lobbyEventSourceController.establishConnection();
        
        sinon.assert.calledOnce(spy);
    },
    
     "test addEventListeners should add oncolorchange event": function() {
       assertUndefined(this.lobbyEventSourceController.eventSource);
       this.lobbyEventSourceController.setLobby(this.lobby);
       
       this.lobbyEventSourceController.establishConnection();
       
       assertNotUndefined(this.lobbyEventSourceController.eventSource.oncolorchange);
       assertFunction(this.lobbyEventSourceController.eventSource.oncolorchange);
    },
    
    "test addEventListeners should add onlobbychange event": function() {
       assertUndefined(this.lobbyEventSourceController.eventSource);
       this.lobbyEventSourceController.setLobby(this.lobby);
       
       this.lobbyEventSourceController.establishConnection();
       
       assertNotUndefined(this.lobbyEventSourceController.eventSource.onlobbychange);
       assertFunction(this.lobbyEventSourceController.eventSource.onlobbychange);
    },
    
    "test establishConnection should throw Error if no lobby is setted": function() {
        var controller = this.lobbyEventSourceController;
        var lobby = this.lobby;
        
        assertException(function() { controller.establishConnection(); }, "Error");
        
        controller.setLobby(lobby);
        assertNoException(function() { controller.establishConnection(); });
    }
    });
    
    
    TestCase("LobbyEventSourceControllerEventTest", {
    setUp: function() {
        this.sandbox = new tddjs.stubs.eventSourceSandbox();
        this.sinonSandbox = sinon.sandbox.create();
        
        
        
        this.lobby = new tddjs.client.model.lobby();
        this.lobby.setId(1);
        this.lobby.setName("L1");
        this.lobby.setMaxPlayers(4);
        
        this.player1 = new tddjs.client.player();
        this.player1.setId(1);
        this.player1.setName("Peter");
        this.player1.setColor("#ffffff");
        
        this.lobby.addPlayer(this.player1);
        this.lobby.setLeader(this.player1);
        
        this.ui = new tddjs.client.ui.lobbyUi();
        this.ui.createLobbyContent();
        this.ui.createWrapper();
        this.ui.showLobby(this.lobby);
        
        this.url = BASE_URL + "lobbies/" + this.lobby.getId();
        
        this.sandbox.addServer(this.url);
        
        this.lobbyEventSourceController = new tddjs.client.controller.lobbyEventSourceController();
        this.lobbyEventSourceController.setLobbyUi(this.ui);
        this.lobbyEventSourceController.setLobby(this.lobby);
        this.lobbyEventSourceController.establishConnection();
    },
    tearDown: function(){
        this.sandbox.restore();
        this.sinonSandbox.restore();
    },
    
    "test oncolorchange event should call updateColor in lobby Ui": function() {
        var spy = this.sinonSandbox.stub(this.ui, "updateColor");
        
        var data = { color:"#321123", id: 3};
        data = JSON.stringify(data);
        
        sinon.assert.notCalled(spy);
        this.sandbox.server[this.url].sendMessage(0, "colorchange", {data:data});
        
        sinon.assert.calledOnce(spy);
    },
    
     "test oncolorchange event should call updateColor in lobby Ui with correct parameters": function() {
        var data = { color:"#123123", id: 1};
        data = JSON.stringify(data);
        
         var spy = this.sinonSandbox.stub(this.ui, "updateColor");
        
        sinon.assert.notCalled(spy);
        this.sandbox.server[this.url].sendMessage(0, "colorchange", {data:data});
        
        sinon.assert.calledOnce(spy);
        sinon.assert.calledWith(spy, 1, "#123123");
        
        
        var data = { color:"#321123", id: 4};
        data = JSON.stringify(data);
        
        this.sandbox.server[this.url].sendMessage(0, "colorchange", {data:data});
        
        sinon.assert.calledTwice(spy);
        sinon.assert.calledWith(spy, 4, "#321123");
    },
    
    "test onlobbychange event should call updateLobby in lobby Ui": function() {
        var spy = this.sinonSandbox.stub(this.ui, "updateLobby");
        
        sinon.assert.notCalled(spy);
        this.sandbox.server[this.url].sendMessage(0, "lobbychange", {data:""});
        
        sinon.assert.calledOnce(spy);
    },
    
    "test onlobbychange event should call updateLobby in lobby Ui with correct parameters": function() {
        var data = this.lobby.serialize();
        var spy = this.sinonSandbox.stub(this.ui, "updateLobby");
        
        sinon.assert.notCalled(spy);
        this.sandbox.server[this.url].sendMessage(0, "lobbychange", {data:data});
        
        sinon.assert.calledOnce(spy);
        sinon.assert.calledWith(spy, data);
    }

    });