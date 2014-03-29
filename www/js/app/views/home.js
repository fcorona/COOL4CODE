/**
 * COOL4CODE
 * Authors:
 *
 * Marcos Aguilera: maguilera@cool4code.com,
 * David Alméciga: walmeciga@cool4code.com"
 */

define(function(require) {

	"use strict";

	var $ = require('jquery'),
		Backbone = require('backbone'),
		_ = require('underscore'),
		MapView = require('app/views/map'),
		tpl = require('text!tpl/home.html');

	return Backbone.View.extend({

		template: _.template(tpl),

		myMarker: {},

		markers: [],

		bounds: {},

		watchID: null,

		initialize: function() {
			var self = this;
			this.bounds = new google.maps.LatLngBounds();
		},

		initMapMarkers: function() {
			var self = this;
			self.markers = [];
			$.each(self.collection.models, function(k1, v1) {
				var gp = v1.get("geoPoint");
				self.createMarker(gp.latitude, gp.longitude);
			});

			require(['markerclustererCompiled'], function() {
				if (typeof App.views.map.markerCluster !== "undefined") {
					App.views.map.markerCluster.clearMarkers();
				}
				App.views.map.markerCluster = new MarkerClusterer(App.views.map.map);
				App.views.map.markerCluster.addMarkers(self.markers);
			});

		},

		createMarker: function(lat, lng) {
			var self = this;

			var marker = new google.maps.Marker({
				position: new google.maps.LatLng(lat, lng),
				map: App.views.map.map,
				zIndex: Math.round(4.5 * -100000) << 5,
				animation: google.maps.Animation.DROP
			});

			self.markers.push(marker);
			self.bounds.extend(marker.position);
		},

		render: function() {
			this.$el.html(this.template);
			var self = this;
			var position = {
				coords: {
					latitude: 4.598055600,
					longitude: -74.075833300
				}
			};
			navigator.geolocation.getCurrentPosition(function(gp) {
				position = gp;
			}, function(error) {
				console.error('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
			});
			App.views.map = new MapView({
				id: "mapContainer",
				latitude: position.coords.latitude,
				longitude: position.coords.longitude,
				zoomControl: true
			});


			setTimeout(function() {
				$("#homeContent").prepend(App.views.map.render().$el);

				self.myMarker = new google.maps.Marker({
					position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
					map: App.views.map.map,
					zIndex: Math.round(4.5 * -100000) << 5,
					animation: google.maps.Animation.DROP
				});
				self.bounds.extend(self.myMarker.position);

				self.watchID = navigator.geolocation.watchPosition(function(p) {

					self.myMarker.setPosition(new google.maps.LatLng(p.coords.latitude, p.coords.longitude));

					function toRad(val) {
						return val * Math.PI / 180;
					}

					function Round(Number, DecimalPlaces) {
						return Math.round(parseFloat(Number) * Math.pow(10, DecimalPlaces)) / Math.pow(10, DecimalPlaces);
					}

					function haversine(lat1, lat2, lng1, lng2) {
						rad = 6371000;
						deltaLat = toRad(lat2 - lat1);
						deltaLng = toRad(lng2 - lng1);
						lat1 = toRad(lat1);
						lat2 = toRad(lat2);
						a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) + Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2) * Math.cos(lat1) * Math.cos(lat2);
						c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
						return rad * c;
					}
				}, function() {
					navigator.notification.alert('No hemos podido ubicar tu dirección!', function() {
						console.error('No hemos podido ubicar tu dirección!');
					}, 'Atención', 'Reintentar');
				}, {
					timeout: 30000
				});

				self.initMapMarkers();
			}, 500);
			return this;
		}

	});

});