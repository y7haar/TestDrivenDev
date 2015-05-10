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
        if(arguments.length != 3)
            throw new Error("All arguments must be setted");
        
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
    
    function isOpenCalled()
    {
        var called = _isOpenCalled;
        _isOpenCalled = false;
        
        return called;
    }
    
    function isSendCalled()
    {
        var called = _isSendCalled;
        _isSendCalled = false;
        
        return called;
    }
    
    function isOnreadystatechangeCalled()
    {
        var called = _isOnreadystatechangeCalled;
        _isOnreadystatechangeCalled = false;
        
        return called;
    }
    
    this.open = open;
    this.send = send;
    this.onreadystatechange  = onreadystatechange;
    this.setReadyState = setReadyState;
    this.setRequestHeader = setRequestHeader;
    
    this.isOpenCalled = isOpenCalled;
    this.isSendCalled = isSendCalled;
    this.isOnreadystatechangeCalled = isOnreadystatechangeCalled;
    
    this.responseText = "";
    this.readyState = readyState;
    this.status = status;
}

