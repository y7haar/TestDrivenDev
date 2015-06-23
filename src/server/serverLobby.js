/* 
 *  Source-Code for Lobby
 */

tddjs.namespace("server.model").lobby = lobby;

function lobby()
{
    var _players = [];
    var _maxPlayers = 4;
    var _id = 0;
    var _isIdSet = false;
    var _name = "GameLobby";
    var _leader;
    var _currentPlayerId = 0;
    var _usedTokens = {};


    function setId(aId)
    {
        if (isNaN(aId))
            throw new TypeError("Parameter is not a number");

        if (_isIdSet)
            throw new Error("Id was already set, it is not allowed to change the id when setted once before");

        _id = aId;
        _isIdSet = true;
    }

    function getId()
    {
        return _id;
    }

    function addPlayer(aPlayer)
    {
        if (typeof aPlayer.getId() === "undefined")
            aPlayer.setId(_currentPlayerId++);

        if (_players.length < _maxPlayers)
            _players.push(aPlayer);
    }

    function getPlayers()
    {
        return _players;
    }
    
    function getPlayerById(id)
    {
        for(var i = 0;i < _players.length;++i)
        {
            if(_players[i].getId() === id)
                return _players[i];
        }
        return null;
    }
    /*
     *  Sets max player count and kicks players, if current player count > maximum
     */
    function setMaxPlayers(aMaxPlayers)
    {
        _maxPlayers = aMaxPlayers;

        while (_players.length > aMaxPlayers)
        {
            _players.pop();
        }
    }

    function _getMaxPlayers()
    {
        return _maxPlayers;
    }

    function kickPlayer(aPlayer)
    {
        var index = _players.indexOf(aPlayer);

        if (index >= 0)
            _players.splice(index, 1);

        if (_leader === aPlayer && _players.length > 0)
        {
            _leader = _players[0];
        }

        if (_leader === aPlayer && _players.length === 0)
        {
            _leader = null;
        }
    }

    function setName(aName)
    {
        if (typeof (aName) !== "string")
            throw new TypeError("Parameter is not a string");

        _name = aName;
    }

    function getName()
    {
        return _name;
    }

    function _hasPlayer(aPlayer)
    {
        if (_players.indexOf(aPlayer) < 0)
            return false;

        return true;
    }

    function setLeader(aLeader)
    {
        if (!_hasPlayer(aLeader))
            throw new Error("Leader is not stored in Lobby");

        _leader = aLeader;
    }

    function getLeader()
    {
        return _leader;
    }

    
    function serialize()
    {
        var json = JSON.stringify(serializeAsObject());
        return json;
    }

    function serializeAsObject()
    {   
        var id = getId();
        var name = getName();
        var maxPlayers = _getMaxPlayers();
        var leader = getLeader().getId();

        var playersObj = [];
        var players = getPlayers();

        for (var i = 0; i < players.length; ++i)
        {
            var player = players[i].serializeAsObject();

            playersObj[i] = player;
        }

        var lobbyObj = {
            id: id,
            name: name,
            maxPlayers: maxPlayers,
            leader: leader,
            players: playersObj
        };

        return lobbyObj;
    }
    
    function getPlayerByToken(aToken)
    {
        if(typeof aToken !== "string")
            throw new TypeError("Token must be a string");
        
        for(var i = 0;i < _players.length;++i)
        {
            if(_players[i].getToken() === aToken)
                return _players[i];
        }
        
        return null;
    }
    
    function isPlayerTokenValid(aPlayer, aToken)
    {
        return (aPlayer.getToken() === aToken);
    }
    
    function isLeaderTokenValid(aPlayer, aToken)
    {
        return (this.isPlayerTokenValid(aPlayer, aToken) && aPlayer === _leader);
    }
    
    function getUniqueToken()
    {
        var token = parseInt(Math.random() * 1000000000);
        
        if(_usedTokens[token] === true)
        {
            this.getUniqueToken();
        }
        
        _usedTokens[token] = true;
        return token;
    }

    this.addPlayer = addPlayer;
    this.getPlayers = getPlayers;
    this.setMaxPlayers = setMaxPlayers;
    this.getMaxPlayers = _getMaxPlayers;
    this.kickPlayer = kickPlayer;

    this.getId = getId;
    this.setId = setId;
    
    this.getPlayerByToken = getPlayerByToken;
    this.isPlayerTokenValid = isPlayerTokenValid;
    this.isLeaderTokenValid = isLeaderTokenValid;
    this.getUniqueToken = getUniqueToken;
    
    this.getPlayerById = getPlayerById;
    
    this.setName = setName;
    this.getName = getName;

    this.setLeader = setLeader;
    this.getLeader = getLeader;

    this.serialize = serialize;
    this.serializeAsObject = serializeAsObject;
}

