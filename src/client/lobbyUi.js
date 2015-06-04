/* 
 * Source-Code for lobbyUi 
 */

tddjs.namespace("client.ui").lobbyUi= lobbyUi;
       
function lobbyUi()
{   
    function createContent()
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
    
    this.createContent = createContent;
    this.createWrapper = createWrapper;
    this.addLobby = addLobby;
    this.showErrorMessage = showErrorMessage;
    this.clearLobbies = clearLobbies;
}