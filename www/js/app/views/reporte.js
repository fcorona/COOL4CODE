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
		tpl = require('text!tpl/robberySend.html'),
		Categoria = require('app/models/categorias');

	return Backbone.View.extend({

		events: {
			"click .btn-back": "back",
			"click .btn-ok": "ok"
		},

		template: _.template(tpl),

		ok: function() {
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

			var self = this;
			var formData = $("#reporteForm").serializeArray();

			$.map(formData, function(v, i) {
				var name = v["name"];
				var value = v["value"];

				if (name === "category") {
					App.models.categoria = new Categoria.Model({
						id: value
					});
					App.models.categoria.fetch();
					self.model.set(name, App.models.categoria);
				} else if (name === "geoPoint") {
					var point = new Parse.GeoPoint(position.coords.latitude, position.coords.longitude);
					self.model.set(name, point);
				} else if (name === "date") {
					var date = new Date();
					self.model.set(name, date);
				} else {
					self.model.set(name, value);
				}
				
			});
			this.model.save(null, {
				success: function(model) {
					alert('New object created with objectId: ' + model.id);
				},
				error: function(model, error) {
					alert('Failed to create new object, with error code: ' + error.description);
				}
			});
			return false;
		},

		back: function(event) {
			window.history.back();
			return false;
		},

		render: function() {
			this.$el.html(this.template({
				'categories': this.collection.toJSON()
			}));
			return this;
		}

	});

});