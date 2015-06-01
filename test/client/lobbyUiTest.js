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
    
    "test createWrapper should append the content with correct class": function () {  
        /*:DOC content = <div class = "content" id = "content"></div> */
        
        assertEquals("", this.content.innerHTML);
        
        this.lobbyUi.createWrapper();
        
        var wrapper = document.getElementById("lobbyWrapper");
        assertTagName("div", wrapper);
        assertClassName("lobbyWrapper", wrapper);
        
        assertEquals(wrapper, this.content.childNodes[0]);
    }
});
