/* 
 *  Source-Code for AJAX Facade
 */


tddjs.namespace("stubs").ajax = ajax;

function ajax()
{
    var _xhr = new tddjs.stubs.ajax.xmlHttpRequest();
    
    function getXmlHttpRequest()
    {
        return _xhr;
    }
    
    function get()
    {
        _xhr.open("GET", "/url", true);
    }
    
    function post()
    {
        _xhr.open("POST", "/url", true);
    }
    
    function setRequestHeader()
    {
        
    }
    
    function getRequestHeader()
    {
        
    }
    
    this.getXmlHttpRequest = getXmlHttpRequest;
    this.get = get;
    this.post = post;
    this.setRequestHeader = setRequestHeader;
    this.getRequestHeader = getRequestHeader;
    
};


