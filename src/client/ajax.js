/* 
 *  Source-Code for AJAX Facade
 */


(function(){
    
tddjs.namespace("stubs.ajax").create = create;
tddjs.namespace("stubs.ajax").get = get;
tddjs.namespace("stubs.ajax").post = post;
tddjs.namespace("stubs.ajax").request = request;

function create()
{
    return new XMLHttpRequest();
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
    
    tddjs.stubs.ajax.request(url, options);
}

function post(url, options)
{
    if(typeof url !== "string")
        throw new TypeError("URL must be setted");
    
    options = tddjs.extend({}, options);
    options.method = "POST";
    
    tddjs.stubs.ajax.request(url, options);
}

function request(url, options)
{
    if(typeof url !== "string")
        throw new TypeError("URL must be setted");
    
    options = tddjs.extend({}, options);
    
    var xhr = tddjs.stubs.ajax.create();
    setRequestHeaders(xhr, options.headers);

    xhr.open(options.method || "GET", url, true);
    
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

