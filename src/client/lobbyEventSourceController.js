/* 
 *  Source-Code for LobbyEventSourceController
 *  
 *   This class handles data exchange with the server via EventSource
 */

tddjs.namespace("client.controller").lobbyEventSourceController = lobbyEventSourceController;

function lobbyEventSourceController()
{
    var _lobby;
    var _lobbyUi;
    var _eventSource;

    function establishConnection()
    {
        if(! (_lobby instanceof tddjs.client.model.lobby))
            throw new Error("Lobby must be setted before doing a request");
        
        _eventSource = new EventSource(BASE_URL + "lobbies/" + _lobby.getId());
       
        this.addEventListeners();
    }
    
    function addEventListeners()
    {
        _eventSource.addEventListener("colorchange", oncolorchange);
    }

    function setLobby(aLobby)
    {
        if (!(aLobby instanceof tddjs.client.model.lobby))
            throw new TypeError("Lobby must be of Type Lobby");

        _lobby = aLobby;
    }

    function getLobby()
    {
        return _lobby;
    }

    function setLobbyUi(aLobbyUi)
    {
        if (!(aLobbyUi instanceof tddjs.client.ui.lobbyUi))
            throw new TypeError("LobbyUi must be of Type LobbyUi");

        _lobbyUi = aLobbyUi;
    }



    function oncolorchange()
    {

    }

    this.addEventListeners = addEventListeners;
    this.establishConnection = establishConnection;
    this.setLobby = setLobby;
    this.getLobby = getLobby;
    this.setLobbyUi = setLobbyUi;
    
    Object.defineProperty(this, 'eventSource', {
        get: function () {
            return _eventSource;
        }
    });

}
