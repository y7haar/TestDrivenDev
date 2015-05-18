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

function get(url)
{
    if(typeof url !== "string")
        throw new TypeError("URL must be setted");
    
    var xhr = tddjs.stubs.ajax.create();
    
    tddjs.stubs.ajax.request(url);
}

function post(url)
{
    if(typeof url !== "string")
        throw new TypeError("URL must be setted");
    
    var xhr = tddjs.stubs.ajax.create();
    
    tddjs.stubs.ajax.request(url);
}

function request(url)
{
    
}

}());

