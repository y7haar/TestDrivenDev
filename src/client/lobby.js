/* 
 *  Source-Code for Lobby on Client
 */

tddjs.namespace("client.model").lobby =  lobby;

function lobby()
{
    var _players = [];
    var _maxPlayers = 4;
    var _id = 0;
    var _isIdSet = false;
    var _name = "GameLobby";
    var _leader;
    var _currentPlayerId = 0;

    
    function setId(aId)
    {
        if(isNaN(aId))
            throw new TypeError("Parameter is not a number");
        
        if(_isIdSet)
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
        _players.push(aPlayer);
    }

    function getPlayers()
    {
        return _players;
    }

    /*
     *  Sets max player count and kicks players, if current player count > maximum
     */
    function setMaxPlayers(aMaxPlayers)
    {
        _maxPlayers = aMaxPlayers;
    }
    
    function getMaxPlayers()
    {
        return _maxPlayers;
    }

    function kickPlayer(aPlayer)
    {
        var index = _players.indexOf(aPlayer);

        if (index >= 0)
            _players.splice(index, 1);
    }
    
    function setName(aName)
    {
        if(typeof(aName) !== "string")
            throw new TypeError("Parameter is not a string");
        
        _name = aName;
    }
    
    function getName()
    {
        return _name;
    }
    
    function _hasPlayer(aPlayer)
    {
        if(_players.indexOf(aPlayer) < 0)
            return false;
        
        return true;
    }

    function setLeader(aLeader)
    {
        if(! _hasPlayer(aLeader))
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
        
        for(var i = 0;i < players.length;++i)
        {
            var player = {
                id: players[i].getId(),
                name: players[i].getName(),
                color: players[i].getColor()
            };
            
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
    
    this.addPlayer = addPlayer;
    this.getPlayers = getPlayers;
    this.setMaxPlayers = setMaxPlayers;
    this.getMaxPlayers = getMaxPlayers;
    
    this.kickPlayer = kickPlayer;
    
    this.getId = getId;
    this.setId = setId;
    
    this.setName = setName;
    this.getName = getName;
    
    this.setLeader = setLeader;
    this.getLeader = getLeader;
    
    this.serialize = serialize;
    this.serializeAsObject = serializeAsObject;
};

