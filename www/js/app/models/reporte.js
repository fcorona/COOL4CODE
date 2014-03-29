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

	var Model = Parse.Object.extend("Report");

	var Query = new Parse.Query(Model);

	var Collection = Parse.Collection.extend({
		model: Model,
		query: Query
	});

	return {
		Model: Model,
		Collection: Collection
	};

});