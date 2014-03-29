/**
 * COOL4CODE
 * Authors:
 *
 * Marcos Aguilera: maguilera@cool4code.com,
 * David Alméciga: walmeciga@cool4code.com"
 */

define(function(require) {

	"use strict";

	var Backbone = require('backbone');
	var BcvDatos = require('app/adapters/comovamos-datos');

	var Model = Backbone.Model.extend({

		sync: function(method, model, options) {
			if (method === "read") {
				BcvDatos.findById(this.id).done(function(data) {					
					options.success(data[0]);
				});
			}
		}

	});

	var Collection = Backbone.Collection.extend({

		model: Model,

		sync: function(method, model, options) {
			if (method === "read") {
				BcvDatos.findAll().done(function(data) {
					options.success(data);
				});
			}
		}

	});

	return {
		Model: Model,
		Collection: Collection
	};

});