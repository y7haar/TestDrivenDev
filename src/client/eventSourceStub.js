/* 
 + Source-code for eventSourceStub
 * this code simulate the EventSource Object of the browser
 * so it is possible to use it without a server that is responding. 
 */

tddjs.namespace("stubs").eventSourceStub = eventSource;
tddjs.namespace("stubs").eventSourceStub.CLOSED = 2;
tddjs.namespace("stubs").eventSourceStub.CONNECTING = 0;
tddjs.namespace("stubs").eventSourceStub.OPEN = 1;

function eventSource()
{
    function onmessage(event)
    {
        console.log("EventSource::onmessage: "+event);
    }
    
    function onerror(event)
    {
        console.log("EventSource::onerror: "+event);
    }
    
    function onopen(event)
    {
        console.log("EventSource::onopen: "+event);
    }
    
    this.onopen = stubFn(onopen);
    this.onmessage = stubFn(onmessage);
    this.onerror = stubFn(onerror);
};


