var accelerometer = (function() {
    var watchId;
    return {
        start: function() {
            if (watchId) {
                return;
            }
            var initialX = null;
            var initialY = null;
            
            var ball = document.getElementById('ball');
            
            function callback(acceleration) {
                if (! acceleration) {
                    document.getElementById('accel-msg').innerHTML =
                        "Ooops could not get accelerometer data";
                    return;
                }

                var x = acceleration.x;
                var y = acceleration.y;
                document.getElementById('accel-msg').innerHTML = String(x) + ":" + String(y)
                if (!initialX && !initialY) {
                    initialX = x;
                    initialY = y;
                } else {
                    var positionX = initialX - x;
                    var positionY = initialY - y;
                    ball.style.top = (90 + positionX * 5) + 'px';
                    ball.style.left = (90 + positionY * 5) + 'px';
                }
            }
            watchId = navigator.accelerometer.watchAcceleration(
                callback, callback, {frequency: 500});
        },
        stop: function() {
        }
    }
})();
