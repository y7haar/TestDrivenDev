/* 
 *  TestCases for AJAX Facade Stub
 */

TestCase("AjaxFacadeStubTest", {
    setUp: function () {

    }, 
    tearDown: function ()
    {

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
});

