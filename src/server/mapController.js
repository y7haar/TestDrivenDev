/* 
 * Source Code for MapController
 */


tddjs.namespace("server.controller").mapController = mapController;

function mapController()
{
    var _map;
    var _player=[];
    var _jsonMap;
    
    function init(){
        
    }
    
    function getMap(){
        if(!_map)
            throw new Error("Call init first!");
        return _map;
    }
    
    function getSerializedMap(){
        if(!_jsonMap)
            throw new Error("Call init first!");
        return _jsonMap;
    }
    
    function reset(){
        _map = null;
        _player=[];
        _jsonMap = null;
    }
    
    this.init = init;
    this.getMap = getMap;
    this.getSerializedMap = getSerializedMap;
    
    this.reset = reset;
}
