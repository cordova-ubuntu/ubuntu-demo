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
    }
};

app.initialize();
