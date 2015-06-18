/* 
 *  Source-Code for Ajax-Stub
 */

(function() {

    tddjs.namespace("stubs.ajax").xmlHttpRequest = xmlHttpRequest;

    function xmlHttpRequest()
    {
        var _isSendCalled = false;
        var _isOpenCalled = false;
        var _isOnreadystatechangeCalled = false;
        var _isGetRequestHeaderCalled = false;
        var _isSetRequestHeaderCalled = false;

        var _method = "";
        var _headers = {};

        function open(method, url, async)
        {
            _isOpenCalled = true;
            this.openArgs = arguments;

            if (arguments.length != 3)
                throw new Error("All arguments must be setted");

            if (typeof method !== "string")
                throw new TypeError("Method must be a string");

            if (typeof url !== "string")
                throw new TypeError("Url must be a string");

            if (typeof async !== "boolean")
                throw new TypeError("Async must be a boolean");

            _method = method;
            this.setReadyState(1);
        }

        function send(data)
        {
            _isSendCalled = true;
            this.sendArgs = arguments;

            this.setReadyState(4);

            if (_method === "GET")
                this.responseText = "success";
        }

        function onreadystatechange()
        {
            _isOnreadystatechangeCalled = true;
        }

        function setRequestHeader(header, value)
        {
            _isSetRequestHeaderCalled = true;

            _headers[header] = value;
        }

        function getRequestHeader(header)
        {
            _isGetRequestHeaderCalled = true;

            return _headers[header];
        }

        function setReadyState(aState)
        {
            this.readyState = aState;
            this.onreadystatechange();
        }

        function isOpenCalled()
        {
            var called = _isOpenCalled;
            _isOpenCalled = false;

            return called;
        }

        function isSendCalled()
        {
            var called = _isSendCalled;
            _isSendCalled = false;

            return called;
        }

        function isOnreadystatechangeCalled()
        {
            var called = _isOnreadystatechangeCalled;
            _isOnreadystatechangeCalled = false;

            return called;
        }

        function isSetRequestHeaderCalled()
        {
            var called = _isSetRequestHeaderCalled;
            _isSetRequestHeaderCalled = false;

            return called;
        }

        function isGetRequestHeaderCalled()
        {
            var called = _isGetRequestHeaderCalled;
            _isGetRequestHeaderCalled = false;

            return called;
        }

        this.open = open;
        this.send = send;
        this.onreadystatechange = onreadystatechange;
        this.setReadyState = setReadyState;

        this.setRequestHeader = setRequestHeader;
        this.getRequestHeader = getRequestHeader;

        this.isOpenCalled = isOpenCalled;
        this.isSendCalled = isSendCalled;
        this.isOnreadystatechangeCalled = isOnreadystatechangeCalled;
        this.isGetRequestHeaderCalled = isGetRequestHeaderCalled;
        this.isSetRequestHeaderCalled = isSetRequestHeaderCalled;

        this.sendArgs = [];
        this.openArgs = [];

        this.responseText = "";
        this.readyState = 0;
        this.status = 0;
    }
}());

