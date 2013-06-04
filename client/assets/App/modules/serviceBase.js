define(function () {
    
    var authToken = { 'x-swat' : null };
    
    var setAuthToken = function(token) {
        console.log(token);
        authToken['x-swat'] = encodeURI(JSON.stringify(token));
    };
    
    var getAjax = function(url, success, failure) {
        $.ajax({
            type: "GET",
            url: url,
            headers: authToken,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: success,
            error: failure
        });
    };
    
    var postAjax = function(url, data, success, failure) {
        $.ajax({
            type: "POST",
            url: url,
            headers: authToken,
            data: ko.toJSON(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: success,
            error: failure
        });  
    };
    
    var putAjax = function(url, data, success, failure) {
        $.ajax({
            type: "PUT",
            url: url,
            headers: authToken,
            data: ko.toJSON(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: success,
            error: failure
        });  
    };
    
    var deleteAjax = function(url, success, failure) {
        $.ajax({
            type: "DELETE",
            url: url,
            headers: authToken,
            success: success,
            error: failure
        });  
    };
    
    return {
        get: getAjax,
        post: postAjax,
        put: putAjax,
        delete: deleteAjax,
        setAuthToken: setAuthToken
    };
});