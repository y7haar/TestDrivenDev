/* 
 * Source-Code for lobbyUi 
 */

tddjs.namespace("client.ui").lobbyUi = lobbyUi;

function lobbyUi(aRequestController)
{
    var _lobbyRequestController = aRequestController;

    var _colors = ["#0000ff", "#90ee90", "#ff7f50", "#6495ed", "#228b22", "#ff0000", "#ff8c00", "#ffff00", "#7cfc00", "#f0e68c", "#ee82ee"];
    var _colorIndex = 0;
    var _currentLobby;
    var _currentPlayer;
    var _colorBoxes = [];

    var _startButton;


    function createContent()
    {
        var body = document.getElementsByTagName("body")[0];
        var content = document.createElement("div");
        content.id = "content";
        content.className = "content";

        var h1Div = document.createElement("div");
        h1Div.className = "lobbiesTitle";

        var h1 = document.createElement("h1");
        h1.innerHTML = "Lobbies";

        h1Div.appendChild(h1);
        content.appendChild(h1Div);

        body.appendChild(content);
    }

    function createLobbyContent()
    {
        var body = document.getElementsByTagName("body")[0];
        var content = document.createElement("div");
        content.id = "content";
        content.className = "content";

        body.appendChild(content);
    }

    function createWrapper()
    {
        var content = document.getElementById("content");
        var wrapper = document.createElement("div");
        wrapper.id = "lobbyWrapper";
        wrapper.className = "lobbyWrapper";


        content.appendChild(wrapper);
    }

    function addLobby(aLobby)
    {
        var lobbyId = aLobby.id;
        var lobbyName = aLobby.name;
        var lobbyMaxPlayers = aLobby.maxPlayers;
        var lobbyCurrentPlayers = aLobby.players.length;

        var div = document.createElement("div");
        var table = document.createElement("table");
        var tr = document.createElement("tr");
        div.className = "lobby";

        var td1 = document.createElement("td");
        td1.className = "lobbiesId";

        var td2 = document.createElement("td");
        td2.className = "lobbiesName";

        var td3 = document.createElement("td");
        td3.className = "lobbyPlayers";

        var td4 = document.createElement("td");
        td4.className = "lobbyJoin";

        var td4Div = document.createElement("div");
        td4.appendChild(td4Div);

        td4Div.innerHTML = "Join";

        var submit = this.onJoinSubmit;

        td4.onclick = function() {
            submit(lobbyId);
        };

        td1.innerHTML = "#" + lobbyId;
        td2.innerHTML = lobbyName;
        td3.innerHTML = "" + lobbyCurrentPlayers + " / " + lobbyMaxPlayers;

        div.appendChild(table);
        table.appendChild(tr);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);

        var wrapper = document.getElementById("lobbyWrapper");
        wrapper.appendChild(div);
    }

    function clearLobbies()
    {
        var wrapper = document.getElementById("lobbyWrapper");
        wrapper.innerHTML = "";
    }

    function showErrorMessage()
    {
        var lobbyWrapper = document.getElementById("lobbyWrapper");
        lobbyWrapper.innerHTML = "";

        var p = document.createElement("p");
        p.innerHTML = "Error: Could not get data";

        lobbyWrapper.appendChild(p);
    }

    function onJoinSubmit(aLobbyId, aPlayer)
    {
        if (typeof aLobbyId !== "number")
            throw new TypeError("LobbyId must be a number");

        var defaultPlayer = new tddjs.client.player();
        defaultPlayer.setName("Unnamed Player");
        defaultPlayer.setColor("#ffffff");

        if (typeof aPlayer === "undefined")
            aPlayer = defaultPlayer;

        _lobbyRequestController.requestJoin(aLobbyId, aPlayer);
    }
    
    function getPlayerColorBoxById(aId)
    {
        return _colorBoxes[aId];
    }

    function getLobbyRequestController()
    {
        return _lobbyRequestController;
    }

    function showLobby(aLobby)
    {
        _currentLobby = aLobby;

        clearLobbies();

        var wrapper = document.getElementById("lobbyWrapper");
        var title = document.createElement("h1");
        title.innerHTML = "#" + aLobby.getId() + " " + aLobby.getName();
        title.className = "lobbyTitle";

        var p = document.createElement("p");
        p.className = "lobbyMaxPlayers";
        p.innerHTML = aLobby.getPlayers().length + " / " + aLobby.getMaxPlayers() + " Players";

        var playerWrapper = document.createElement("div");
        playerWrapper.id = "playerWrapper";
        playerWrapper.className = "playerWrapper";

        var maxPlayers = aLobby.getMaxPlayers();

        for (var i = 0; i < maxPlayers; ++i)
        {
            showLobbyPlayer(playerWrapper, aLobby.getPlayers()[i]);
        }

        wrapper.appendChild(title);
        wrapper.appendChild(p);
        wrapper.appendChild(playerWrapper);
    }

    function showLeaderLobby(aLobby)
    {
        _currentLobby = aLobby;

        clearLobbies();

        var wrapper = document.getElementById("lobbyWrapper");

        var title = document.createElement("h1");
        var id = document.createElement("h1");
        var maxPlayersSpan = document.createElement("span");
        var maxPlayersSelect = document.createElement("select");
        var playersOptions = [];
        playersOptions[0] = document.createElement("option");
        playersOptions[1] = document.createElement("option");
        playersOptions[2] = document.createElement("option");

        playersOptions[0].text = "2";
        playersOptions[1].text = "3";
        playersOptions[2].text = "4";

        var table = document.createElement("table");
        var tr = document.createElement("tr");
        var td1 = document.createElement("td");
        var td2 = document.createElement("td");
        var td3 = document.createElement("td");
        var td4 = document.createElement("td");

        title.innerHTML = aLobby.getName();
        title.contentEditable = true;
        title.className = "lobbyTitle";
        title.onblur = function() {
            _lobbyRequestController.updateLobbyName(_currentLobby.getId(), title.textContent);
        };

        id.innerHTML = "#" + aLobby.getId();
        id.className = "lobbyId";

        maxPlayersSelect.add(playersOptions[0]);
        maxPlayersSelect.add(playersOptions[1]);
        maxPlayersSelect.add(playersOptions[2]);
        maxPlayersSelect.className = "lobbyMaxPlayersSelect";
        maxPlayersSelect.onchange = function() {
            var maxPlayersNumber = parseInt(maxPlayersSelect.value);
            _lobbyRequestController.updateMaxPlayers(_currentLobby.getId(), maxPlayersNumber);
        };


        maxPlayersSpan.innerHTML = "Max Players";
        maxPlayersSpan.className = "lobbyMaxPlayersSpan";


        td1.appendChild(id);
        td2.appendChild(title);
        td3.appendChild(maxPlayersSpan);
        td4.appendChild(maxPlayersSelect);

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);

        var playerWrapper = document.createElement("div");
        playerWrapper.id = "playerWrapper";
        playerWrapper.className = "playerWrapper";

        var maxPlayers = aLobby.getMaxPlayers();

        for (var i = 0; i < maxPlayers; ++i)
        {
            if (aLobby.getPlayers()[i] === aLobby.getLeader())
            {
                showLobbyPlayer(playerWrapper, aLobby.getPlayers()[i]);
            }

            else
            {
                showLobbyLeaderPlayer(playerWrapper, aLobby.getPlayers()[i]);
            }
        }

        table.appendChild(tr);
        wrapper.appendChild(table);
        wrapper.appendChild(playerWrapper);

        addStartButton(wrapper);

    }


    function showLobbyPlayer(playerWrapper, aPlayer)
    {

        var playerDiv = document.createElement("div");
        playerDiv.className = "lobbyPlayer";

        playerWrapper.appendChild(playerDiv);

        var table = document.createElement("table");
        var tr = document.createElement("tr");

        table.appendChild(tr);

        var playerColor = document.createElement("td");
        var playerName = document.createElement("td");
        var playerType = document.createElement("td");

        playerColor.className = "playerColor";
        playerName.className = "playerName";
        playerType.className = "playerType";

        tr.appendChild(playerColor);
        tr.appendChild(playerName);
        tr.appendChild(playerType);
        playerDiv.appendChild(table);

        // Empty slot
        if (typeof aPlayer === "undefined")
        {
            playerColor.style.backgroundColor = "#ffffff";
            playerName.innerHTML = "";
            playerType.innerHTML = "Open Slot";
        }

        // Real Player
        else
        {
            _colorBoxes[aPlayer.getId()] = playerColor;
            playerDiv.id = "playerId" + aPlayer.getId();

            if (aPlayer.getType() === "bot")
            {
                playerType.innerHTML = "Bot";
            }

            else if (aPlayer.getType() === "human")
            {
                playerType.innerHTML = "Human";
            }

            playerName.innerHTML = aPlayer.getName();
            playerColor.style.backgroundColor = aPlayer.getColor();
        }
    }

    function showLobbyLeaderPlayer(playerWrapper, aPlayer)
    {

        var playerDiv = document.createElement("div");
        playerDiv.className = "lobbyPlayer";

        playerWrapper.appendChild(playerDiv);

        var table = document.createElement("table");
        var tr = document.createElement("tr");

        table.appendChild(tr);

        var playerColor = document.createElement("td");
        var playerName = document.createElement("td");
        var playerType = document.createElement("td");
        var playerTypeRoll = document.createElement("select");
        var type1 = document.createElement("option");
        var type2 = document.createElement("option");
        var type3 = document.createElement("option");

        type1.text = "Open Slot";
        type2.text = "Bot";
        type3.text = "Human";

        playerTypeRoll.className = "playerTypeSelect";

        playerType.appendChild(playerTypeRoll);

        playerColor.className = "playerColor";
        playerName.className = "playerName";
        playerType.className = "playerType";

        tr.appendChild(playerColor);
        tr.appendChild(playerName);
        tr.appendChild(playerType);
        playerDiv.appendChild(table);

        // Empty slot
        if (typeof aPlayer === "undefined")
        {
            playerColor.style.backgroundColor = "#ffffff";
            playerName.innerHTML = "";

            playerTypeRoll.add(type1);
            playerTypeRoll.add(type2);
            playerTypeRoll.selectedIndex = 0;
        }

        // Real Player
        else
        {
            _colorBoxes[aPlayer.getId()] = playerColor;
            playerDiv.id = "playerId" + aPlayer.getId();

            playerTypeRoll.add(type1);
            playerTypeRoll.add(type2);


            if (aPlayer.getType() === "bot")
            {
                playerTypeRoll.selectedIndex = 1;
            }

            else if (aPlayer.getType() === "human")
            {
                playerTypeRoll.add(type3);
                playerTypeRoll.selectedIndex = 2;
            }

            playerName.innerHTML = aPlayer.getName();
            playerColor.style.backgroundColor = aPlayer.getColor();
        }
    }

    function setPlayerEditable(aId)
    {
        if (typeof aId !== "number")
            throw new TypeError("Id must be number");

        var playerDiv = document.getElementById("playerId" + aId);

        if (playerDiv === null)
            throw new Error("Player with given Id does not exist");

        var playerName = playerDiv.childNodes[0].childNodes[0].childNodes[1];
        playerName.contentEditable = true;
        playerName.innerHTML = "";
        playerName.onblur = function() {
            _lobbyRequestController.updatePlayerName(_currentLobby.getId(), aId, playerName.textContent);
        };

        playerName.onclick = function() {
            this.innerHTML = "";
        };

        var colorBox = playerDiv.childNodes[0].childNodes[0].childNodes[0];
        colorBox.style.cursor = "pointer";

        colorBox.onclick = function() {
            colorBox.style.backgroundColor = _colors[_colorIndex % _colors.length];

            _lobbyRequestController.updatePlayerColor(_currentLobby.getId(), aId, _colors[_colorIndex % _colors.length]);
            _colorIndex++;
        };


        playerName.focus();
    }

    function addStartButton(aLobbyWrapper)
    {
        var div = document.createElement("div");
        div.className = "lobbyStartButton";
        div.innerHTML = "Start";
        div.onclick = submitLobbyStart;

        aLobbyWrapper.appendChild(div);
        _startButton = div;
    }

    function addNewLobbyButton()
    {
        var wrapper = document.getElementById("lobbyWrapper");

        var div = document.createElement("div");
        div.className = "newLobbyButton";
        div.innerHTML = "New Lobby";
        
        div.onclick = onNewLobbySubmit;
        
        wrapper.appendChild(div);
    }

    function showLobbyOverview()
    {
        this.createContent();
        this.createWrapper();

        var wrapper = document.getElementById("lobbyWrapper");
        _lobbyRequestController.requestAllLobbies();
    }
    
    function onNewLobbySubmit()
    {
        try
        {
            var defaultPlayer = new tddjs.client.player();
            defaultPlayer.setName("Unnamed Player");
            defaultPlayer.setColor("#ffffff");
            _lobbyRequestController.requestNewLobby(defaultPlayer);
        }
        catch(e)
        {
            
        }
    }
    function submitPlayerName(aId, aName)
    {
        try
        {
            _lobbyRequestController.updatePlayerName(_currentLobby.getId(), aId, aName);
        }
        catch (e)
        {
        }
    }

    function submitPlayerColor(aId, aColor)
    {
        try
        {
            _lobbyRequestController.updatePlayerColor(_currentLobby.getId(), aId, aColor);
        }
        catch (e)
        {
        }
    }

    function submitLobbyName(aName)
    {
        try
        {
            _lobbyRequestController.updateLobbyName(_currentLobby.getId(), aName);
        }
        catch (e)
        {
        }
    }

    function submitMaxPlayers(aMaxPlayers)
    {
        try
        {
            _lobbyRequestController.updateMaxPlayers(_currentLobby.getId(), aMaxPlayers);
        }
        catch (e)
        {
        }
    }

    function submitPlayerType()
    {

    }

    function submitLobbyStart()
    {
        try
        {
            if (_currentLobby.getPlayers().length >= 2)
                _lobbyRequestController.startGame(_currentLobby.getId());

            else
                window.alert("Player count must be greater than 2");
        }
        catch (e)
        {
        }
    }

    function setCurrentLobby(aLobby)
    {
        _currentLobby = aLobby;
    }

    function getCurrentLobby()
    {
        return _currentLobby;
    }
    
    function setCurrentPLayer(aPlayer)
    {
        if(! (aPlayer instanceof tddjs.client.player))
            throw new TypeError("Player must be of type player");
        
        _currentPlayer = aPlayer;
    }
    
    function updateColor(aPlayerId, aColor)
    {
        if(typeof aPlayerId !== "number")
            throw new TypeError("Id must be number");
        
        if(typeof aColor !== "string")
            throw new TypeError("Color must be string");
        
        var colorBox = getPlayerColorBoxById(aPlayerId);
        
        if(typeof colorBox === "undefined")
            throw new Error("PlayerColorBox with given Id does not exist");
        
        colorBox.style.backgroundColor = aColor;
    }
    
    function updateLobby(aLobby)
    {
        var lobby = new tddjs.client.model.lobby();
        lobby.deserialize(aLobby);
        this.setCurrentLobby(lobby);
        this.showLobbyForPlayer();
    }
    
    function showLobbyForPlayer()
    {
        this.createLobbyContent();
        this.createWrapper();
        
        if(_currentLobby.getLeader() === _currentPlayer)
            this.showLeaderLobby(_currentLobby);
            
        else
            this.showLobby(_currentLobby);
        
        this.setPlayerEditable(_currentPlayer.getId());
    }

    this.createContent = createContent;
    this.createLobbyContent = createLobbyContent;
    this.createWrapper = createWrapper;
    this.addLobby = addLobby;
    this.showErrorMessage = showErrorMessage;
    this.clearLobbies = clearLobbies;
    this.onJoinSubmit = onJoinSubmit;
    this.getLobbyRequestController = getLobbyRequestController;
    this.showLobby = showLobby;
    this.showLeaderLobby = showLeaderLobby;
    this.setPlayerEditable = setPlayerEditable;
    this.addNewLobbyButton = addNewLobbyButton;
    this.showLobbyOverview = showLobbyOverview;
    this.getPlayerColorBoxById = getPlayerColorBoxById;
    this.showLobbyForPlayer = showLobbyForPlayer;

    this.setCurrentLobby = setCurrentLobby;
    this.getCurrentLobby = getCurrentLobby;
    this.setCurrentPlayer = setCurrentPLayer;

    //Events
    this.submitPlayerName = submitPlayerName;
    this.submitPlayerColor = submitPlayerColor;
    this.submitLobbyName = submitLobbyName;
    this.submitMaxPlayers = submitMaxPlayers;
    this.submitPlayerType = submitPlayerType;
    this.submitLobbyStart = submitLobbyStart;
    
    // EventSource Events
    this.updateColor = updateColor;
    this.updateLobby = updateLobby;
}