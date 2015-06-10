/* 
 * Sourcecode for gameUiController
 */


tddjs.namespace("client.ui").gameUiController = gameUiController;

function gameUiController(){
    
    var _btn =[];
    
    function addButton(btn){
        if(arguments.length < 1)
            throw new Error("Wrong parametercount!");
        if(!(aContinent instanceof tddjs.client.ui.button))
            throw new TypeError("Parameter ist not instance of Button");
        _btn.push(btn);
    }
    function getButtons(){
        return _btn;
    }
    
    
    
    
    this.addButton = addButton;
    this.getButtons = getButtons;
}