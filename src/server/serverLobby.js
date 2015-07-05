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
    var _started = false;
    var _botNames = ["Peter", "Gregor", "Valentin", "Dennis", "Sebastian", "Christian", "Johnny"];
    var _botColors = ["#808000", "#804000", "#6d946b", "#5a89a5", "#808080", "#9b9bce"];
    
    if(typeof module !== "undefined")
    {
        var NameListGenerator = require("./nameListGenerator");
        var MapController = require("./mapController");
        
        var _botNameGenerator = new NameListGenerator();
        var _botColorGenerator = new NameListGenerator(); 

        var _mapController = new MapController();
    }
    
    else
    {
        var _botNameGenerator = new tddjs.server.controller.nameListGenerator();
        var _botColorGenerator = new tddjs.server.controller.nameListGenerator(); 

        var _mapController = new tddjs.server.controller.mapController();
    }
    
    
    

    _botNameGenerator.setNameList(_botNames);
    _botNameGenerator.shuffleNameList();
    
    _botColorGenerator.setNameList(_botColors);
    _botColorGenerator.shuffleNameList();

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
    
    function getMapController()
    {
        return _mapController;
    }
    
    function isStarted()
    {
        return _started;
    }
    
    function startGame()
    {
        _mapController.getMapGenerator().getCountryNameGenerator().setNameList(COUNTRY_NAMES_ARRAY);
        _mapController.getMapGenerator().getContinentNameGenerator().setNameList(CONTINENT_NAMES_ARRAY);
        _mapController.init(_players);
        setStarted(true);
    }
    
    function setStarted(aStarted)
    {
        _started = aStarted;
    }

    function addPlayer(aPlayer)
    {
        if (typeof aPlayer.getId() === "undefined")
            aPlayer.setId(_currentPlayerId++);

        if (_players.length < _maxPlayers)
            _players.push(aPlayer);
    }
    
    function addBot()
    {
        if(_isFull())
            return null;
        
        var bot = new tddjs.server.player();
        bot.setType("bot");
        bot.setName("BOT " + _botNameGenerator.getNextName());
        bot.setColor(_botColorGenerator.getNextName());
        
        addPlayer(bot);
        
        return bot;
    }
    
    function _isFull()
    {
        return (_players.length >= _maxPlayers);
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
        if(typeof aMaxPlayers !== "number")
            throw new TypeError("Max Players must be number");
        
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
    
    function isLeaderTokenValid(aToken)
    {
        try
        {
            var player = this.getPlayerByToken(aToken);
            return (this.isPlayerTokenValid(player, aToken) && player === _leader);
        }
        
        catch(e)
        {
            return false;
        }
        
        return false;
    }
    
    function getUniqueToken()
    {
        var token = parseInt(Math.random() * 1000000000);
        
        if(_usedTokens[token] === true)
        {
            this.getUniqueToken();
        }
        
        _usedTokens[token] = true;
        return token.toString();
    }

    this.addPlayer = addPlayer;
    this.addBot = addBot;
    this.getPlayers = getPlayers;
    this.setMaxPlayers = setMaxPlayers;
    this.getMaxPlayers = _getMaxPlayers;
    this.kickPlayer = kickPlayer;

    this.getId = getId;
    this.setId = setId;
    
    this.isStarted = isStarted;
    this.setStarted = setStarted;
    this.startGame = startGame;
    
    this.getMapController = getMapController;
    
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

