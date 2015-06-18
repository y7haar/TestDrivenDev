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
        _eventSource = new EventSource(BASE_URL + "lobbies/1");
    }
    
    function setLobby(aLobby)
    {
        if(! (aLobby instanceof tddjs.client.model.lobby))
            throw new TypeError("Lobby must be of Type Lobby");
        
        _lobby = aLobby;
    }
    
    function getLobby()
    {
        return _lobby;
    }
    
    function setLobbyUi(aLobbyUi)
    {
         if(! (aLobbyUi instanceof tddjs.client.ui.lobbyUi))
            throw new TypeError("LobbyUi must be of Type LobbyUi");
        
        _lobbyUi = aLobbyUi;
    }
    
    this.establishConnection= establishConnection;
    this.setLobby = setLobby;
    this.getLobby = getLobby;
    this.setLobbyUi = setLobbyUi;
    
}
