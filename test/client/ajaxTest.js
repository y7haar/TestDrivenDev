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
    
    "test get and post method should call xhr create method": function () {  
        var ajax = tddjs.stubs.ajax;
        
        ajax.get("/url");
        assertTrue(ajax.create.called);

        ajax.post("/url");
        assertTrue(ajax.create.called);
    },
    
    "test request should throw Exception if parameter are invalid": function () {  
        var ajax = tddjs.stubs.ajax;
        
        assertException(function() { ajax.request(2); }, "TypeError");
        assertNoException(function() { ajax.request("/url"); } );
    },
    
     "test request should call xhr open method with correct parameters and send method with data if data is provided": function () {  
        var ajax = tddjs.stubs.ajax;
        
        var options = {
            method: "GET"
        };
        
        ajax.request("/url", options);
        assertTrue(this.xhrStub.isOpenCalled());
        assertEquals(["GET", "/url", true], this.xhrStub.openArgs);
        assertTrue(this.xhrStub.isSendCalled());
        assertEquals([null], this.xhrStub.sendArgs);
        
        var options = {
            method: "POST",
            data: "BigData"
        };
        
        ajax.request("/url2", options);
        assertEquals(["POST", "/url2", true], this.xhrStub.openArgs);
        assertTrue(this.xhrStub.isSendCalled());
        assertEquals(["BigData"], this.xhrStub.sendArgs);
    },
    
    "test get method should call open / send method in xhr with correct params": function () {  
        var ajax = tddjs.stubs.ajax;
        
        ajax.get("/niceUrl");
        
        assertTrue(this.xhrStub.isOpenCalled());
        assertEquals(["GET", "/niceUrl", true], this.xhrStub.openArgs);
        assertTrue(this.xhrStub.isSendCalled());
        assertEquals([null], this.xhrStub.sendArgs);
    },
    
     "test post method should call open / send method in xhr with correct params": function () {  
        var ajax = tddjs.stubs.ajax;
        
        ajax.post("/url", { data: "SomeData" } );
        
        assertTrue(this.xhrStub.isOpenCalled());
        assertEquals(["POST", "/url", true], this.xhrStub.openArgs);
        assertTrue(this.xhrStub.isSendCalled());
        assertEquals(["SomeData"], this.xhrStub.sendArgs);
    },
    
     "test ajax facade should set headers correctly on get / post in xhr object": function () {  
        var ajax = tddjs.stubs.ajax;
        
        var options = {
            headers:{
                "Accept-Charset": "utf-8"
            }    
        };
        
        ajax.get("/url", options);
        assertEquals("utf-8", this.xhrStub.getRequestHeader("Accept-Charset"));
        
        
         var options = {
            headers:{
                "Content-Type": "application/json"
            },
            data: "data"
        };
        
        ajax.post("/url", options);
        assertEquals("application/json", this.xhrStub.getRequestHeader("Content-Type"));
    },
    
    "test ajax facade should be able to set multiple headers": function () {  
        var ajax = tddjs.stubs.ajax;
        
         var options = {
            headers:{
                "Content-Type": "application/json",
                "Content-Length": "348"
            },
            data: "data"
        };
        
        ajax.post("/url", options);
        assertEquals("application/json", this.xhrStub.getRequestHeader("Content-Type"));
        assertEquals("348", this.xhrStub.getRequestHeader("Content-Length"));
    },
    
    "test ajax facade should now call given method on onreadystatechange on get / post after success": function () {  
        var ajax = tddjs.stubs.ajax;
        
        var options = {
            onSuccess: stubFn()
        };
        
        ajax.get("/url", options);
        assertTrue(options.onSuccess.called);
        assertEquals(4, this.xhrStub.readyState);
        assertEquals(200, this.xhrStub.status);
        
        ajax.post("/url", options);
        assertTrue(options.onSuccess.called);
        assertEquals(4, this.xhrStub.readyState);
        assertEquals(200, this.xhrStub.status);
    }
});

