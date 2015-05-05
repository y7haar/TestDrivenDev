/* 
 *  Source-Code for Lobby
 */

tddjs.namespace("server.model");

(function()
{
    var _players = [];
    var _maxPlayers;
    var _id;
    var _name;

    // Constructor
    function Lobby(aId)
    {
        if(isNaN(aId))
            throw new TypeError("Parameter is not a number");
        
        _id = aId;
    }

    tddjs.server.model.Lobby = Lobby;

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
    }
    
    function getId()
    {
        return _id;
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

    Lobby.prototype.addPlayer = addPlayer;
    Lobby.prototype.getPlayers = getPlayers;
    Lobby.prototype.setMaxPlayers = setMaxPlayers;
    Lobby.prototype.kickPlayer = kickPlayer;
    Lobby.prototype.getId = getId;
    Lobby.prototype.setName = setName;
    Lobby.prototype.getName = getName;

}());

