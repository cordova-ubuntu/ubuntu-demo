var camera = (function() {
    var started = false;
    return {
        start: function() {
            if (started) {
                return
            }
            started = true
            document.getElementById('take-photo')
                .addEventListener(
                    'click',
                    function() {
                        navigator.camera.getPicture(
                            function(data) {
                                var photo = document.querySelector('#photo img');
                                photo.src = data
                            },
                            function() {
                                console.log('fail')
                            })
                    });
        }
    }
})();
