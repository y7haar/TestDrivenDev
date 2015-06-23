/* 
 * Source-code for eventSourceSandbox
 * this code tests the simulation of the EventSource object and the communication with the Server
 */

TestCase("eventSourceSandboxOvverride", {
    setUp: function () {
        this.realEventSource = EventSource;     
        this.realXHR = XMLHttpRequest;
   
        this.sandbox = new tddjs.stubs.eventSourceSandbox();      
    },
    tearDown: function () {
        this.sandbox.restore();
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
    }
});

TestCase("eventSourceSandbox", {
    setUp: function () {
        this.server1URL = "/server_1Url";
        this.sandbox = new tddjs.stubs.eventSourceSandbox();
    },
    tearDown: function () {
        this.sandbox.restore();
    },
    "test sandbox object should not be undefined": function () {
        assertNotUndefined(this.sandbox);
    },
    "test sandBox.update method should be a function ": function () {
        assertFunction(this.sandbox.update);
    },
    "test sandbox should hold bool handleResponse":function(){
       assertNotUndefined(this.sandbox.handleResponse);
    },
    "test sandbox.setHandleResponse should be a function":function(){
       assertFunction(this.sandbox.setHandleResponse);
    },
    "test sandbox.setHandleResponse should expect Bool as paramter":function(){
       var sandbox = this.sandbox;
       assertException(function(){
           sandbox.setHandleResponse(null);
       },"TypeError");
       
       assertException(function(){
           sandbox.setHandleResponse("true");
       },"TypeError");
       assertNoException(function(){
           sandbox.setHandleResponse(true);
       });           
    },
    "test sandbox.handleResponse should be true at init":function(){
        assertTrue(this.sandbox.handleResponse);
    },
    "test sandbox.setHandleResponse set handleResponse to false":function(){
        this.sandbox.setHandleResponse(false);
        assertFalse(this.sandbox.handleResponse);
    },
    "test sandbox shoulde have a object that hold all servers": function () {
        assertNotUndefined(this.sandbox.server);
    },
    "test sandbox servers property shoulde be empty at start": function () {
        assertEquals({}, this.sandbox.server);
    },
    "test sandbox addServer method should be function": function () {
        assertFunction(this.sandbox.addServer);
    },
    "test sandbox addServer shoulde throw exception if url parameter is wrong or missing": function () {
        var sandbox = this.sandbox;

        assertException(function () {
            sandbox.addServer();
        }, "TypeError");

        assertException(function () {
            sandbox.addServer({server: "aServer"});
        }, "TypeError");

        assertNoException(function () {
            sandbox.addServer("/serverUrl");
        });
    },
    "test sandbox addServer should add a fakeServer": function () {
        assertEquals({}, this.sandbox.server);
        this.sandbox.addServer(this.server1URL);
        var fakeServer = this.sandbox.server[this.server1URL];

        assertNotUndefined(fakeServer);
        assertEquals({"/server_1Url": fakeServer}, this.sandbox.server);
    }
});

TestCase("eventSourceSandboxServer", {
    setUp: function () {
        this.server1URL = "/server_1Url";
        this.sandbox = new tddjs.stubs.eventSourceSandbox();  
        this.sandbox.addServer(this.server1URL);
    },
    tearDown: function () {
        this.sandbox.restore();
    },
   
    "test sandbox server shoulde have a array of connected clients": function () {
        assertNotUndefined(this.sandbox.server[this.server1URL].clients);
    },    
    "test sandbox server.clients should be empty ": function () {
        assertEquals(0, this.sandbox.server[this.server1URL].clients.length);
        assertEquals([], this.sandbox.server[this.server1URL].clients);
    },
    "test sandbox server should have a client if EventSource object is created with this serverUrl as source": function () {
        var es = new EventSource(this.server1URL);
        assertEquals(1, this.sandbox.server[this.server1URL].clients.length);
        assertEquals(es, this.sandbox.server[this.server1URL].clients[0]);
    },
    "test sandbox server should be empty if EventSource object is created with worng serverUrl": function () {
        var es = new EventSource("/worngServerUrl");
        assertEquals(0, this.sandbox.server[this.server1URL].clients.length);
    },
    "test sandbox should be able to have 2 fakeServer running independently": function () {
        var server2Url = "/server_2Url";
        this.sandbox.addServer(server2Url);
        
        assertNotUndefined(this.sandbox.server[this.server1URL]);
        assertNotUndefined(this.sandbox.server[server2Url]);
        
        assertEquals(0, this.sandbox.server[this.server1URL].clients.length);
        assertEquals(0, this.sandbox.server[server2Url].clients.length);        
        
        var es1 = new EventSource(this.server1URL);        
        assertEquals(1, this.sandbox.server[this.server1URL].clients.length);
        assertEquals(es1, this.sandbox.server[this.server1URL].clients[0]);
        assertEquals(0, this.sandbox.server[server2Url].clients.length);
        
        var es2 = new EventSource(server2Url);        
        assertEquals(1, this.sandbox.server[this.server1URL].clients.length);
        assertEquals(es1, this.sandbox.server[this.server1URL].clients[0]);
        assertEquals(1, this.sandbox.server[server2Url].clients.length);
        assertEquals(es2, this.sandbox.server[server2Url].clients[0]);
    },
    "test sandbox.server sendMessage method should be a function": function () {
        assertFunction(this.sandbox.server[this.server1URL].sendMessage);
    },
    "test sandbox.server sendMessage throw exception if paramter is wrong": function () {
        var sandbox = this.sandbox;
        var url = this.server1URL;
        var es = EventSource(this.server1URL);        
        
        // prameter1 is the index of the client that should be messaged
        // parameter2 should be sting of the event or null
        // parameter3 shoulde be object with atleast date property
        
        // if there is no client with give index --> exception
        // if client dont have given eventName --> exception
        
        assertException(function(){
            sandbox.server[url].sendMessage();
        } ,"TypeError");
        
        // wrong Client
        assertException(function(){
            sandbox.server[url].sendMessage({client:0},"message",{data:"helloWorld"});
        } ,"TypeError");
        
        assertException(function(){
            sandbox.server[url].sendMessage(0,{eventName:"message"},{data:"helloWorld"});
        } ,"TypeError");
        
         assertException(function(){
            sandbox.server[url].sendMessage(300,null,{data:null});
        } ,"Error");
        // wrong message
        assertException(function(){
            sandbox.server[url].sendMessage(0,"message","");
        } ,"TypeError");
        
        assertException(function(){
            sandbox.server[url].sendMessage(0, "message",{information:"helloWorld"});
        } ,"TypeError");
        // wrong eventName
        assertException(function(){
            sandbox.server[url].sendMessage(0,"EventThatDontExist",{data:null});
        } ,"Error");

       
    }, 
    "test sandbox.server sendMessage should call specific event of client": function () {
         var es = new EventSource(this.server1URL);
         var called = false;
         var msg;
         
         var testEvent = function(e){
             called = true;
             msg = e.data;
         };
 
         var sendMsg = "HELLOWORLD";
         es.addEventListener("test", testEvent);                
         this.sandbox.server[this.server1URL].sendMessage(0,"test",{data:sendMsg});
         
         assertTrue(called);
         assertEquals(msg, sendMsg);
    },
    
    "test sandbox.server sendMessage should call onMessage event of client if eventName is null": function () {
        
         var es = new EventSource(this.server1URL);
         
         var calledTestEvent = false;         
         var testEvent = function(e){
             calledTestEvent = true;
         };
         
         var calledMessageEvent = false;         
         var onMessage = function(e){
             calledMessageEvent = true;
         };
 
         var sendMsg = "HELLOWORLD";
         es.addEventListener("test", testEvent); 
         es.addEventListener("Message" ,onMessage);
         
         this.sandbox.server[this.server1URL].sendMessage(0,null,{data:sendMsg});
         
         assertFalse(calledTestEvent);
         assertTrue(calledMessageEvent);             
    },
    "test sandbox.server should implement sendMessageToAll function": function () {
        assertFunction(this.sandbox.server[this.server1URL].sendMessageToAll);
    },    
    "test sandbox.server sendMessageToAll should call every connected Client": function () {
        var es1 = new EventSource(this.server1URL);
        var es2 = new EventSource(this.server1URL);
        var es3 = new EventSource(this.server1URL);   
        
        
        var es1_called = false;
        var es1_event = function(e){
            es1_called = true;
        };
        es1.addEventListener("test", es1_event);
        
        var es2_called = false;
        var es2_event = function(e){
            es2_called = true;
        };
        es2.addEventListener("test", es2_event);
        
        var es3_called = false;
        var es3_event = function(e){
            es3_called = true;
        };
        es3.addEventListener("test", es3_event);
        
        
        var notConnectedES = new EventSource("/wrongUrl");
        var notConnectedES_called = false;
        var notConnectedES_event = function(e){
            notConnectedES_called = true;
        };
        notConnectedES.addEventListener("test", notConnectedES_event);
        
        assertFalse(es1_called);
        assertFalse(es2_called);
        assertFalse(es3_called);
        assertFalse(notConnectedES_called);        

        this.sandbox.server[this.server1URL].sendMessageToAll('test',{data:"HELLOWORLD"});
        
        assertTrue(es1_called);
        assertTrue(es2_called);
        assertTrue(es3_called);
        assertFalse(notConnectedES_called);
    },
    "test sandbox.server should hold a array of all requests the server recived": function(){
        assertNotUndefined(this.sandbox.server[this.server1URL].requests);
    },
    "test sandbox.server requets should hold all requests at start 0": function(){
        assertEquals(0,this.sandbox.server[this.server1URL].requests.length);
    },
    "test sandbox.server requets should have 1 entry after a ajax request to server, sandbox.upgrade should upgrade all servers": function(){
        var es = new EventSource(this.server1URL);
        var ajax = tddjs.util.ajax;
        var succesCalled = false;      
        var failureCalled = false;
        var onSuccesEvent = function ()
        {
            succesCalled = true;
        };
        var onFailureEvent = function()
        {
            failureCalled = true;
        };
        var options = {
            headers: {
                "Accept": "text/event-stream"
            },
            onSuccess: onSuccesEvent,
            onFailure: onFailureEvent
        };
        
        assertEquals(1,this.sandbox.server[this.server1URL].requests.length);        
        ajax.post(this.server1URL, options);        
        assertEquals(1,this.sandbox.server[this.server1URL].requests.length);
        
        assertFalse(succesCalled);
        assertFalse(failureCalled);
        
        this.sandbox.update();
        assertEquals(2,this.sandbox.server[this.server1URL].requests.length);
        
        assertTrue(succesCalled);
        assertFalse(failureCalled);
    },
    "test sandbox.server requets with wrong url should not be added": function(){
        var es = new EventSource(this.server1URL);
        var ajax = tddjs.util.ajax;
        var succesCalled = false;      
        var failureCalled = false;
        var onSuccesEvent = function ()
        {
            succesCalled = true;
        };
        var onFailureEvent = function()
        {
            failureCalled = true;
        };
        var options = {
            headers: {
                "Accept": "text/event-stream"
            },
            onSuccess: onSuccesEvent,
            onFailure: onFailureEvent
        };
        
        assertEquals(1,this.sandbox.server[this.server1URL].requests.length);
        
        ajax.post("wrongURL", options);       
        assertFalse(succesCalled); 
        assertFalse(failureCalled);
        
        this.sandbox.update();
        assertEquals(1,this.sandbox.server[this.server1URL].requests.length);
        assertTrue(failureCalled);
        assertFalse(succesCalled);
    },
    "test sandbox.update should add requests but not add same requests at second call": function(){
        var es = new EventSource(this.server1URL);
        var ajax = tddjs.util.ajax;
    
        var options = {
            headers: {
                "Accept": "text/event-stream"
            },
            onSuccess: null,
            onFailure: null
        }; 
        ajax.post(this.server1URL, options);
        assertEquals(1,this.sandbox.server[this.server1URL].requests.length);
        this.sandbox.update();
        assertEquals(2,this.sandbox.server[this.server1URL].requests.length);
        this.sandbox.update();
        assertEquals(2,this.sandbox.server[this.server1URL].requests.length);        
    },
    "test sandbox.server should implement closeConnection function": function(){     
        assertFunction(this.sandbox.server[this.server1URL].closeConnection);        
    },
    "test sandbox.server closeConnection throw exception if parameter is wrong": function(){        
        var sandbox = this.sandbox;
        var url = this.server1URL;
        var wrongES = new EventSource("wrongURL");       
        assertException(function(){
            sandbox.server[url].closeConnection();
        },"TypeError");
        
        assertException(function(){
            sandbox.server[url].closeConnection("client1");
        },"TypeError");
        
        assertException(function(){
            sandbox.server[url].closeConnection({client:0});
        },"TypeError");
        
        assertException(function(){
            sandbox.server[url].closeConnection(100);
        },"Error");
        
        assertException(function(){
            sandbox.server[url].closeConnection(wrongES);
        },"Error");
    },
    "test sandbox.server closeConnection should close connection of a Client with index": function(){
        var es = new EventSource(this.server1URL);
        assertEquals(1,es.readyState);
     
        assertEquals(1,this.sandbox.server[this.server1URL].clients.length); 
        this.sandbox.server[this.server1URL].closeConnection(0);
        assertEquals(0,this.sandbox.server[this.server1URL].clients.length);
        
        assertEquals(2,es.readyState);
    },
    "test sandbox.server closeConnection should close connection of a Client with object": function(){
        var es = new EventSource(this.server1URL);      
        assertEquals(1,this.sandbox.server[this.server1URL].clients.length); 
        this.sandbox.server[this.server1URL].closeConnection(es);
        assertEquals(0,this.sandbox.server[this.server1URL].clients.length);
    },
    "test after calling server.closeConnection Closed Client readyState should be 2": function(){
        var es = new EventSource(this.server1URL);
        assertEquals(1,es.readyState);
        this.sandbox.server[this.server1URL].closeConnection(es);
        assertEquals(2,es.readyState);        
    },
    "test server.closeConnection should not effect other Connections": function(){
        var es1 = new EventSource(this.server1URL);
        var es2 = new EventSource(this.server1URL);
        var es3 = new EventSource(this.server1URL);
        
        assertEquals(es1, this.sandbox.server[this.server1URL].clients[0]);
        assertEquals(es2, this.sandbox.server[this.server1URL].clients[1]);
        assertEquals(es3, this.sandbox.server[this.server1URL].clients[2]);
        
        this.sandbox.server[this.server1URL].closeConnection(1);
        
        assertEquals(es1, this.sandbox.server[this.server1URL].clients[0]);
        assertEquals(es3, this.sandbox.server[this.server1URL].clients[1]);        
    },
    "test server should implement closeAllConnections function": function(){
        assertFunction(this.sandbox.server[this.server1URL].closeAllConnections);
        
    },
    "test server.closeAllConnections should close all Connections": function(){
        assertEquals(0,this.sandbox.server[this.server1URL].clients.length);
        var es1 = new EventSource(this.server1URL);
        var es2 = new EventSource(this.server1URL);
        var es3 = new EventSource(this.server1URL);
        
        assertEquals(3,this.sandbox.server[this.server1URL].clients.length);
        this.sandbox.server[this.server1URL].closeAllConnections();
        assertEquals(0,this.sandbox.server[this.server1URL].clients.length); 
    },
    "test server.closeAllConnections after calling all Clients should have readyState 2": function(){
        var es1 = new EventSource(this.server1URL);
        var es2 = new EventSource(this.server1URL);
        var es3 = new EventSource(this.server1URL);
   
        this.sandbox.server[this.server1URL].closeAllConnections();
        
        assertEquals(2,es1.readyState);
        assertEquals(2,es2.readyState);
        assertEquals(2,es3.readyState);
    }
    
});

TestCase("eventSourceSandboxFakeEventSource", {
    setUp: function () {
        this.realEventSource = EventSource;     
        this.realXHR = XMLHttpRequest;
        
        this.serverURL = "/serverURL";
        this.sandbox = new tddjs.stubs.eventSourceSandbox();
        this.sandbox.addServer(this.serverURL);
        
        this.fakeEventSource = new EventSource(this.serverURL);
        this.fakeXHR = tddjs.util.ajax;
    },
    tearDown: function () {
        this.sandbox.restore();
        this.sandbox = null;
    }, 

    "test fakeEventSource url shoulde not be undefined ": function () {
        assertNotUndefined(this.fakeEventSource.url);
    },
    "test fakeEventSource should throw exception if URL parameter is missing": function () {
        assertException(function(){
            new EventSource();
        },"TypeError");   
        
        assertException(function(){
            new EventSource({url:"aURL"});
        },"TypeError");  
        
        assertNoException(function(){
            new EventSource("/serverURL");
        });        
    },
    "test fakeEventSource url shoulde return the url of the connected server": function () {
        assertEquals(this.serverURL, this.fakeEventSource.url);
    },
    "test fakeEventSourceonerror onmessage onopen events should not be undefined": function () {
        assertNotUndefined(this.fakeEventSource.onerror);
        assertNotUndefined(this.fakeEventSource.onmessage);
        assertNotUndefined(this.fakeEventSource.onopen);
    },
    "test fakeEventSource shoulde implement addEventListener function": function () {
        assertFunction(this.fakeEventSource.addEventListener);
    },
    "test fakeEventSource.addEventListener should throw exception if parameter is wrong": function () {
        var fakeES = this.fakeEventSource;
        // parameter 1: EventListner Name, parameter2 : function
        assertException(function(){
            fakeES.addEventListener();
        },"TypeError");
        
        assertException(function(){
            fakeES.addEventListener("eventName");
        },"TypeError");  
        
        assertException(function(){
            fakeES.addEventListener("eventName", "doSomething");
        },"TypeError");
        
        assertException(function(){
            fakeES.addEventListener({name:"aName"}, "doSomething");
        },"TypeError");  
        
        assertNoException(function(){
            fakeES.addEventListener("eventName", function(){});
        });  
    },
    "test fakeEventSource.addEventListener should add new EventListner": function () {
         var eventName = "eventName";
         var aFunction = function (){
           return true;  
         };
         
         this.fakeEventSource.addEventListener(eventName, aFunction);
         assertEquals(aFunction, this.fakeEventSource["on"+eventName.toLowerCase()]);
         assertEquals(aFunction(), this.fakeEventSource["on"+eventName.toLowerCase()]());  
     },
    "test fakeEventSource should hold readyState property": function () {
        assertNotUndefined(this.fakeEventSource.readyState);
    },
    "test fakeEventSource.readyState should be 1 after creating": function () {
         assertEquals(1,this.fakeEventSource.readyState);
    },
    "test fakeEventSource.readyState should be 2 after creating if url is wrong": function () {
         var wrongES = new EventSource("wrongURL");
         assertEquals(2,wrongES.readyState);
    },
    "test fakeEventSource should have close function": function () {
        assertFunction(this.fakeEventSource.close);
    },
    "test fakeEventSource should be able to close connection to server": function () {
        assertEquals(1, this.sandbox.server[this.serverURL].clients.length);
        assertEquals(this.fakeEventSource, this.sandbox.server[this.serverURL].clients[0]);
        
        this.fakeEventSource.close();
        
        assertEquals(0, this.sandbox.server[this.serverURL].clients);
        assertNotEquals(this.fakeEventSource, this.sandbox.server[this.serverURL].clients[0]);        
    },
    "test fakeEventSource readyState should be 2 after closing connection": function () {
        this.fakeEventSource.close();
        assertEquals(2, this.fakeEventSource.readyState);
    },
    "test fakeEventSource closing conenction should not effect other EventSource connections": function () {
        var secondES = new EventSource(this.serverURL);
        assertEquals(1, secondES.readyState);
        
        assertEquals(2, this.sandbox.server[this.serverURL].clients.length);
        assertEquals(secondES,this.sandbox.server[this.serverURL].clients[1]);   
        assertEquals(this.fakeEventSource,this.sandbox.server[this.serverURL].clients[0]);
        
        this.fakeEventSource.close();
        
        assertEquals(1, this.sandbox.server[this.serverURL].clients.length);
        assertEquals(secondES,this.sandbox.server[this.serverURL].clients[0]);
        assertEquals(1,secondES.readyState);
    },
    "test fakeEventSource should hold boolean named withCredentials": function () {
        assertNotUndefined(this.fakeEventSource.withCredentials);
        assertEquals("boolean",typeof this.fakeEventSource.withCredentials );
    },
    "test fakeEventSource should throw exception if Credentials parameter is not boolean": function () {
        assertException(function(){
            var es = new EventSource("someUrl", "YES");
        },"TypeError");        
        assertException(function(){
            var es = new EventSource("someUrl", null);
        },"TypeError");        
    },
    "test fakeEventSource should not throw exception if Credentials is not given": function () {
        assertNoException(function(){
            var es = new EventSource("someUrl");
        });  
    },
    
    "test fakeEventSource withCredentials should be setted with 'constructor'": function () {
        var es = new EventSource("someUrl", {withCredentials:true});
        assertTrue(es.withCredentials);
        
        var es2 = new EventSource("someUrl", {withCredentials:false});
        assertFalse(es2.withCredentials);
    },
    "test fakeEventSource should be false if not setted via 'constructor' ": function () {
        var es = new EventSource("someUrl"); 
        assertFalse(es.withCredentials);
    }    
  
});

