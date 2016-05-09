var vibrate = (function() {
    var started = false
    return {
        start: function() {
            if (started) {
                return
            }
            started = true
            var d = document.getElementById('result')
            document.getElementById('vibrate')
                .addEventListener(
                    'click',
                    function() {
                        var countValue = document.getElementById('count').value
                        var count = parseInt(countValue)
                        if (! isNaN(count)) {
                            navigator.notification.vibrate(count)
                        }
                    });
        }
    }
})();
