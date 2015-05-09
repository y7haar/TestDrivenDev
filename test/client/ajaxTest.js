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
    
    "test fake xhr should have all important XMLHttpRequest functions": function () {  
        assertFunction(this.xhr.open);
        assertFunction(this.xhr.onreadystatechange);
        assertFunction(this.xhr.send);
        assertFunction(this.xhr.setRequestHeader);
    }
    
});




