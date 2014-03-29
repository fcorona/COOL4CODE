/** 
 * COOL4CODE
 * Authors:
 *
 * Marcos Aguilera: maguilera@cool4code.com,
 * David Alméciga: walmeciga@cool4code.com"
 */

define(function(require) {

	"use strict";

	var basebcv = function(odb) {
		this.odb = odb;
	};

	basebcv.prototype = {

		constructor: basebcv,

		execute: function(sql, cb) {

			this.odb.transaction(

				function(tx) {
					tx.executeSql(sql, [], function(tx, results) {
						var len = results.rows.length;
						var dataCollection = [];
						for (var i = 0; i < len; i = i + 1) {
							dataCollection[i] = results.rows.item(i);
						}
						cb(dataCollection);
					});
				},

				function(err) {
					console.log(err);
				});
		}

	};

	return basebcv;

});