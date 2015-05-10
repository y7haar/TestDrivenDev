/* 
 *  Source-Code for Ajax-Stub
 */

tddjs.namespace("stubs").ajax = ajax;

function ajax()
{
    var readyState = 0;
    var status = 0;
    
    function open(method, url, async)
    {
        console.log(this);
        
        this.setReadyState(1);
        status = 0;
    }
    
    function send(data)
    {
        this.setReadyState(4);
        status = 200;
    }
    
    function onreadystatechanged()
    {
    }
    
    function setRequestHeader(header, value)
    {
        
    }
    
    function setReadyState(aState)
    {
        console.log(this);
        
        readyState = aState;
        this.onreadystatechange();
    }
    
    this.open = stubFn(open);
    this.send = stubFn(send);
    this.onreadystatechange = stubFn(onreadystatechanged);
    this.setReadyState = setReadyState;
    this.setRequestHeader = setRequestHeader;
    
    this.responseText = "";
    this.readyState = readyState;
    this.status = status;
}

