$(function() {

    var papers = $('.paper').toArray();

    syncApply(papers, showStatus);

});


function syncApply(list, func) {
    if (list.length > 0) {
        var head = list.shift();
        func(head).then(_ => syncApply(list, func));
    }
}


function showStatus(paper) {
    return new Promise((resolve, reject) => {

        var $paper = $(paper);
        var link = $('a', $paper).attr('href');
        var $status = $('.status', $paper);

        $status.attr('src', '/img/ajax-loader.gif');

        $.ajax({
            url: link,
            success: (data, status) => {
                $status.attr('src', '/img/check-mark.png');
                resolve();
            },
            error: (xhr) => {
                $status.attr('src', '/img/no-entry.png');
                resolve();
            }
        });

    });
}
