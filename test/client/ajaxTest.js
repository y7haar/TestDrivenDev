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
});

