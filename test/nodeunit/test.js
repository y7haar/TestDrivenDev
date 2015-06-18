module.exports = {
    setUp: function (callback) {
        
        this.client = require('nodeunit-httpclient').create({
        port: 8080,
        path: '/',   //Base URL for requests
        status: 200,    //Test each response is OK (can override later)
        headers: {      //Test that each response must have these headers (can override later)
            
        }
});

        callback();
    },
    tearDown: function (callback) {
        // clean up
        callback();
    },
    
    "test server should respond with status 200 if lobby with Id exists": function (test) {
        this.client.get(test, "lobbies/1", function(res) {
        test.done();
        });
    }
};
