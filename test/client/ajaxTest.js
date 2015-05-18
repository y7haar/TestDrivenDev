/* 
 *  TestCases for AJAX Facade Stub
 */

/* 
 *  Testcases for Ajax Stub
 */

TestCase("AjaxFacadeStubTest", {
    setUp: function () {
        this.ajax = new tddjs.stubs.ajax();
    }, 
    tearDown: function ()
    {
        delete this.ajax;
    },
    
    "test ajax object should not be undefined and instanceof ajax": function () {  
        assertObject(this.ajax);
        assertTrue(this.ajax instanceof tddjs.stubs.ajax);
    },
    
    "test ajax facade should hold an instance of xhr object": function () {  
        var xhr = this.ajax.getXmlHttpRequest();
        
        assertObject(xhr);
        assertTrue(xhr instanceof tddjs.stubs.ajax.xmlHttpRequest);
    },
    
    "test ajax facade should have a GET and POST method to perform requests and a method to set / get headers": function () {  
        assertFunction(this.ajax.get);
        assertFunction(this.ajax.post);
        assertFunction(this.ajax.setRequestHeader);
        assertFunction(this.ajax.getRequestHeader);
    },
    
    "test ajax facade should call xhr open method when GET or POST request is called": function () {  
        var xhr = this.ajax.getXmlHttpRequest();
        
        this.ajax.get();
        assertTrue(xhr.isOpenCalled());
        
        this.ajax.post();
        assertTrue(xhr.isOpenCalled());
 
    },
    
    "test ajax facade should call xhr setHeader method and set correct headers if headers are setted": function () {  
        var xhr = this.ajax.getXmlHttpRequest();
        
        this.ajax.setRequestHeader("Content-Type", "text/plain");
        assertTrue(xhr.isSetRequestHeaderCalled());
        assertEquals(this.ajax.getRequestHeader("Content-Type"), xhr.getRequestHeader("Content-Type"));
        
        this.ajax.setRequestHeader("Content-Type", "application/json");
        assertTrue(xhr.isSetRequestHeaderCalled());
        assertEquals(this.ajax.getRequestHeader("Content-Type"), xhr.getRequestHeader("Content-Type"));
 
    }
});

