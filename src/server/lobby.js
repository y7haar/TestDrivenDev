/* 
 *  Source-Code for Lobby
 */

(function ()
{
        var _players = [];
    
        function addPlayer(aPlayer)
        {
            _players.push(aPlayer);
        }
        
        function getPlayers()
        {
            return _players;
        }
    
        tddjs.namespace("server.model").Lobby = {
            addPlayer: addPlayer,
            getPlayers: getPlayers
        };
    
}());

