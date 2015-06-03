/* 
 + Source-code for eventSourceSandbox
 * this code simulate the EventSource Object of the browser and commuication with the server
 * so it is possible to use it without a realserver that is responding. 
 */

tddjs.namespace("stubs").eventSourceSandbox = eventSourceSandbox;

function eventSourceSandbox()
{
    
    var realEventSource = EventSource;
    var server  = {};
    
    var sinonSandbox = sinon.sandbox.create();
    sinonSandbox.useFakeXMLHttpRequest();
    sinonSandbox.useFakeServer();
    
    function fakeEventSource(serverURL)
    {    
        
        if(typeof serverURL !== 'string') throw new TypeError("serverURL is not a String.");        
        this.url = serverURL;
        
        this.onerror = null;
        this.onopen = null;
        this.onmessage = null;
        
        this.addEventListner = function(eventName, aFunction)
        {
            if(typeof eventName !== 'string')throw new TypeError("eventName is not a String.");
            if(typeof aFunction !== 'function')throw new TypeError("function parameter is not a Function");
            
            var newEventName = "on"+eventName.toLowerCase();
            this[newEventName] = aFunction;
        };       
        
        
    }
    EventSource = fakeEventSource;
    
    function restore()
    {      
        sinonSandbox.restore();     
        EventSource = realEventSource;
    }
    
    function update()
    {
        console.log(sinonSandbox.server);
    }
    
    function dispatchClientEvent(eventName, msg)
    {    
        if(typeof eventName !== 'string' && eventName !== null) throw new TypeError("eventName parameter is not String or not NULL.");
        if(typeof msg === 'undefined' || msg === null) throw new TypeError("Message to ClientEventListner is Undefined or NULL.");
        if(typeof connectedEventSource[eventName] === 'undefined' && eventName !== null) throw new Error("Event dont exisits on the client EventSource-Object.");
            
    }
    
    function fakeServer()
    {
        this.clients = [];
        
    }    
    function addServer(serverUrl)
    {
        if(typeof serverUrl !== 'string')throw new TypeError("serverUrl is missing or in wrong Format.");
        
        server[serverUrl] = new fakeServer(serverUrl);
    }
    
    this.addServer = addServer;
    this.server = server;
    this.dispatchClientEvent = dispatchClientEvent;
    this.update = update;
    this.restore = restore;    
};


