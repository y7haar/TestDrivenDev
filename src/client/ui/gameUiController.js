/* 
 * Sourcecode for gameUiController
 */


tddjs.namespace("client.ui").gameUiController = gameUiController;

function gameUiController(aGLC){
    
    var gameLoopController = null;
    if(arguments.length === 1)
        gameLoopController = aGLC;
    var _btn =[];
    
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
    
    
    
    function _initMap(){
        
    }
    
    
    this.init = init;
    this.addButton = addButton;
    this.getButtons = getButtons;
    
    //private
    this._initMap = _initMap;
}