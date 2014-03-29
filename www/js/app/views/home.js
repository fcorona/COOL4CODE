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

		render: function() {
			this.$el.html(this.template);

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
			}, 500);
			return this;
		}

	});

});