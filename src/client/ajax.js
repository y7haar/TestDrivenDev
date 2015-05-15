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
    
    this.getXmlHttpRequest = getXmlHttpRequest;
    
};


