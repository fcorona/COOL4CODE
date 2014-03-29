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
		tpl = require('text!tpl/generalList.html');

	return Backbone.View.extend({

		template: _.template(tpl),
		
		render: function() {
			this.$el.html(this.template);
			return this;
		}

	});

});