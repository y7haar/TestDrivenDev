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
        //console.log(this.eventSourceObject);
    },
    
    "test onmessage, onerror and onopen function should not be undefined": function () {  
        assertNotUndefined(this.eventSourceObject.onmessage);
        assertNotUndefined(this.eventSourceObject.onerror);
        assertNotUndefined(this.eventSourceObject.onopen);
        //console.log(this.eventSourceObject);
    },
    
     "test constants CONNECTING 0 , OPEN 1 and CLOSED 2 should retrn right values": function () {  
        assertEquals(0,tddjs.stubs.eventSourceStub.CONNECTING);
        assertEquals(1,tddjs.stubs.eventSourceStub.OPEN);
        assertEquals(2,tddjs.stubs.eventSourceStub.CLOSED);
        //console.log(this.eventSourceObject);
    }
   
    
});


