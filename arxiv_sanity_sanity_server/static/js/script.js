var numGood = 0;
var numTotal = 0;

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


function updateStats() {
    var goodPercent = Math.round(100 * numGood / numTotal);
    $('#stats').text(`(${numGood} / ${numTotal} == ${goodPercent}%)`);
}

function showStatus(paper) {
    return new Promise((resolve, reject) => {

        var $paper = $(paper);
        var link = $('a', $paper).attr('href');
        var $status = $('.status', $paper);
        var $code = $('.parse-error', $paper);

        $status.attr('src', '/img/ajax-loader.gif');

        $.ajax({
            url: link,
            success: (data, status) => {
                numGood ++;
                numTotal ++;
                updateStats();
                $status.attr('src', '/img/check-mark.png');
                resolve();
            },
            error: (xhr) => {
                var body = xhr.responseText;
                var error;

                var isAmbiguous = body.indexOf('Ambiguous LaTeX path') != -1;
                if (isAmbiguous) {
                    error = body.match(/(Ambiguous LaTeX path, len candidates: ([0-9]+))/)[1];
                    $status.attr('src', '/img/question-mark.png');
                } else {
                    numTotal ++;
                    updateStats();
                    $status.attr('src', '/img/no-entry.png');
                    var match = body.match(/(Error at ".+" \(line.+[^\^]+\^)/mi);
                    error = match ? match[1] : 'unknown error, click the link';
                }

                $code.text(error);

                resolve();
            }
        });

    });
}
