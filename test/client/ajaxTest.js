/* 
 *  TestCases for AJAX Facade Stub
 */

TestCase("AjaxFacadeStubTest", {
    setUp: function () {

    }, 
    tearDown: function ()
    {

    },
    
    "test facade should provide a create method to get a xhr object": function () {  
        assertFunction(tddjs.stubs.ajax.create);
        
        var xhr = tddjs.stubs.ajax.create();
        
        assertTrue(xhr instanceof tddjs.stubs.ajax.xmlHttpRequest);
    },
});

