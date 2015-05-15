/* 
 *  TestCases for AJAX Facade Stub
 */

/* 
 *  Testcases for Ajax Stub
 */

TestCase("AjaxStubTest", {
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
    }
});

