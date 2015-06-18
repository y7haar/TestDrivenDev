/* 
 *  Source-Code for LobbyFactory
 */

tddjs.namespace("server.controller").lobbyFactory = lobbyFactory;

function lobbyFactory()
{
    var _lobbyController = tddjs.server.controller.lobbyController.getInstance();

    function getNewLobby()
    {
        var lobby = new tddjs.server.model.lobby();
        var id = _lobbyController.getNextId();
        lobby.setId(id);

        return lobby;
    }

    this.getNewLobby = getNewLobby;
}

