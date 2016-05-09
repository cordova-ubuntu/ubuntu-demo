var geolocation = (function() {
    return {
        start: function() {
            function callback(pos) {
                if (pos) {
                    document.getElementById('lat').innerHTML = pos.coords.latitude
                    document.getElementById('long').innerHTML = pos.coords.longitude
                    document.getElementById('altitude').innerHTML = pos.coords.altitude
                    document.getElementById('accuracy').innerHTML = pos.coords.accuracy
                }
            }
            navigator.geolocation.getCurrentPosition(
                callback,
                callback);
        },
        stop: function() {
        }
    }
})();
