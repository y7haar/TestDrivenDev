/* 
 *  Source-Code for AJAX Facade
 */


(function(){
    
tddjs.namespace("stubs.ajax").create = create;
tddjs.namespace("stubs.ajax").get = get;
tddjs.namespace("stubs.ajax").post = post;

function create()
{
    return new XMLHttpRequest();
}

function get(url)
{
    if(typeof url !== "string")
        throw new TypeError("URL must be setted");
}

function post(url)
{
    if(typeof url !== "string")
        throw new TypeError("URL must be setted");
}


}());

