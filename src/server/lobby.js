/* 
 *  Source-Code for Lobby
 */

(function()
{
    var _players = [];
    var _maxPlayers = 4;
    this._id = 0;
    var _name = "GameLobby";
    var _leader;

    
    function setId(aId)
    {
        if(isNaN(aId))
            throw new TypeError("Parameter is not a number");
        
        this._id = aId;
    }

    function addPlayer(aPlayer)
    {
        if (_players.length < _maxPlayers)
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

        while (_players.length > aMaxPlayers)
        {
            _players.pop();
        }
    }

    function kickPlayer(aPlayer)
    {
        var index = _players.indexOf(aPlayer);

        if (index >= 0)
            _players.splice(index, 1);
        
        if(_leader === aPlayer && _players.length > 0)
        {
            _leader = _players[0];
        }
        
        if(_leader === aPlayer && _players.length === 0)
        {
            _leader = null;
        }
    }
    
    function getId()
    {
        return this._id;
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
    
    tddjs.namespace("server.model").Lobby = {
        addPlayer: addPlayer,
        getPlayers: getPlayers,
        setMaxPlayers: setMaxPlayers,
        kickPlayer: kickPlayer,
        getId: getId,
        setId: setId,
        setName: setName,
        getName: getName,
        setLeader: setLeader,
        getLeader: getLeader
    };

}());

