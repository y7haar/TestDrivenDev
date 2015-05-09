/* 
 *  Testcases for Ajax Stub
 */

TestCase("AjaxStubTest", {
    setUp: function () {
        this.xhr = new tddjs.stubs.ajax();
    }, 
    tearDown: function ()
    {
        delete this.xhr;
    },
    
    "test xhr object should not be undefined": function () {  
        assertObject(this.xhr);
        assertTrue(this.xhr instanceof tddjs.stubs.ajax);
    },
    
    "test fake xhr should have all important XMLHttpRequest functions and member attributes": function () {  
        assertFunction(this.xhr.open);
        assertFunction(this.xhr.onreadystatechange);
        assertFunction(this.xhr.send);
        assertFunction(this.xhr.setRequestHeader);
        
        assertNotUndefined(this.xhr.responseText);
    }
});

TestCase("AjaxStubGETTest", {
    setUp: function () {
        this.xhr = new tddjs.stubs.ajax();
        this.url = "/url";
        this.method = "GET";
        this.async = true;

    }, 
    tearDown: function ()
    {
        delete this.xhr;
    },
    
    "test if functions are called in correct order and parameters are set correctly": function () {  
        var xhr = this.xhr;
        
        assertException(function() { xhr.open(); }, "Error");
        
        assertNoException(function() { xhr.open("GET", "/url", true); });
        assertNoException(function() { xhr.send(); });
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
