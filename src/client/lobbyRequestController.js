/* 
 *  Source-Code for Lobby Request Controller
 *  
 *  This class handles data exchange with the server for the lobby system
 */

tddjs.namespace("client.controller").lobbyRequestController= lobbyRequestController;
       
function lobbyRequestController()
{   
    var ajax = tddjs.util.ajax;
    var _lobbyUi = new tddjs.client.ui.lobbyUi();
    
    function requestAllLobbies()
    {
        var options = {
          headers: {
            "Accept": "application/json"  
          },  
            
          onSuccess: this.onAllLobbiesSuccess,
          onFailure: this.onAllLobbiesFailure
        };
        
        ajax.get(BASE_URL + "lobbies", options);
    }
    
    function requestNewLobby()
    {
        var data = {
            type: "create",
            lobby: null
        };
        
        data = JSON.stringify(data);
        
        var options = {
          headers: {
            "Content-Type": "application/json"  
          },
          
          data: data
        };
        
        ajax.post(BASE_URL + "lobbies", options);
    }
    
    function onAllLobbiesSuccess(xhr)
    {
        var data = xhr.responseText;
        data = JSON.parse(data);
        
        for(var i = 0;i < data.length;++i)
        {
            _lobbyUi.addLobby(data[i]);
        }
    }
    
    function onAllLobbiesFailure()
    {
        
    }
    
    this.requestAllLobbies = requestAllLobbies;
    this.onAllLobbiesSuccess = onAllLobbiesSuccess;
    this.onAllLobbiesFailure = onAllLobbiesFailure;
    this.requestNewLobby = requestNewLobby;
};