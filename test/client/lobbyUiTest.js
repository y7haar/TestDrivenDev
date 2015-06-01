/* 
 *  Test cases for the lobby UI
 */


TestCase("LobbyUiTest", {
    setUp: function () {
        this.lobbyUi = new tddjs.client.ui.lobbyUi();
        
    }, 
    tearDown: function ()
    {
    },
    
    "test lobbyUi should not be undefined after constructor call": function () {  
        assertObject(this.lobbyUi);
    },
    
    "test lobbyUi should have a function to create div wrapper": function () {  
        assertFunction(this.lobbyUi.createWrapper);
    },
    
    // DOM Tests
    
    /*:DOC += <div class = "content" id = "content"></div> */
    "test createWrapper should append the content with correct class": function () {  
        assertEquals("", document.getElementById("content").innerHTML);
        
        this.lobbyUi.createWrapper();
        
        assertNotUndefined(document.getElementById("lobbyWrapper"));
        assertEquals("lobbyWrapper", document.getElementById("lobbyWrapper".className));
    }
});
