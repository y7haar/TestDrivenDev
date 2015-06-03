/* 
 * Source-code for eventSourceStubTest
 * this code tests the simulation of the EventSource Object 
 */
// to be deleted only for testing



TestCase("eventSourceSandbox", {
    setUp: function () {
        this.sandbox = new tddjs.stubs.eventSourceSandbox();
    }, 
    tearDown: function (){
       this.sandbox = null;
    },    
    "test sandBox object should not be undefined": function () {        
    }
});


