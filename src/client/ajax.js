/* 
 *  Source-Code for Ajax-Stub
 */

tddjs.namespace("stubs").ajax = ajax;

function ajax()
{
    var _openCalled = false;
    var _sendCalled = false;
    
    function open(method, url, async)
    {
        if(arguments.length != 3)
            throw new Error("All parameters must be setted");
        
        _openCalled = true;
    }
    
    function send(data)
    {
        if(! _openCalled)
            throw new Error("Open method must be called before send");
        
        _sendCalled = true;
    }
    
    function onreadystatechange()
    {
        
    }
    
    function setRequestHeader(header, value)
    {
        
    }
    
    this.open = open;
    this.send = send;
    this.onreadystatechange = onreadystatechange;
    this.setRequestHeader = setRequestHeader;
    
    this.responseText = "";
}

