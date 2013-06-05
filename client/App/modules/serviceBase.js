define(['durandal/app', 'durandal/system'], function (app, system) {
    
    var authToken = { 'x-swat' : null };
    
    var setAuthToken = function(token) {
        console.log(token);
        authToken['x-swat'] = encodeURI(JSON.stringify(token));
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
    
    var postAjax = function (url, data, success, failure) {
        $.ajax({
            type: "POST",
            url: url,
            headers: authToken,
            data: ko.toJSON(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: success,
            error: globalError(failure)
        });
    };
    
    return {
        get: promiseGet,
        remove: promiseDelete,
        post: promisePost,
        put: promisePut,
        postAjax: postAjax,
        setAuthToken: setAuthToken
    };
});