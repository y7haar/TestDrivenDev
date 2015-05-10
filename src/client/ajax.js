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
        if(arguments.length != 3)
            throw new Error("All parameters must be setted");
    }
    
    function send(data)
    {
    }
    
    function onreadystatechange()
    {
    }
    
    function setRequestHeader(header, value)
    {
        
    }
    
    function setReadyState(aState)
    {
        this.readyState = aState;
        this.onreadystatechange();
    }
    
    this.open = stubFn(open);
    this.send = stubFn(send);
    this.onreadystatechange = stubFn(onreadystatechange);
    this.setReadyState = setReadyState;
    this.setRequestHeader = setRequestHeader;
    
    this.responseText = "";
    this.readyState = readyState;
    this.status = status;
}

