/* 
 *  Testcases for Ajax Stub
 */

TestCase("AjaxStubTest", {
    setUp: function () {
        this.xhr = new tddjs.stubs.ajax();
        this.ajax = {};
        this.ajax.create = stubFn(this.xhr);
        this.xhrObject = this.ajax.create();
    }, 
    tearDown: function ()
    {
        delete this.xhr;
    },
    
    "test xhr object should not be undefined": function () {  
        assertObject(this.xhr);
        assertObject(this.ajax.create());
        assertTrue(this.xhr instanceof tddjs.stubs.ajax);
    },
    
    "test fake xhr should have all important XMLHttpRequest functions and member attributes": function () {  
        assertFunction(this.xhr.open);
        assertFunction(this.xhr.onreadystatechange);
        assertFunction(this.xhr.send);
        assertFunction(this.xhr.setRequestHeader);
        
        assertNotUndefined(this.xhr.responseText);
        assertNotUndefined(this.xhr.readyState);
        assertNotUndefined(this.xhr.status);
    }
});

TestCase("AjaxStubGETTest", {
    setUp: function () {
        this.xhr = new tddjs.stubs.ajax();
        this.ajax = {};
        this.ajax.create = stubFn(this.xhr);
        this.xhrObject = this.ajax.create();
        
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
        assertTrue(this.xhrObject.open.called);
        assertTrue(this.xhrObject.send.called);
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
    }
    
});

TestCase("AjaxStubPOSTTest", {
    setUp: function () {
        this.xhr = new tddjs.stubs.ajax();
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
