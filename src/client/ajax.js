/* 
 *  Source-Code for AJAX Facade
 */


tddjs.namespace("stubs").ajax = ajax;

function ajax()
{
    var _xhr = new tddjs.stubs.ajax.XMLHttpRequest();
    
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
    
    function setRequestHeader(header, value)
    {
        _xhr.setRequestHeader(header, value);
    }
    
    function getRequestHeader(header)
    {
        return _xhr.getRequestHeader(header);
    }
    
    this.getXmlHttpRequest = getXmlHttpRequest;
    this.get = get;
    this.post = post;
    this.setRequestHeader = setRequestHeader;
    this.getRequestHeader = getRequestHeader;
    
};


