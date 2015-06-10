/* 
 *  Test cases for the Game UI
 */

function gameUiSetup()
{
    /*:DOC += <canvas id="game" width="700" height="500"></canvas> */
    
    this.canvas = document.getElementById('game');
    this.ctx = this.canvas.getContext("2d");
    this.gameUi = null;//new tddjs.client.ui.gameUiController();
    this.button = new tddjs.client.ui.button(170,65,"button",ctx);
}

function gameUiTeardown()
{   
    delete this.gameUi;
    delete this.canvas;
    delete this.ctx;
    delete this.button;
}

TestCase("GameUiTest", {
    setUp: gameUiSetup,
    tearDown: gameUiTeardown,
    
    "test gameUi should not be undefined after constructor call": function () {  
        assertObject(this.gameUi);
    },
    
    "test gameUi button": function () {  
        assert(this.button.isCoordOnButton(160,65));
    }
});