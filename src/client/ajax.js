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
        
    }
    
    function post()
    {
        
    }
    
    function setHeader()
    {
        
    }
    
    this.getXmlHttpRequest = getXmlHttpRequest;
    this.get = get;
    this.post = post;
    this.setHeader = setHeader;
    
};


