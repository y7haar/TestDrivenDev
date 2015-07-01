/* 
 * Source Code for MapController
 */


tddjs.namespace("server.controller").mapController = mapController;

function mapController()
{
    var _map;
    var _player=[];
    var _jsonMap;
    
    var _mapGenerator = new tddjs.server.controller.mapGenerator();
    
    function init(){
        //TODO: switch-case for playercount
        setUp2Player();
        
    }
    
    // <editor-fold defaultstate="collapsed" desc="init-functions">
    
    function setUp2Player(){
        _mapGenerator.setGridSize(150,150);
        _mapGenerator.setMaximumCountrySize(300);
        _mapGenerator.setMinimumCountrySize(200);
        _mapGenerator.setMinimumContinentNumber(6);
        _mapGenerator.setMaximumContinentNumber(10);
        _mapGenerator.setMinimumContinentSize(4);
        _mapGenerator.setMinimumWaterNumber(6);
        _mapGenerator.setMinimumWaterNumber(4);
        
        _map = _mapGenerator.generateMap();
    }
    
    // </editor-fold>
    
    function getMap(){
        if(!_map)
            throw new Error("Call init first!");
        return _map;
    }
    
    function getSerializedMap(){
        if(!_map)
            throw new Error("Call init first!");
        //TODO: serialisieren
        return _jsonMap;
    }
    
    function reset(){
        _map = null;
        _player=[];
        _jsonMap = null;
    }
    
    function getMapGenerator(){
        return _mapGenerator;
    }
    
    this.init = init;
    this.getMap = getMap;
    this.getSerializedMap = getSerializedMap;
    
    this.reset = reset;
    
    this.getMapGenerator = getMapGenerator;
}
