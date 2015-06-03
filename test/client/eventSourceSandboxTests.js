/* 
 * Source-code for eventSourceStubTest
 * this code tests the simulation of the EventSource Object 
 */
// to be deleted only for testing



TestCase("eventSourceStubTest", {
    setUp: function () {
        this.url = "someURL";
        this.eventSourceObject = new tddjs.stubs.eventSourceStub(this.url);
    }, 
    tearDown: function ()
    {
        delete this.eventSourceObject;
    },
    
    "test eventSource object should not be undefined": function () {        
    }
});


