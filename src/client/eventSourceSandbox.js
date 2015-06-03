/* 
 + Source-code for eventSourceSandbox
 * this code simulate the EventSource Object of the browser and commuication with the server
 * so it is possible to use it without a realserver that is responding. 
 */

tddjs.namespace("stubs").eventSourceSandbox = eventSourceSandbox;

function eventSourceSandbox()
{
    var realEventSource = EventSource;
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
        
    }
    
    this.update = update;
    this.restore = restore;

 
};


