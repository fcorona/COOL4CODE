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
		_ = require('underscore');

	return Backbone.View.extend({

		tagName: 'div',

		render: function() {
			var self = this;
			var data = JSON.parse(self.model.get("datas"));
			var categories = [];
			var d = [];

			$.each(data, function(k, v) {
				if (v !== null) {
					categories.push(k);
					d.push(v);
				}
			});

			require(['highcharts'], function() {
				self.$el.highcharts({
					chart: {
						type: 'bar'
					},
					title: {

					},
					subtitle: {

					},
					xAxis: {
						categories: categories
					},
					yAxis: {
						title: {
							text: self.model.get("measureType")
						}
					},
					tooltip: {

					},
					plotOptions: {
						column: {
							pointPadding: 0.2,
							borderWidth: 0
						}
					},
					series: [{
						name: self.model.get("name"),
						data: d
					}]
				});
			});

			return this;
		}

	});

});