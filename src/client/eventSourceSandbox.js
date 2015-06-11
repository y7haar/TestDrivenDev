/* 
 + Source-code for eventSourceSandbox
 * this code simulate the EventSource Object of the browser and commuication with the server
 * so it is possible to use it without a realserver that is responding. 
 */

tddjs.namespace("stubs").eventSourceSandbox = eventSourceSandbox;

function eventSourceSandbox()
{
    
    var realEventSource = EventSource;
    var server  = {};
    
    var sinonSandbox = sinon.sandbox.create();
    sinonSandbox.useFakeXMLHttpRequest();
    sinonSandbox.useFakeServer();    

    function restore()
    {      
        sinonSandbox.restore();     
        EventSource = realEventSource;
    }
    // ------------ FAKE EVENTSOURCE ------------------------
    function fakeEventSource(serverURL, credentials)
    {        
        // ------------- INIT -------------------------------------
        if(typeof serverURL !== 'string') throw new TypeError("serverURL is not a String.");    
        if(typeof credentials !== 'boolean' && typeof credentials !== 'undefined')
            throw new TypeError("withCredentials is not a Boolean.");
        
        var withCredentials = false;
        if(typeof credentials !== 'undefined')
            withCredentials = credentials;
        
        var url = serverURL;        
        var readyState;
        
        Object.defineProperty(this,'withCredentials',{
            get: function(){return withCredentials;}
        });        
        Object.defineProperty(this,'url',{
            get: function(){return url;}
        });
        Object.defineProperty(this,'readyState',{
            get: function(){return readyState;}
        });
        
        var thisFakeES = this;
    
        establishConnection();       
        function establishConnection()
        {
            var ajax = tddjs.util.ajax;          
            var options = {
                headers: {
                    "Accept": "text/event-stream"
                },
                onSuccess: connectionSucces,
                onFailure: connectionFailure
            };
            ajax.post(url, options);
            readyState = 0;
            update();              
        }        
        function connectionSucces()
        {
            readyState = 1;
            server[url].clients.push(thisFakeES);            
        } 
        function connectionFailure()
        {
            readyState = 2;         
        }

       
        //----------------------------------
        this.onerror = null;
        this.onopen = null;
        this.onmessage = null;
        
        this.addEventListner = function(eventName, aFunction)
        {
            if(typeof eventName !== 'string')throw new TypeError("eventName is not a String.");
            if(typeof aFunction !== 'function')throw new TypeError("function parameter is not a Function");
            
            var newEventName = "on"+eventName.toLowerCase();
            this[newEventName] = aFunction;
        }; 
        
        this.close = function()
        {
            if (readyState === 1)
            {
                var index = server[url].clients.indexOf(thisFakeES);
                if (index > -1)
                    server[url].clients.splice(index, 1);
                readyState = 2;
            }        
        };
    }
    EventSource = fakeEventSource;    

    //------------- FAKESERVER -------------------
    function fakeServer()
    {
        this.clients = [];
        this.requests = [];
        
        this.sendMessage = function(clientIndex, eventName, message){    
            
            if(isNaN(clientIndex) || typeof clientIndex === 'undefined')throw new TypeError("clientIndex is not a Number");            
            if(typeof eventName !== 'string' && eventName !== null)throw new TypeError("eventName ist not a String");
            if(typeof message === 'undefined' || typeof message.data === 'undefined') throw new TypeError("message is undefined or data property is missing");
            
            if(typeof this.clients[clientIndex] === 'undefined') throw new Error("No client at given ClientIndex.");
            if(eventName !== null)
            {
                if(typeof this.clients[clientIndex]["on"+eventName.toLowerCase()] === 'undefined')
                    throw new Error("There is no "+eventName+" Event on the Client.");
            }
            // --------------
       
            
            if(eventName === null)
                this.clients[clientIndex]["onmessage"](message);
            else
                this.clients[clientIndex]["on"+eventName.toLowerCase()](message);
        };
        
        this.sendMessageToAll = function(eventName,message){
            
            for(i = 0,length = this.clients.length ; i < length ;i++ )
            {
                this.sendMessage(i,eventName,message);
            }
        };
        
        this.closeConnection = function(clientIdentifier)
        {
            if(typeof clientIdentifier === 'undefined' || (isNaN(clientIdentifier) && !(clientIdentifier instanceof EventSource) ))
                throw new TypeError("index is not a number or EventSource object");
            if(Number.isInteger(clientIdentifier) && clientIdentifier >= 0 && typeof this.clients[clientIdentifier] !== 'undefined' )
               this.clients[clientIdentifier].close();
            else if(clientIdentifier instanceof EventSource && this.clients.indexOf(clientIdentifier) >= 0)
            {
                var index = this.clients.indexOf(clientIdentifier);
                this.clients[index].close();
            }
            else
                throw new Error("Wrong Parameter, client not found.");
            
        };
        
        this.closeAllConnections = function()
        {
            for(i = 0,length = this.clients.length ; i < length ;i++ )            
                this.clients[0].close();            
        };
        
    }    
    function addServer(serverUrl)
    {
        if(typeof serverUrl !== 'string')throw new TypeError("serverUrl is missing or in wrong Format.");
        
        server[serverUrl] = new fakeServer(serverUrl);
    }
    
    // --------------- SANDBOX -----------------
    function update()
    {       
        for(i = 0, length = sinonSandbox.server.requests.length; i < length; i++)
        {
            var requestURL = sinonSandbox.server.requests[i].url;
            if(typeof server[requestURL] !== 'undefined')
            {
                server[requestURL].requests.push(sinonSandbox.server.requests[i]);
                sinonSandbox.server.requests[i].respond(200, "", "");
            }
            else
            {              
                sinonSandbox.server.requests[i].respond(404, "", "");
            }            
        }
        sinonSandbox.server.requests.length = 0;        
        
    }
    
    this.addServer = addServer;
    this.server = server;
    this.update = update;
    this.restore = restore;    
};


