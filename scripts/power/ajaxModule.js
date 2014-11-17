var ignoreAuthError = ['/NotificationsPusher/WaitNotification'];

$(document).ajaxError(function (event, xhr, settings, thrownError) {
    if (authModule.IsUnauthorizeResponse(xhr)) {
        if(!ignoreAuthError.some(function (url) { return settings.url.indexOf(url) != -1 }))
            authModule.loadInlineLogin()
    } else if (xhr.status == 500 ||xhr.status == 502 ||xhr.status == 503 ||xhr.status == 504) {
        console.log("internal error");
    } else {
        console.log("unknoun error");
    }
});