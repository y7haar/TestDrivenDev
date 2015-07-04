/* 
 * Source Code for GameController
 */


tddjs.namespace("client.controller").gameController = gameController;

function gameController(aCtx){
    var _gameLoopController;
    var _gameUiController;
    var _Map;
    var _gridMap;
    var states={};
    
    var _selected=[];
    
    function init(){
        _gameUiController = new tddjs.client.ui.gameUiController(aCtx);
        
        _Map = _gameUiController.getMap(/*TODO: daten vom server*/);
        _gridMap = _gameUiController.getGridMap();
        _gameUiController.mapDown = mapDown;
        
        //gamestates
        states["placingState"].down=placingDown;
        states["attackingState"].down=attackingDown;
        states["waitingState"].down=waitingDown;
        
        
        
        _gameLoopController = new tddjs.client.controller.gameLoopController(_Map, _Player, _Url);
        
        _gameUiController.init(null);
    }
    
    
    
    // <editor-fold defaultstate="collapsed" desc="Game-States">
    function mapDown(x,y){
        states[_gameLoopController.getStateName()].down(x,y);
    }
    function placingDown(x,y){
        
    }
    function attackingDown(x,y){
        var id = _gridMap[x][y].id;
        
        if(id>=0){ //kein wasser
            _gridMap[x][y].selected=!_gridMap[x][y].selected;
            
            if(_gridMap[x][y].selected){
                _selected.push(_gridMap[x][y]);
            }
            else
            {
                _selected.splice(_selected.indexOf(_gridMap[x][y]),1);
                for(var i in _gridMap[x][y].getBorders()){
                    _gridMap[x][y].getBorders()[i].activ=false;
                }
            }
            for(var c in _selected){
                for(var i in _selected[c].getBorders()){
                    _selected[c].getBorders()[i].activ=true;
                }
            }
        }
    }
    function waitingDown(x,y){
        
    }
    // </editor-fold>
}