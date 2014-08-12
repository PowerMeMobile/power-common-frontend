$(document).ajaxError(function (event, xhr) {
    if (authModule.IsUnauthorizeResponse(xhr)) {
        authModule.loadInlineLogin()
    } else if (xhr.status == 500 ||xhr.status == 502 ||xhr.status == 503 ||xhr.status == 504) {
        alert("internal error");
    } else {
        console.log("unknoun error");
    }
});