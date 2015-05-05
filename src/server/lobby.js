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
        
        /*
         *  Sets max player count and kicks players, if current player count > maximum
         */
        function setMaxPlayers(aMaxPlayers)
        {
            _maxPlayers = aMaxPlayers;

            while(_players.length > aMaxPlayers)
            {
                    _players.pop();
            }
        }
        
        function kickPlayer(aPlayer)
        {
            
            var index = _players.indexOf(aPlayer);
            
            if(index >= 0)
                _players.splice(index, 1);
        }
    
        tddjs.namespace("server.model").Lobby = {
            addPlayer: addPlayer,
            kickPlayer: kickPlayer,
            getPlayers: getPlayers,
            setMaxPlayers: setMaxPlayers
        };
    
}());

