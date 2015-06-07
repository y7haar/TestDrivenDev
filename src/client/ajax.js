/* 
 *  Source-Code for AJAX Facade
 */


(function(){
    
tddjs.namespace("util.ajax").create = create;
tddjs.namespace("util.ajax").get = get;
tddjs.namespace("util.ajax").post = post;
tddjs.namespace("util.ajax").request = request;

function create()
{
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    
    return xhr;
}

function setRequestHeaders(xhr, headers)
{
    for(var header in headers)
    {
        if(headers.hasOwnProperty(header))
            xhr.setRequestHeader(header, headers[header]);
    }
}

function isRequestSuccessfull(status)
{
    return (status >= 200 && status < 300);
}

function get(url, options)
{
    if(typeof url !== "string")
        throw new TypeError("URL must be setted");
    
    options = tddjs.extend({}, options);
    options.method = "GET";
    
    tddjs.util.ajax.request(url, options);
}

function post(url, options)
{
    if(typeof url !== "string")
        throw new TypeError("URL must be setted");
    
    options = tddjs.extend({}, options);
    options.method = "POST";
    
    tddjs.util.ajax.request(url, options);
}

function request(url, options)
{
    if(typeof url !== "string")
        throw new TypeError("URL must be setted");
    
    options = tddjs.extend({}, options);
    
    var xhr = tddjs.util.ajax.create();
    xhr.open(options.method || "GET", url, true);
    
    setRequestHeaders(xhr, options.headers);
    
    xhr.onreadystatechange = function(){   
        if(xhr.readyState === 4)
        {
            if(isRequestSuccessfull(xhr.status) && typeof options.onSuccess === "function")
            {
                options.onSuccess(xhr);
            }
            
            else if(! isRequestSuccessfull(xhr.status) && typeof options.onFailure === "function")
            {
                options.onFailure(xhr);
            }
                
        }
    };
    
    xhr.send(options.data || null);
}

}());

