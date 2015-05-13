/* 
 *  Source-Code for Ajax-Stub
 */

tddjs.namespace("stubs").ajax = ajax;

function ajax()
{
    var _isSendCalled = false;
    var _isOpenCalled = false;
    var _isOnreadystatechangeCalled = false;
    
    function open(method, url, async)
    {
        _isOpenCalled= true;
        
        if(arguments.length != 3)
            throw new Error("All arguments must be setted");
        
        if(typeof method !== "string")
            throw new TypeError("Method must be a string");
        
        if(typeof url !== "string")
            throw new TypeError("Url must be a string");
        
        if(typeof async !== "boolean")
            throw new TypeError("Async must be a boolean");

        console.log(this);        
        this.setReadyState(1);
        this.status = 0;
    }
    
    function send(data)
    {
        _isSendCalled = true;
        this.setReadyState(4);
        this.status = 200;
        
        this.responseText = "success";
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
        this.readyState = aState;
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
    this.readyState = 0;
    this.status = 0;
}

