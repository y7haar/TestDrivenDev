/* 
 * Source-code for eventSourceStubTest
 * this code tests the simulation of the EventSource Object 
 */

TestCase("eventSourceStubTest", {
    setUp: function () {
        this.eventSourceObject = new tddjs.stubs.eventSourceStub();
    }, 
    tearDown: function ()
    {
        delete this.eventSourceObject;
    },
    
    "test eventSource object should not be undefined": function () {  
        assertObject(this.eventSourceObject);
        assertTrue(this.eventSourceObject instanceof tddjs.stubs.eventSourceStub);
    }
});


