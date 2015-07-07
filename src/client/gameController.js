/* 
 * Source Code for GameController
 */


tddjs.namespace("client.controller").gameController = gameController;

function gameController(aCtx){
    var _gameLoopController;
    var _gameUiController;
    var _Map;
    var _gridMap;
    var _Player;
    var states={};
    var buttons={};
    var ajax = tddjs.util.ajax;
    
    var _selected=[];
    
    function init(){
        _gameUiController = new tddjs.client.ui.gameUiController(aCtx);
        
        var options = {
            headers: {
                "Accept": "application/json"           },
            onSuccess: this.onSuccess,
            onFailure: this.onFailure
        };
        
        var URL = window.location.href;

        ajax.get(URL + "map", options);
        
        
        _gameUiController.mapDown = mapDown;
        _gameUiController.mapMove = mapMove;
    }
    
    function initGameStates(){
        // <editor-fold defaultstate="collapsed" desc="Game-States">
        states["placingState"].down=placingDown;
        states["attackingState"].down=attackingDown;
        states["waitingState"].down=waitingDown;
        
        states["placingState"].move=placingMove;
        states["attackingState"].move=attackingMove;
        states["waitingState"].move=waitingMove;
        
        buttons["placingState"]=[];
        buttons["placingState"][0]=new tddjs.client.ui.button(40,635,"str",ctx);
        buttons["attackingState"]=[];
        buttons["attackingState"][0]=new tddjs.client.ui.button(40,635,"Attack!",ctx);
        buttons["attackingState"][1]=new tddjs.client.ui.button(130,635,"Finish",ctx);
        buttons["waitingState"]=[];
        buttons["waitingState"][0]=new tddjs.client.ui.button(40,635,"str",ctx);
        // </editor-fold>
    }
    
    function onSuccess(xhr){
        
        
        
        
        
        _Map = _gameUiController.getMap(/*TODO: daten vom server*/);
        _gridMap = _gameUiController.getGridMap();
        _Player = _gameUiController.getPlayerById(/*TODO: daten vom server*/);
        
        _gameUiController.setPlayerColor(_Player.getColor());
        
        _gameLoopController = new tddjs.client.controller.gameLoopController(_Map, _Player, _Url);
        
        _gameUiController.init(null);
    }
    
    function getGameUiController(){
        return _gameUiController;
    }
    
    function getGameLoopController(){
        return _gameLoopController;
    }
    
    
    
    // <editor-fold defaultstate="collapsed" desc="Game-States">
    function mapDown(x,y){
        states[_gameLoopController.getStateName()].down(x,y);
    }
    function mapMove(x,y){
        _gameUiController.setButtons(buttons[_gameLoopController.getStateName()]);
        _gameUiController.setStateStr(_Player.getName() +": "+ _gameLoopController.getStateName())
        states[_gameLoopController.getStateName()].move(x,y);
    }
    
    // <editor-fold defaultstate="collapsed" desc="Game-States-MouseMove">
    function placingMove(x,y){
        
    }
    function attackingMove(x,y){
        var id = _gridMap[x][y].id;
        var imgCacheHover = _gameUiController.getImgCacheHover();
        if(id>=0){ //kein wasser
            _gameUiController.setCountryStrHover(_gridMap[x][y].getName()+" ("+_gameUiController._getContinentFromCountryById(id).getName()+")");
            for (var i in imgCacheHover){
                if(imgCacheHover[i].id === id)
                   imgCacheHover[i].activ = true;
                else
                   imgCacheHover[i].activ = false;
            }
        }
    }
    function waitingMove(x,y){
        
    }
    // </editor-fold>
    // <editor-fold defaultstate="collapsed" desc="Game-States-MouseDown">
    function placingDown(x,y){
        _gameUiController.updateUnitCounts();
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
    // </editor-fold>
    
    this.init = init;
    this.onSuccess = onSuccess;
    
    this.initGameStates = initGameStates;
    
    this.getGameUiController = getGameUiController;
    this.getGameLoopController = getGameLoopController;
}