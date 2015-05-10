/* 
 *  Testcases for Ajax Stub
 */

TestCase("AjaxStubTest", {
    setUp: function () {
        this.xhrObject = new tddjs.stubs.ajax();
        //this.ajax = {};
        //this.ajax.create = stubFn(this.xhr);
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
        //this.ajax = {};
        //this.ajax.create = stubFn(this.xhr);
        
        /*
        this.xhrObject = this.ajax.create();
        this.xhrObject.open = stubFn(this.xhrObject.open);
        this.xhrObject.send = stubFn(this.xhrObject.send);
        this.xhrObject.onreadystatechange = stubFn(this.xhrObject.onreadystatechange);
        */
        
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
        assertTrue(this.xhrObject.open.called);
        assertEquals([this.method, this.url, this.async], this.xhrObject.open.args);
        
        this.xhrObject.send();
        assertTrue(this.xhrObject.isOpenCalled());
        assertTrue(this.xhrObject.isSendCalled());
    },
    
    "test if functions are called in correct order and parameters are set correctly --> send before open": function () {  
        this.xhrObject.send();
        assertFalse(this.xhrObject.open.called);
        assertTrue(this.xhrObject.send.called);
        
        this.xhrObject.open(this.method, this.url, this.async);
        assertTrue(this.xhrObject.open.called);
        assertEquals([this.method, this.url, this.async], this.xhrObject.open.args);
    },
    
     "test if functions are called in correct order and parameters are set correctly --> incorrect params": function () {  
        this.xhrObject.open(this.method, this.url);
        assertTrue(this.xhrObject.open.called);
        assertNotEquals([this.method, this.url, this.async], this.xhrObject.open.args);
    },
    
    "test onreadystate should be called when readystate changed": function () {  
        this.xhrObject.setReadyState(2);
        assertTrue(this.xhrObject.onreadystatechange.called);
        
        this.xhrObject.setReadyState(3);
        assertTrue(this.xhrObject.onreadystatechange.called);
    },
    
    "test open and send should change readystate / status": function () { 
        
        this.xhrObject.open(this.method, this.url, this.async)(); 
        
        assertTrue(this.xhrObject.open.called);
        assertEquals(1, this.xhrObject.readyState);
        assertEquals(0, this.xhrObject.status);
        assertTrue(this.xhrObject.onreadystatechange.called);
        
        this.xhrObject.send();
        assertEquals(4, this.xhrObject.readyState);
        assertEquals(200, this.xhrObject.status);
        assertTrue(this.xhrObject.onreadystatechange.called);
    }
    
});

TestCase("AjaxStubPOSTTest", {
    setUp: function () {
        this.xhrObject= new tddjs.stubs.ajax();
        this.url = "/url";
        this.method = "POST";
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
