/* 
 *  Source-Code for Lobby Request Controller
 *  
 *  This class handles data exchange with the server for the lobby system
 */

tddjs.namespace("client.controller").lobbyRequestController = lobbyRequestController;

function lobbyRequestController()
{
    var ajax = tddjs.util.ajax;
    var _lobbyUi = new tddjs.client.ui.lobbyUi(this);
    var _lobbyEventSourceController = new tddjs.client.controller.lobbyEventSourceController();

    function setLobbyUi(aUi)
    {
        _lobbyUi = aUi;
    }
    
    function getLobbyEventSourceController()
    {
        return _lobbyEventSourceController;
    }

    function requestAllLobbies()
    {
        var options = {
            headers: {
                "Accept": "application/json"           },
            onSuccess: this.onAllLobbiesSuccess,
            onFailure: this.onAllLobbiesFailure
        };

        ajax.get(BASE_URL + "lobbies", options);
    }

    function requestNewLobby(aPlayer)
    {
        var data = {
            type: "create",
            lobby: null,
            player: aPlayer.serializeAsObject()
        };

        data = JSON.stringify(data);

        var options = {
            headers: {
                "Content-Type": "application/json"
            },
            data: data,
            
            onSuccess: this.onNewLobbySuccess
        };

        ajax.post(BASE_URL + "lobbies", options);
    }

    function onAllLobbiesSuccess(xhr)
    {        
        var data = xhr.responseText;
        data = JSON.parse(data);

        _lobbyUi.clearLobbies();

        for (var i = 0; i < data.length; ++i)
        {
            _lobbyUi.addLobby(data[i]);
        }

        _lobbyUi.addNewLobbyButton();
    }

    function onAllLobbiesFailure(xhr)
    {
        _lobbyUi.showErrorMessage();
    }

    function requestJoin(aLobbyId, aPlayer)
    {
        if (typeof aLobbyId !== "number")
            throw new TypeError("lobbyId must be a number");

        if (!(aPlayer instanceof tddjs.client.player))
            throw new TypeError("player must be from class player");

        var player = aPlayer.serializeAsObject();

        var data = {
            type: "join",
            player: player
        };

        data = JSON.stringify(data);

        var options = {
            headers: {
                "Content-Type": "application/json"
            },
            onSuccess: this.onJoinSuccess,
            onFailure: this.onJoinFailure,
            data: data
        };

        ajax.post(BASE_URL + "lobbies/" + aLobbyId, options);
    }

    function onJoinSuccess(xhr)
    {
        _showLobby(xhr);
    }
    
    function _showLobby(xhr)
    {
        var data = JSON.parse(xhr.responseText);
        
        var lobby = new tddjs.client.model.lobby();
        lobby.deserializeObject(data.lobby);
        
        var playerId = data.currentPlayerId;
        
        for(var i = 0;i < lobby.getPlayers().length;++i)
        {     
            if(lobby.getPlayers()[i].getId() === playerId)
            {
                _lobbyUi.setCurrentPlayer(lobby.getPlayers()[i]);
                _lobbyEventSourceController.setLobby(lobby);
                _lobbyEventSourceController.establishConnection();
                break;
            }
        }
        
        _lobbyUi.setCurrentLobby(lobby);
        _lobbyUi.showLobbyForPlayer();
    }

    function onJoinFailure(xhr)
    {
    }
    
    function onNewLobbySuccess(xhr)
    {
        _showLobby(xhr);
    }



    function updateLobbyName(aId, aName)
    {
        if (typeof aId !== "number")
            throw new TypeError("Id must be number");

        if (typeof aName !== "string")
            throw new TypeError("Name must be string");

        var data = {
            type: "lobbyUpdate",
            data: {
                name: aName
            }
        };

        data = JSON.stringify(data);

        var options = {
            headers: {
                "Content-Type": "application/json"
            },
            data: data
        };

        ajax.post(BASE_URL + "lobbies/" + aId, options);
    }

    function updateMaxPlayers(aId, aMaxPlayers)
    {
        if (typeof aId !== "number")
            throw new TypeError("Id must be number");

        if (typeof aMaxPlayers !== "number")
            throw new TypeError("Max Players must be number");

        var data = {
            type: "lobbyUpdate",
            data: {
                maxPlayers: aMaxPlayers
            }
        };

        data = JSON.stringify(data);

        var options = {
            headers: {
                "Content-Type": "application/json"
            },
            data: data
        };

        ajax.post(BASE_URL + "lobbies/" + aId, options);
    }

    function updatePlayerName(aLobbyId, aId, aName)
    {
        if (typeof aLobbyId !== "number")
            throw new TypeError("Id must be number");

        if (typeof aId !== "number")
            throw new TypeError("Id must be number");

        if (typeof aName !== "string")
            throw new TypeError("Name must be string");

        var data = {
            type: "playerUpdate",
            data: {
                id: aId,
                name: aName
            }
        };

        data = JSON.stringify(data);

        var options = {
            headers: {
                "Content-Type": "application/json"
            },
            data: data
        };

        ajax.post(BASE_URL + "lobbies/" + aLobbyId, options);
    }

    function updatePlayerColor(aLobbyId, aId, aColor)
    {
        if (typeof aLobbyId !== "number")
            throw new TypeError("Id must be number");

        if (typeof aId !== "number")
            throw new TypeError("Id must be number");

        if (typeof aColor !== "string")
            throw new TypeError("Color must be string");

        var data = {
            type: "playerUpdate",
            data: {
                id: aId,
                color: aColor
            }
        };

        data = JSON.stringify(data);

        var options = {
            headers: {
                "Content-Type": "application/json"
            },
            data: data
        };

        ajax.post(BASE_URL + "lobbies/" + aLobbyId, options);
    }

    function addBot(aLobbyId)
    {
        if (typeof aLobbyId !== "number")
            throw new TypeError("Id must be number");

        var data = {
            type: "botJoin"
        };

        data = JSON.stringify(data);

        var options = {
            headers: {
                "Content-Type": "application/json"
            },
            data: data
        };

        ajax.post(BASE_URL + "lobbies/" + aLobbyId, options);
    }

    function kickBot(aLobbyId, aId, callback)
    {
        if (typeof aLobbyId !== "number")
            throw new TypeError("Id must be number");

        if (typeof aId !== "number")
            throw new TypeError("Id must be number");

        var data = {
            type: "playerKick",
            data: {
                id: aId
            }
        };

        data = JSON.stringify(data);

        var options = {
            headers: {
                "Content-Type": "application/json"
            },
            data: data,
            
            onSuccess: callback
        };

        ajax.post(BASE_URL + "lobbies/" + aLobbyId, options);
    }

    function kickPlayer(aLobbyId, aId, callback)
    {
        if (typeof aLobbyId !== "number")
            throw new TypeError("Id must be number");

        if (typeof aId !== "number")
            throw new TypeError("Id must be number");

        var data = {
            type: "playerKick",
            data: {
                id: aId
            }
        };

        data = JSON.stringify(data);

        var options = {
            headers: {
                "Content-Type": "application/json"
            },
            data: data,
            
            onSuccess: callback
        };

        ajax.post(BASE_URL + "lobbies/" + aLobbyId, options);
    }

    function startGame(aLobbyId)
    {
        if (typeof aLobbyId !== "number")
            throw new TypeError("Id must be number");
        
        var id = aLobbyId;       
        
        var data = {
            type: "gameStart"
        };

        data = JSON.stringify(data);

        var options = {
            headers: {
                "Content-Type": "application/json"
            },
            data: data
        };

        ajax.post(BASE_URL + "lobbies/" + aLobbyId, options);
    }
    
    function triggerGameStart(aId)
    {
        if (typeof aId !== "number")
            throw new TypeError("Id must be number");

        window.location.href = BASE_URL + "game/" + aId;
    }

    this.setLobbyUi = setLobbyUi;
    this.getLobbyEventSourceController = getLobbyEventSourceController;

    this.requestAllLobbies = requestAllLobbies;
    this.onAllLobbiesSuccess = onAllLobbiesSuccess;
    this.onAllLobbiesFailure = onAllLobbiesFailure;
    this.requestNewLobby = requestNewLobby;
    this.requestJoin = requestJoin;
    this.onJoinSuccess = onJoinSuccess;
    this.onJoinFailure = onJoinFailure;
    
    this.onNewLobbySuccess = onNewLobbySuccess;

    // Update
    this.updateLobbyName = updateLobbyName;
    this.updatePlayerName = updatePlayerName;
    this.updatePlayerColor = updatePlayerColor;
    this.updateMaxPlayers = updateMaxPlayers;
    this.addBot = addBot;
    this.kickBot = kickBot;
    this.kickPlayer = kickPlayer;
    this.startGame = startGame;
    this.triggerGameStart = triggerGameStart;
}