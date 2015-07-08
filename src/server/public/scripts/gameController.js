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
    var _unitsLeft=0;
    var _Url;
    var states={};
    var buttons={};
    var ajax = tddjs.util.ajax;
    
    var _selected=[];
    
    function init(){
        _gameUiController = new tddjs.client.ui.gameUiController(aCtx);
        
        var options = {
            headers: {
                "Accept": "application/json"           },
            onSuccess: onSuccess,
            onFailure: onFailure
        };
        
        var id = window.location.search.split('id=')[1];
        _Url = BASE_URL + "game/" + id;

        ajax.get(_Url + "/map", options);
        
        
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
        buttons["placingState"][0]=new tddjs.client.ui.button(40,635,"Place Units",ctx);
        buttons["placingState"][0].click=placingButton;
        
        buttons["attackingState"]=[];
        buttons["attackingState"][0]=new tddjs.client.ui.button(40,635,"Attack!",ctx);
        buttons["attackingState"][1]=new tddjs.client.ui.button(130,635,"Finish",ctx);
        buttons["attackingState"][0].click=attackingButtonAttack;
        buttons["attackingState"][1].click=attackingButtonFinished;
        
        buttons["waitingState"]=[];
        //buttons["waitingState"][0]=new tddjs.client.ui.button(40,635,"str",ctx);
        // </editor-fold>
    }
    
    function onSuccess(xhr){
        var data = xhr.responseText;
        data = JSON.parse(data);
        
        var _pID = data.info.playerId;
        
        
        _Map = _gameUiController.getMap(data);
        _gridMap = _gameUiController.getGridMap();
        _Player = _gameUiController.getPlayerById(_pID);
        
        _gameUiController.setPlayerColor(_Player.getColor());
        
        _gameLoopController = new tddjs.client.controller.gameLoopController(_Map, _Player, _Url);
        _gameLoopController.setGameController(this);
        
        _gameUiController.init(null);
    }
    
    function onFailure(xhr){
        console.log(xhr);
    }
    
    function getGameUiController(){
        return _gameUiController;
    }
    
    function getGameLoopController(){
        return _gameLoopController;
    }
    
    function update(req){
        if(arguments.length === 1){
            _unitsLeft = req.unitCount;
        }
        _gameUiController.updateUnitCounts();
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
        var id = _gridMap[x][y].id;
        var imgCacheHover = _gameUiController.getImgCacheHover();
        if(id>=0){ //kein wasser
            _gameUiController.setCountryStrHover(_gridMap[x][y].getName()+" ("+_gameUiController._getContinentFromCountryById(id).getName()+")["+_gridMap[x][y].getUnitCount()+"]");
            for (var i in imgCacheHover){
                if(imgCacheHover[i].id === id)
                   imgCacheHover[i].activ = true;
                else
                   imgCacheHover[i].activ = false;
            }
        }
        if (_unitsLeft <=0){
            buttons["placingState"][0].setText("Finished!");
        }
        else
            buttons["placingState"][0].setText("Place Units: "+_unitsLeft+" left");
    }
    function attackingMove(x,y){
        var id = _gridMap[x][y].id;
        var imgCacheHover = _gameUiController.getImgCacheHover();
        if(id>=0){ //kein wasser
            _gameUiController.setCountryStrHover(_gridMap[x][y].getName()+" ("+_gameUiController._getContinentFromCountryById(id).getName()+")["+_gridMap[x][y].getUnitCount()+"]");
            for (var i in imgCacheHover){
                if(imgCacheHover[i].id === id)
                   imgCacheHover[i].activ = true;
                else
                   imgCacheHover[i].activ = false;
            }
        }
    }
    function waitingMove(x,y){
        var imgCacheHover = _gameUiController.getImgCacheHover();
        for (var i in imgCacheHover){
            imgCacheHover[i].activ = false;
        }
    }
    // </editor-fold>
    // <editor-fold defaultstate="collapsed" desc="Game-States-MouseDown">
    function placingDown(x,y){
        var id = _gridMap[x][y].id;
        
        if(id>=0 & _unitsLeft !==0 & _gridMap[x][y].getOwner() === _Player){ //kein wasser
            //_gridMap[x][y].addUnits(1);
            var placingMove = {
                    type: 'placing',
                    unitCount: 1,
                    player: _Player.getName(),
                    continent: _gameUiController._getContinentFromCountryById(id).getName(),
                    country: _gridMap[x][y].getName()
                };
            if(_gameLoopController.makeMove(placingMove))
                _unitsLeft--;
        }
       
       _gameUiController.updateUnitCounts();
    }
    function attackingDown(x,y){
        var id = _gridMap[x][y].id;
        
        if(id>=0){ //kein wasser
            _gridMap[x][y].selected=!_gridMap[x][y].selected;
            
            if(_gridMap[x][y].selected){
                if(_selected.length < 2)
                    _selected.push(_gridMap[x][y]);
                else
                    _gridMap[x][y].selecte=false;
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
                    if(_selected.length < 2)
                        _selected[c].getBorders()[i].activ=true;
                    else
                        _selected[c].getBorders()[i].activ=false;
                }
            }
        }
    }
    function waitingDown(x,y){
        
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="Game-States-Buttons">
    function placingButton(){
        if (_unitsLeft <=0){
            _gameLoopController.endPhase();
        }
        else
            window.alert("Please place all units!");
    }
    function attackingButtonAttack(){
        var from;
        var to;
        for(var i in _selected){
            if(_selected[i].getOwner() === _Player)
                from = _selected[i];
            else
                to = _selected[i];
        }
        var attackMove = {
            type: 'attack',
            from: {
                player: from.getOwner().getName(),
                continent: _gameUiController._getContinentFromCountryById(from.getId()).getName(),
                country: from.getName()
            },
            to: {
                player: to.getOwner().getName(),
                continent: _gameUiController._getContinentFromCountryById(to.getId()).getName(),
                country: to.getName()
            }
        };
        _gameLoopController.makeMove(attackMove);
    }
    function attackingButtonFinished(){
        _gameLoopController.endPhase();
    }
    // </editor-fold>
    
    // </editor-fold>
    
    this.init = init;
    this.update = update;
    this.onSuccess = onSuccess;
    this.onFailure = onFailure;
    
    this.initGameStates = initGameStates;
    
    this.getGameUiController = getGameUiController;
    this.getGameLoopController = getGameLoopController;
}