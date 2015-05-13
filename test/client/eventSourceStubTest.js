/* 
 * Source-code for eventSourceStubTest
 * this code tests the simulation of the EventSource Object 
 */
// to be deleted only for testing
        console.log("_______________________");
        var test = new EventSource("someURL1");     
        console.log(test);        
        console.log("___________________");


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
    },
    
    "test onmessage, onerror and onopen should not be undefined but null": function () {  
        assertNotUndefined(this.eventSourceObject.onmessage);
        assertNotUndefined(this.eventSourceObject.onerror);
        assertNotUndefined(this.eventSourceObject.onopen);
        
        assertEquals(null, this.eventSourceObject.onmessage);
        assertEquals(null, this.eventSourceObject.onerror);
        assertEquals(null, this.eventSourceObject.onopen);
    },
    
    "test constants CONNECTING 0 , OPEN 1 and CLOSED 2 should retrn right values": function () {  
        assertEquals(0,tddjs.stubs.eventSourceStub.CONNECTING);
        assertEquals(1,tddjs.stubs.eventSourceStub.OPEN);
        assertEquals(2,tddjs.stubs.eventSourceStub.CLOSED);
    },
    "test eventSource shoulde have addEventListner function": function () {  
        
        assertNotUndefined(this.eventSourceObject.addEventListner);
    },
    "test addEventListner shoulde add new eventListner": function () {  
        
        this.eventSourceObject.addEventListner("newEvent", function(e){           
            
        },false);
    }
    
});


