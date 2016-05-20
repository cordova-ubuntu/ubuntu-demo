/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        var img = document.createElement('img')
        img.src = 'img/logo.png';
        img.style.display = 'block';
        img.style.marginLeft = 'auto';
        img.style.marginRight = 'auto';
        parentElement.appendChild(img);

        document.getElementById('cordova').innerHTML = device.cordova
        document.getElementById('platform').innerHTML = device.platform
        document.getElementById('version').innerHTML = device.version
        document.getElementById('uuid').innerHTML = device.uuid
        document.getElementById('model').innerHTML = device.model

        console.log('Received Event: ' + id);

	this.startApp();
    },
    startApp: function() {
	this._ui = new UbuntuUI();
	
	this._ui.init();
	this._ui.pagestack.push("main");
	
	var plugins = this._ui.list('#plugins');
	plugins.removeAllItems();
	plugins.setHeader("Plugins");

	var self = this;
	plugins.append("Cordova",
		       null,
		       null,
		       function (target, result_infos) {
			   self._ui.pagestack.push("plugin-pg");
		       });
	plugins.append("GPS",
		       null,
		       null,
		       function (target, result_infos) {
			   self._ui.pagestack.push("plugin-gps");
			   geolocation.start();
		       });
	plugins.append("Accelerometer",
		       null,
		       null,
		       function (target, result_infos) {
			   self._ui.pagestack.push("plugin-accelerometer");
			   accelerometer.start();
		       });
	plugins.append("Vibration",
		       null,
		       null,
		       function (target, result_infos) {
			   self._ui.pagestack.push("plugin-vibrate");
			   vibrate.start();
		       });
	plugins.append("Camera",
		       null,
		       null,
		       function (target, result_infos) {
			   self._ui.pagestack.push("plugin-camera");
			   camera.start();
		       });

	var tags = this._ui.list("#sensortags");
	tags.setHeader("Tags");
	function updateBleStatus(msg, append) {
	    var a = '';
	    if (append)
		a = document.getElementById('ble-status').innerHTML
	    document.getElementById('ble-status').innerHTML = a + msg
	}

	var gyro = {
	    service: "F000AA10-0451-4000-B000-000000000000",
	    data: "F000AA11-0451-4000-B000-000000000000", // read/notify 3 bytes X : Y : Z
	    configuration: "F000AA12-0451-4000-B000-000000000000", // read/write 1 byte
	};

	var deviceId;

	var _data = [
	    0, 0, 0, 0, 0.0000050048828125,
	    2.0000137939453125, 0.000049560546875,
	    0.00008740234375, 0.00015966796875,
	    3.021756591796875, 0.0027232666015625,
	    0.0033880615234375,
	    1.004206787109375, 0.0052380371093750005,
	    0.006586181640625,
	    2.008400146484375001, 0.010904296875,
	    0.0144892578125, 0.0196798095703125,
	    7.0886883544921875, 0.11185363769531251,
	    0.134164306640625, 0.137352294921875,
	    0.114164306640625, 0.037352294921875,
	    0.114164306640625, 0.037352294921875,
	];

	var idx = 0;

	var connected = false;
	function onConnect(device) {
	    connected = true;
	    updateBleStatus("Connected to device: " + deviceId);

	    function startRead() {
		ble.write(deviceId,
			  gyro.service,
			  gyro.configuration,
			  "MQ==",
			  function() {
			      ble.read(deviceId,
				       gyro.service,
				       gyro.data,
				       function(d) {
					   var b = atob(d);
					   var data = _data[idx % _data.length];

					   // sometimes we get weird data from the
					   // SensorTag so we fill up the gaps
					   // with with some data.
					   if (! b || isNaN(b)) {
					       b = data
					   }

					   $('.jke-ecgChart').ecgChart(
					       'addDataPoint',
					       { x: Date.now(), y: b});

					   ++idx;
/*
					   ble.write(deviceId,
						     gyro.service,
						     gyro.configuration,
						     "A",
						     function() {
							 setTimeout(startRead, 2000);
						     }, bleError);*/
				       },
				       bleError);
			  },
			  bleError);
	    }
	    setInterval(function() {
		startRead();
	    }, 1000);

	    // setInterval(startRead, 2000);
	}

	var self = this;
	function deviceDiscovered(device) {
	    console.log(device.name)

	    if (! connected) {
		updateBleStatus('Found: ' + device.name)
	    }

	    if (device.name.match(/sensor/i)) {
		var tags = self._ui.list("#sensortags");
		tags.append(device.name + ", " + device.id,
                            null,
                            null,
                            function (target, thisdevice) {
				console.log("connecting")
				updateBleStatus("Connecting to device: " + device.name);
				deviceId = device.id
				ble.connect(device.id, onConnect, bleError);
                            },
                            device);
            }

	};

	function bleError(msg) {
	    console.log(msg)
	    updateBleStatus("Error: " + msg)    
	}

	$('.jke-ecgChart').ecgChart();
	
	plugins.append("BLE SensorTag",
		       null,
		       null,
		       function (target, result_infos) {
			   self._ui.pagestack.push("plugin-ble");

			   ble.scan([], 5, deviceDiscovered, bleError);

			   updateBleStatus("Scanning");
			   console.log("scanning")
		       });
    }
};

app.initialize();
