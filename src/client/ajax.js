/* 
 *  Source-Code for Ajax-Stub
 */

tddjs.namespace("stubs").ajax = ajax;

function ajax()
{
    var readyState = 0;
    var status = 0;
    var _isSendCalled = false;
    var _isOpenCalled = false;
    var _isOnreadystatechangeCalled = false;
    
    function open(method, url, async)
    {
        _isOpenCalled= true;
        console.log(this);        
        this.setReadyState(1);
        status = 0;
    }
    
    function send(data)
    {
        _isSendCalled = true;
        this.setReadyState(4);
        status = 200;
    }
    
    function onreadystatechange()
    {
        _isOnreadystatechangeCalled = true;
    }
    
    function setRequestHeader(header, value)
    {        
    }
    
    function setReadyState(aState)
    {      
        readyState = aState;
        this.onreadystatechange();
    }
    
    this.open = open;
    this.send = send;
    this.onreadystatechange  = onreadystatechange;
    this.setReadyState = setReadyState;
    this.setRequestHeader = setRequestHeader;
    
    this.responseText = "";
    this.readyState = readyState;
    this.status = status;
}

