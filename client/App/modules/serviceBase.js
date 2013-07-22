define(['durandal/app', 'durandal/system'],
function (app, system) {
    
    var authToken = { 'x-auth-token' : null, 'x-socket-id': null };
    
    var setAuthToken = function(token) {
        authToken['x-auth-token'] = encodeURI(JSON.stringify(token));
    };

    var setSocketId = function(socketId){
        authToken['x-socket-id'] = socketId;
    };
    
    var convertjQueryError = function (jqXHR) {
        var message;
        try {
            message = JSON.parse(jqXHR.responseText).responseStatus.message;
        } catch (e) {
            message = jqXHR.statusText;
        } 
        return {
            message: message,
            status: jqXHR.status,
            statusText: jqXHR.statusText
        };
    };

    var globalError = function (callback) {
        return function (jqXHR) {
            callback.call(null, convertjQueryError(jqXHR));
        };
    };

    var deferAjax = function(ajaxCall) {
        return system.defer(function(deferred) {
            ajaxCall.success = function (response) {
                deferred.resolve(response);
            };
            ajaxCall.error = function(jqXhr) {
                var newError = convertjQueryError(jqXhr);
                deferred.reject(newError);
                /*
                app.showMessage(newError.message, 'An AJAX error occured: ' + newError.status, ['Ok'])
                    .then(function() {
                        deferred.reject(newError);
                    });
                    */
            };

            $.ajax(ajaxCall);
        }).promise();
    };

    var promiseGet = function (url) {
        return deferAjax({
            type: "GET",
            url: url,
            headers: authToken,
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        });
    };

    var promisePost = function (url, data) {
        return deferAjax({
            type: "POST",
            url: url,
            headers: authToken,
            data: ko.toJSON(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        });
    };

    var promisePut = function (url, data) {
        return deferAjax({
            type: "PUT",
            url: url,
            headers: authToken,
            data: ko.toJSON(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        });
    };

    var promiseDelete = function (url) {
        return deferAjax({
            type: "DELETE",
            url: url,
            headers: authToken,
            contentType: "application/json; charset=utf-8"
        });
    };
    
    return {
        get: promiseGet,
        remove: promiseDelete,
        post: promisePost,
        put: promisePut,
        setAuthToken: setAuthToken,
        setSocketId: setSocketId
    };
    
    
    /*
        var convertjQueryError = function (jqXhr) {
        var message;
        try {
            message = JSON.parse(jqXhr.responseText).responseStatus.message;
        } catch (e) {
            message = jqXhr.statusText;
        }
        return {
            message: message,
            status: jqXhr.status,
            statusText: jqXhr.statusText
        };
    };

    var ajaxPromise = function (method, url, data) {
        var ajaxCall = {
            type: method,
            url: url,
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        };

        if (data)
            ajaxCall.data = ko.toJSON(data);

        var defer = app.defer(function(deferred) {
            ajaxCall.success = function(response) {
                deferred.resolve(response);
            };
            ajaxCall.error = function(jqXhr) {
                deferred.reject(convertjQueryError(jqXhr));
            };

            $.ajax(ajaxCall);
        });

        return defer.promise();
    };

    return {
        get: function (url) {
            return ajaxPromise("GET", url);
        },
        post: function (url, data) {
            return ajaxPromise("POST", url, data);
        },
        put: function (url, data) {
            return ajaxPromise("PUT", url, data);
        },
        remove: function (url) {
            return ajaxPromise("DELETE", url);
        }
    };
    */
});
