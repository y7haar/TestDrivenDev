/* 
 * Sourcecode for gameUiController
 */


tddjs.namespace("client.ui").gameUiController = gameUiController;

function gameUiController(){
    
    var _btn =[];
    
    function addButton(btn){
        
        _btn.push(btn);
    }
    function getButtons(){
        return _btn;
    }
    
    
    
    
    this.addButton = addButton;
    this.getButtons = getButtons;
}