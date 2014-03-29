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
		tpl = require('text!tpl/generalCharts.html'),
		ChartView = require('app/views/chart');

	return Backbone.View.extend({

		events: {
			"click .btn-back": "back"
		},

		template: _.template(tpl),

		back: function(event) {
			window.history.back();
			return false;
		},

		render: function() {
			App.views.chart = new ChartView({
				model: App.models.indicador
			});
			this.$el.html(this.template(this.model.toJSON()));
			setTimeout(function(){
				$("#indicadorContent").prepend(App.views.chart.render().$el);
			}, 500);
			return this;
		}

	});

});