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
    tearDown: function () {
        this.sandbox.restore();
    },
    "test sandBox object should not be undefined": function () {
        assertNotUndefined(this.sandbox);
    },
    "test after creating sandbox EvenSource should be overriden": function () {
        assertNotEquals(this.realEventSource, EventSource);
    },
    "test restore method shoulde be function": function () {
        assertFunction(this.sandbox.restore);
    },
    "test after calling restore function EventSource should be the real one": function () {
        this.sandbox.restore();
        assertEquals(this.realEventSource, EventSource);
    },
    "test after creating sandbox XHR should be overriden": function () {
        assertNotEquals(this.realXHR, XMLHttpRequest);
    },
    "test after calling restore function XHR should be the real one": function () {
        this.sandbox.restore();      
        assertEquals(this.realXHR, XMLHttpRequest); 
    },
    "test fakeEventSource should throw exception if URL parameter is missing": function () {
        assertException(function(){
            new EventSource();
        },"TypeError");   
        
        assertException(function(){
            new EventSource({url:"aURL"});
        },"TypeError");  
        
        assertNoException(function(){
            new EventSource("/URL");
        });        
    }  

});


