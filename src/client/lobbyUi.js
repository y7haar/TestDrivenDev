/* 
 * Source-Code for lobbyUi 
 */

tddjs.namespace("client.ui").lobbyUi= lobbyUi;
       
function lobbyUi()
{   
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
        
    }
    
    this.createWrapper = createWrapper;
    this.addLobby = addLobby;
}