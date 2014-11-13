var replaceHash = function (hash) {
    return location.replace(
        ((hash + '').charAt(0) === '#' ? '' : '#') + hash
    );
};

var addAlertToForm = function (data, allertId) {
    if (data && data.message) {
        alertId = '#' + allertId;
        $(alertId).children().remove();
        $(alertId).append('<div class="alert alert-block fade in" ><a class="close" data-dismiss="alert" href="#" aria-hidden="true">×</a><p></p></div>');

        if (data.success) {
            $(alertId + ' .alert').removeClass('alert-danger');
            $(alertId + ' .alert').addClass('alert-success');
        } else {
            $(alertId + ' .alert').addClass('alert-danger');
            $(alertId + ' .alert').removeClass('alert-success');
        }

        $(alertId + ' p').text(data.message);
    } else if (data && data.success) {
        $('#' + allertId).children().remove();
    }
}

$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    var link = $(e.target);
    if (link.data('url') !== undefined && link.data('loaded') != true) {
        var id = $(e.target).attr('href');
        if ($(id).length > 0) {
            $.get($(e.target).data('url'), null, function (data) {
                $(id).replaceWith(data);
                link.data('loaded', true);
            });
        }
    }
});

function GuidUtils() {
    this.Empty = function () {
        return "00000000-0000-0000-0000-000000000000";
    }
}

var Guid = new GuidUtils();

function setNull(obj ,filter) {
    if (typeof filter == 'string') {
        var properties = filter.split(',');
        properties.forEach(function (prop) {
            obj[prop] = null;
        });

        return obj;
    }
}