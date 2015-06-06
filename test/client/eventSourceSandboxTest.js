/* 
 * Source-code for eventSourceSandbox
 * this code tests the simulation of the EventSource object and the communication with the Server
 */
console.log(new EventSource("/fakeURL"));

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
    "test sandbox.update should update all servers": function () {
        assertTrue(false);
        this.sandbox.update();
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
        
        // prameter1 is the index of the client that should be messaged
        // parameter2 should be sting of the event or null
        // parameter3 shoulde be object with atleast date property
        
        assertException(function(){
            sandbox.server[url].sendMessage();
        } ,"TypeError");
        
        assertException(function(){
            sandbox.server[url].sendMessage({client:1},"onmessage",{data:"helloWorld"});
        } ,"TypeError");
        
        assertException(function(){
            sandbox.server[url].sendMessage(1,{eventName:"onmessage"},{data:"helloWorld"});
        } ,"TypeError");
        
        assertException(function(){
            sandbox.server[url].sendMessage(1,"onmessage","");
        } ,"TypeError");
        
        assertException(function(){
            sandbox.server[url].sendMessage(1, "onmessage",{information:"helloWorld"});
        } ,"TypeError");
        
        assertNoException(function(){
            sandbox.server[url].sendMessage(1,"onmessage",{data:"helloWorld"});
        });
        
        assertNoException(function(){
            sandbox.server[url].sendMessage(1,null,{data:null});
        });

    },
    "test sandbox.server sendMessage throw exception if eventName parameter is not null and event dont exists": function () {
        var sandbox = this.sandbox;
        var url = this.server1URL;
        
        assertException(function(){
            sandbox.server[url].sendMessage(0,"EventThatDontExist",{data:null});
        } ,"Error");
    },
    "test sandbox.server sendMessage throw exception if index of client dont exists": function () {
        var sandbox = this.sandbox;
        var url = this.server1URL;
        
        assertException(function(){
            sandbox.server[url].sendMessage(300,null,{data:null});
        } ,"Error");
    }
});

TestCase("eventSourceSandboxFakeEventSource", {
    setUp: function () {
        this.realEventSource = EventSource;     
        this.realXHR = XMLHttpRequest;
        this.serverURL = "/serverURL";
        this.sandbox = new tddjs.stubs.eventSourceSandbox();
        this.fakeEventSource = new EventSource(this.serverURL);
        this.fakeXHR = tddjs.util.ajax;
    },
    tearDown: function () {
        this.sandbox.restore();
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
            new EventSource("/URL");
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

