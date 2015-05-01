/* 
 *  Source-Code for Lobby
 */

(function ()
{
        var _players = [];
        var _maxPlayers;
    
        function addPlayer(aPlayer)
        {
            if(_players.length < _maxPlayers)
                 _players.push(aPlayer);
        }
        
        function getPlayers()
        {
            return _players;
        }
        
        function setMaxPlayers(aMaxPlayers)
        {
            _maxPlayers = aMaxPlayers;
        }
    
        tddjs.namespace("server.model").Lobby = {
            addPlayer: addPlayer,
            getPlayers: getPlayers,
            setMaxPlayers: setMaxPlayers
        };
    
}());

