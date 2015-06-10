/* 
 * Source-Code for lobbyUi 
 */

tddjs.namespace("client.ui").lobbyUi= lobbyUi;
       
function lobbyUi(aRequestController)
{   
    var _lobbyRequestController = aRequestController;
    
    var _colors = [ "Blue", "LightGreen", "Coral", "CornflowerBlue", "ForestGreen", "Red", "DarkOrange", "Yellow", "LawnGreen", "Khaki", "Violet"];
    var _colorIndex = 0;
    
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
        td1.className = "lobbyId";
        
        var td2 = document.createElement("td");
        td2.className = "lobbyName";
        
        var td3 = document.createElement("td");
        td3.className = "lobbyPlayers";
        
        var td4 = document.createElement("td");
        td4.className = "lobbyJoin";
        
        var td4Div = document.createElement("div");
        td4.appendChild(td4Div);
        
        td4Div.innerHTML = "Join";
        
        var submit = this.onJoinSubmit;
        
        td4.onclick = function(){
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
        if(typeof aLobbyId !== "number")
            throw new TypeError("LobbyId must be a number");
        
        var defaultPlayer = new tddjs.client.player();
        defaultPlayer.setName("Unnamed Player");
        defaultPlayer.setColor("#ffffff");
        
        if(typeof aPlayer === "undefined")
            aPlayer = defaultPlayer;
        
        _lobbyRequestController.requestJoin(aLobbyId, aPlayer);
    }
    
    function getLobbyRequestController()
    {
        return _lobbyRequestController;
    }
    
    function showLobby(aLobby)
    {
        clearLobbies();
        
        var wrapper = document.getElementById("lobbyWrapper");
        var title = document.createElement("h1");
        title.innerHTML = "#" + aLobby.getId() + " " + aLobby.getName();
        title.className = "lobbyTitle";
        
        var p = document.createElement("p");
        p.className = "lobbyMaxPlayers";
        p.innerHTML =  aLobby.getPlayers().length + " / "+ aLobby.getMaxPlayers() + " Players";
        
        var playerWrapper = document.createElement("div");
        playerWrapper.id = "playerWrapper";
        playerWrapper.className = "playerWrapper";
        
        var maxPlayers = aLobby.getMaxPlayers();
        
        for(var i = 0;i < maxPlayers; ++i)
        {
            showLobbyPlayer(playerWrapper, aLobby.getPlayers()[i]);            
        }
        
        wrapper.appendChild(title);
        wrapper.appendChild(p);
        wrapper.appendChild(playerWrapper);
    }
    
    function showLeaderLobby(aLobby)
    {
        clearLobbies();
        
        var wrapper = document.getElementById("lobbyWrapper");
        
        var title = document.createElement("h1");
        var id = document.createElement("h1");
        var table = document.createElement("table");
        var tr = document.createElement("tr");
        var td1 = document.createElement("td");
        var td2 = document.createElement("td");
        
        title.innerHTML = aLobby.getName();
        title.className = "lobbyTitle";
        
        id.innerHTML = "#" + aLobby.getId();
        id.className = "lobbyTitle";
        
        td1.appendChild(id);
        td2.appendChild(title);
        
        tr.appendChild(td1);
        tr.appendChild(td2);
        
        table.appendChild(tr);
        wrapper.appendChild(table);
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
        if(typeof aPlayer === "undefined")
        {
            playerColor.style.backgroundColor = "#ffffff";
            playerName.innerHTML = "";
            playerType.innerHTML = "Open Slot";
        }
        
        // Real Player
        else
        {
            playerDiv.id = "playerId" + aPlayer.getId();
            
            if(aPlayer.getType() === "bot")
            {
                playerType.innerHTML = "Bot";
            }
            
            else if(aPlayer.getType() === "human")
            {
                playerType.innerHTML = "Human";
            }
            
            playerName.innerHTML = aPlayer.getName();
            playerColor.style.backgroundColor = aPlayer.getColor();
        }
    }
    
    function setPlayerEditable(aId)
    {
        if(typeof aId !== "number")
            throw new TypeError("Id must be number");
        
        var playerDiv = document.getElementById("playerId" + aId);
        
        if(playerDiv === null)
            throw new Error("Player with given Id does not exist");
        
        var playerName = playerDiv.childNodes[0].childNodes[0].childNodes[1];
        playerName.contentEditable = true;
        playerName.innerHTML = "";
        
        playerName.onclick = function(){
          this.innerHTML = "";  
        };
        
        var colorBox = playerDiv.childNodes[0].childNodes[0].childNodes[0];
        colorBox.style.cursor = "pointer";
        
        colorBox.onclick = function() {
            colorBox.style.backgroundColor = _colors[_colorIndex % _colors.length];
            _colorIndex++;
        };
        
        
        playerName.focus();
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
}