/* 
 *  Test cases for the Game UI
 */

function gameUiSetup()
{
    //this.gameUi = new tddjs.client.ui.gameUiController();
    this.button = new tddjs.client.ui.button(170,65,"button",null);
}

function gameUiTeardown()
{
    //delete this.gameUi;
}

TestCase("GameUiTest", {
    setUp: gameUiSetup,
    tearDown: gameUiTeardown,
    
    "test gameUi should not be undefined after constructor call": function () {  
        assertObject(this.gameUi);
    },
    
    "test gameUi button": function () {  
        assert(this.button.isCoordOnButton(170,65));
    }
});