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
        return _map;
    }
    
    function getSerializedMap(){
        
    }
    
    
    this.init = init;
    this.getMap = getMap;
    this.getSerializedMap = getSerializedMap;
}
