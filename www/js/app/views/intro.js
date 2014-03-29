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
		tpl = require('text!tpl/intro.html');

	return Backbone.View.extend({

		template: _.template(tpl),

		progressBar: function(percent, str) {
            var progressBarWidth = percent * $("#progressBar").width() / 100;
            $("#progressBar").find('div').animate({
                width: progressBarWidth
            }, 20);
            $("#pbLabel").html(percent + "%&nbsp;");
            $("#progressLabel").html(str);
        },

		render: function() {
			this.$el.html(this.template);
			return this;
		}

	});

});