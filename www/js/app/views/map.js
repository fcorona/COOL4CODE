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
		Backbone = require('backbone');

	return Backbone.View.extend({

		tagName: "div",

		map: {},

		mapOptions: {
			zoom: 15,
			minZoom: 2,
			maxZoom: 15,
			mapTypeControl: false,
			streetViewControl: false,
			zoomControl: true,
			panControl: false,
			center: {},
			mapTypeId: "roadmap"
		},

		initialize: function() {
			var self = this;

			self.mapOptions.center = new google.maps.LatLng(self.options.latitude, self.options.longitude);
			self.mapOptions.mapTypeId = google.maps.MapTypeId.ROADMAP;
			self.mapOptions.zoomControl = self.options.zoomControl;
		},

		render: function() {
			var self = this;
			this.map = new google.maps.Map(self.el, self.mapOptions);
			return this;
		}
	});

});