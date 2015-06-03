/* 
 * Source-code for eventSourceSandbox
 * this code tests the simulation of the EventSource object and the communication with the Server
 */


TestCase("eventSourceSandbox", {
    setUp: function () {
        this.realEventSource = EventSource;
        this.realXHR = XMLHttpRequest;
        
        this.sandbox = new tddjs.stubs.eventSourceSandbox();
    }, 
    tearDown: function (){
       this.sandbox = null;
    },    
    "test sandBox object should not be undefined": function () { 
        assertNotUndefined(this.sandbox);
    },
    "test after creating sandbox EvenSource should not be the real one": function () { 
        assertNotEquals(this.realEventSource, EventSource );
    }
    
});


