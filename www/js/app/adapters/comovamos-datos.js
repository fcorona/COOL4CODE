/**
 * COOL4CODE
 * Authors:
 *
 * Marcos Aguilera: maguilera@cool4code.com,
 * David Alméciga: walmeciga@cool4code.com"
 */

define(function(require) {

	"use strict";

	var $ = require('jquery');
	var Basebcv = require('app/utils/db');

	var db = new Basebcv(window.openDatabase("comovamos", "1.0", "BCV - Bogota BOGOTA COMO VAMOS", 4145728));

	var findAll = function() {
		var deferred = $.Deferred();
		db.execute("SELECT * FROM datos", function(d) {
			deferred.resolve(d);
		});
		return deferred.promise();
	};

	var findById = function(id) {
		var deferred = $.Deferred();
		db.execute("SELECT * FROM datos WHERE _id = '" + id + "'", function(d) {
			deferred.resolve(d);
		});
		return deferred.promise();
	};

	return {
		findAll: findAll,
		findById: findById
	};

});