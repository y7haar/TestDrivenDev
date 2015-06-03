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
    
    function fakeEventSource()
    {
        
    }
    EventSource = fakeEventSource;
    
    function restore()
    {
        sinonSandbox.restore();
        EventSource = realEventSource;
    }
    
    
    
    this.restore = restore;
 
};


