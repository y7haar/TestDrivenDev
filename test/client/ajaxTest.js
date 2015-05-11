/* 
 *  Testcases for Ajax Stub
 */

TestCase("AjaxStubTest", {
    setUp: function () {
        this.xhrObject = new tddjs.stubs.ajax();
    }, 
    tearDown: function ()
    {
        delete this.xhrObject;
    },
    
    "test xhr object should not be undefined": function () {  
        assertObject(this.xhrObject);
        assertTrue(this.xhrObject instanceof tddjs.stubs.ajax);
    },
    
    "test fake xhr should have all important XMLHttpRequest functions and member attributes": function () {  
        assertFunction(this.xhrObject.open);
        assertFunction(this.xhrObject.onreadystatechange);
        assertFunction(this.xhrObject.send);
        assertFunction(this.xhrObject.setRequestHeader);
        
        assertNotUndefined(this.xhrObject.responseText);
        assertNotUndefined(this.xhrObject.readyState);
        assertNotUndefined(this.xhrObject.status);
    }
});

TestCase("AjaxStubGETTest", {
    setUp: function () {
        this.xhrObject = new tddjs.stubs.ajax();
        
        this.url = "/url";
        this.method = "GET";
        this.async = true;
    }, 
    tearDown: function ()
    {
        delete this.xhr;
    },
    
    "test if functions are called in correct order and parameters are set correctly --> everything is ok": function () {  
        this.xhrObject.open(this.method, this.url, this.async);
        assertTrue(this.xhrObject.isOpenCalled());
        
        var xhrObject = this.xhrObject;
        assertException(function() { xhrObject.open("bla"); }, "Error");
        
        this.xhrObject.send();
        assertTrue(this.xhrObject.isOpenCalled());
        assertTrue(this.xhrObject.isSendCalled());
    },
    
    "test if functions are called in correct order and parameters are set correctly --> send before open": function () {  
        this.xhrObject.send();
        assertFalse(this.xhrObject.isOpenCalled());
        assertTrue(this.xhrObject.isSendCalled());
        
        this.xhrObject.open(this.method, this.url, this.async);
        assertTrue(this.xhrObject.isOpenCalled());
        
        var xhrObject = this.xhrObject;
        assertNoException(function() { xhrObject.open("GET", "/url", true); });
    },
    
     "test if functions are called in correct order and parameters are set correctly --> incorrect params": function () {  
        try
        {
            this.xhrObject.open(this.method, this.url);
            assertTrue(this.xhrObject.isOpenCalled());
        }
        
        catch(e){}
        
        var xhrObject = this.xhrObject;
        assertException(function() { xhrObject.open("bla"); }, "Error");
    },
    
    "test onreadystate should be called when readystate changed": function () {  
        this.xhrObject.setReadyState(2);
        assertTrue(this.xhrObject.isOnreadystatechangeCalled());
        
        this.xhrObject.setReadyState(3);
        assertTrue(this.xhrObject.isOnreadystatechangeCalled());
    },
    
    "test open and send should change readystate / status and set responseText": function () { 
        
        this.xhrObject.open(this.method, this.url, this.async); 
        
        assertTrue(this.xhrObject.isOpenCalled());
        assertEquals(1, this.xhrObject.readyState);
        assertEquals(0, this.xhrObject.status);
        assertTrue(this.xhrObject.isOnreadystatechangeCalled());
        
        this.xhrObject.send();
        assertEquals(4, this.xhrObject.readyState);
        assertEquals(200, this.xhrObject.status);
        assertTrue(this.xhrObject.isOnreadystatechangeCalled());
        
        assertTrue(this.xhrObject.responseText.length > 0);
    }
    
});

TestCase("AjaxStubPOSTTest", {
    setUp: function () {
        this.xhrObject = new tddjs.stubs.ajax();
        
        this.url = "/url";
        this.method = "GET";
        this.async = true;
        
        this.header = "content-type:";
        this.value = "plain/text";

    }, 
    tearDown: function ()
    {
        delete this.xhr;
    },
    
    "test if functions are called in correct order and parameters are set correctly": function () {  
        
    }
});
