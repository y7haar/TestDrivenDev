/* 
 *  TestCases for AJAX Facade Stub
 */

TestCase("AjaxFacadeStubTest", {
    setUp: function () {
        var ajax = tddjs.stubs.ajax;
        
        this.ajaxCreate = ajax.create;
        this.xhrStub = new ajax.xmlHttpRequest();
        ajax.create = stubFn(this.xhrStub);


    }, 
    tearDown: function ()
    {
        var ajax = tddjs.stubs.ajax;
        ajax.create = this.ajaxCreate;
    },
    
    "test facade should provide a create method to get a xhr object with important functions": function () {  
        assertFunction(tddjs.stubs.ajax.create);
        var xhr = tddjs.stubs.ajax.create();
        
        assertFunction(xhr.open);
        assertFunction(xhr.send);
        assertFunction(xhr.setRequestHeader);
    },
    
    "test facade should provide a method to perform a get request and url must be setted": function () {  
        assertFunction(tddjs.stubs.ajax.get);
        assertException (function() {tddjs.stubs.ajax.get(); }, "TypeError");
        
        assertNoException (function() {tddjs.stubs.ajax.get("/url"); });
    },
    
    "test facade should provide a method to perform a post request and url must be setted": function () {  
        assertFunction(tddjs.stubs.ajax.post);
        assertException (function() {tddjs.stubs.ajax.post(); }, "TypeError");
        
        assertNoException (function() {tddjs.stubs.ajax.post("/url"); });
    },
    
    "test get and post method should call xhr create method and request method in facade": function () {  
        var ajax = tddjs.stubs.ajax;
        
        ajax.get("/url");
        assertTrue(ajax.create.called);
//        assertTrue(ajax.request.called);
//        assertEquals(ajax.get.args, ajax.request.args);

        ajax.post("/url");
        assertTrue(ajax.create.called);
//        assertTrue(ajax.request.called);
//        assertEquals(ajax.post.args, ajax.request.args);
        
    },
    
    "test request should throw Exception if parameter are invalid": function () {  
        var ajax = tddjs.stubs.ajax;
        
        assertException(function() { ajax.request(2); }, "TypeError");
        assertNoException(function() { ajax.request("/url"); } );
    },
    
     "test request should call xhr open method with correct parameters": function () {  
        var ajax = tddjs.stubs.ajax;
        
        var options = {
            method: "GET"
        };
        
        ajax.request("/url", options);
        assertTrue(this.xhrStub.isOpenCalled());
        assertEquals(["GET", "/url", true], this.xhrStub.openArgs);
        
        var options = {
            method: "POST"
        };
        
        ajax.request("/url2", options);
        assertEquals(["POST", "/url2", true], this.xhrStub.openArgs);
    }
});

