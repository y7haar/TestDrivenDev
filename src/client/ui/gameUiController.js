/* 
 * Sourcecode for gameUiController
 */


tddjs.namespace("client.ui").gameUiController = gameUiController;

function gameUiController(aGLC,aCtx){
    
    var gameLoopController = null;
    var _ctx = null;
    if(arguments.length === 2){
        gameLoopController = aGLC;
        _ctx = aCtx;
    }
    
    var _btn =[];
    var _countries =[];
    var _gridMap;
    
    function init(){
        
    }
    
    function addButton(aBtn){
        if(arguments.length < 1)
            throw new Error("Wrong parametercount!");
        if(!(aBtn instanceof tddjs.client.ui.button))
            throw new TypeError("Parameter ist not instance of Button");
        _btn.push(aBtn);
    }
    function getButtons(){
        return _btn;
    }
    
    
    // <editor-fold defaultstate="collapsed" desc="Map-functions">
    function _initMap(aGridMap){
        _gridMap = aGridMap;
        for(x=0;x<_gridMap.cellGrid.length;x++){
            for(y=0;y<_gridMap.cellGrid[0].length;y++){
                if(_countries.indexOf(_gridMap.cellGrid[x][y]) === -1)
                    _countries.push(_gridMap.cellGrid[x][y]);
            }
        }
    }
    
    function _extendCountries(){
        if(_countries.length === 0)
            throw new Error("Call _initMap first!");
        for (var i=0; i<_countries.length; ++i)
            _countries[i]._isOnCoord=_isOnCoord;
    }
    // <editor-fold defaultstate="collapsed" desc="Country helper">
    function _isOnCoord(x,y){
        console.log(this);
        return null;
    }
    // </editor-fold>
    
    function _getCountries(){
        if(_countries.length === 0)
            throw new Error("Call _initMap first!");
        return _countries;
    }
    // </editor-fold>
    
    this.init = init;
    this.addButton = addButton;
    this.getButtons = getButtons;
    
    //private
    this._initMap = _initMap;
    this._getCountries = _getCountries;
    this._extendCountries = _extendCountries;
    
    //helper
}