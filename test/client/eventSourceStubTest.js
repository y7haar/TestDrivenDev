/* 
 * Source-code for eventSourceStubTest
 * this code simulate the EventSource Object of the browser
 * so it is possible to use it without a server that is responding. 
 */

TestCase("eventSourceStubTest", {
    setUp: function () {
        this.eventSourceObject = new tddjs.stubs.eventSourceStub();
    }, 
    tearDown: function ()
    {
        delete this.eventSourceObject;
    },
    
    "test xhr object should not be undefined": function () {  
        assertObject(this.eventSourceObject);
        assertTrue(this.eventSourceObject instanceof tddjs.stubs.eventSourceStub);
    }
});


