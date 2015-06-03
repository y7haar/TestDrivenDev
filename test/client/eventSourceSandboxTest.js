/* 
 * Source-code for eventSourceSandbox
 * this code tests the simulation of the EventSource object and the communication with the Server
 */
console.log(new EventSource("/fakeURL"));

TestCase("eventSourceSandbox", {
    setUp: function () {
        this.realEventSource = EventSource;     
        this.realXHR = XMLHttpRequest;
        this.sandbox = new tddjs.stubs.eventSourceSandbox();
        
        this.serverURL = "/serverURL";
        this.fakeEventSource = new EventSource(this.serverURL);
        this.fakeXHR = tddjs.util.ajax;
    },
    tearDown: function () {
        this.sandbox.restore();
    },   
    "test sandbox object should not be undefined": function () {
        assertNotUndefined(this.sandbox);
    },
    "test sandbox getServerUrl should be a function": function () {
        assertFunction(this.sandbox.getServerUrl);
    },
    "test sandBox getServerUrl should return URL of the sandbox ": function () {
        assertEquals(this.serverURL, this.sandbox.getServerUrl());
    },
    "test after creating sandbox-Object EvenSource should be overriden": function () {
        assertNotEquals(this.realEventSource, EventSource);
    },
    "test sandbox.restore method should be a function": function () {
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
    "test sandBox.update method should be a function ": function () {
        assertFunction(this.sandbox.update);
    },
    "test sandbox.update": function(){
        assertTrue(false);
        this.sandbox.update();
    },
    "test sandbox dispatchClientEvent method should be a function": function(){
        assertFunction(this.sandbox.dispatchClientEvent);
    },
    "test sandbox.dispatchClientEvent throw exception if paramter is wrong": function(){
        var sandbox = this.sandbox;
        var msgObj = {"msg":"HELLLOWORLD"};
        
        assertException(function(){
            sandbox.dispatchClientEvent();
        },"TypeError");
        
        assertException(function(){
            sandbox.dispatchClientEvent("onerror");
        },"TypeError");
        
        assertException(function(){
            sandbox.dispatchClientEvent(msgObj);
        },"TypeError");
        
        assertNoException(function(){
            sandbox.dispatchClientEvent(null,msgObj);
        });
        
        assertNoException(function(){
            sandbox.dispatchClientEvent("onerror",msgObj);
        });
        
    },
    "test sandbox.dispatchClientEvent throw exception if eventName parameter is not null and event dont exists": function(){
        var sandbox = this.sandbox;
        var msgObj = {"msg":"HELLLOWORLD"};
        
        assertException(function(){
            sandbox.dispatchClientEvent("notAEventName",msgObj);
        },"Error");
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
    },
    "test fakeEventSource url shoulde not be undefined ": function () {
        assertNotUndefined(this.fakeEventSource.url);
    },
    "test fakeEventSource url shoulde return the url of the connected server": function () {
        assertEquals(this.serverURL, this.fakeEventSource.url);
    },
    "test fakeEventSourceonerror onmessage onopen events should not be undefined": function () {
        assertNotUndefined(this.fakeEventSource.onerror);
        assertNotUndefined(this.fakeEventSource.onmessage);
        assertNotUndefined(this.fakeEventSource.onopen);
    },
    "test fakeEventSource shoulde implement addEventListner function": function () {
        assertFunction(this.fakeEventSource.addEventListner);
    },
    "test fakeEventSource.addEventListner should throw exception if parameter is wrong": function () {
        var fakeES = this.fakeEventSource;
        // parameter 1: EventListner Name, parameter2 : function
        assertException(function(){
            fakeES.addEventListner();
        },"TypeError");
        
        assertException(function(){
            fakeES.addEventListner("eventName");
        },"TypeError");  
        
        assertException(function(){
            fakeES.addEventListner("eventName", "doSomething");
        },"TypeError");
        
        assertException(function(){
            fakeES.addEventListner({name:"aName"}, "doSomething");
        },"TypeError");  
        
        assertNoException(function(){
            fakeES.addEventListner("eventName", function(){});
        });  
    },
     "test fakeEventSource.addEventListner should add new EventListner": function () {
         var eventName = "eventName";
         var aFunction = function (){
           return true;  
         };
         
         this.fakeEventSource.addEventListner(eventName, aFunction);
         assertEquals(aFunction, this.fakeEventSource["on"+eventName.toLowerCase()]);
         assertEquals(aFunction(), this.fakeEventSource["on"+eventName.toLowerCase()]());  
     }
    
    

});


