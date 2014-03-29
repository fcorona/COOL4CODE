/**
 * COOL4CODE
 * Authors:
 *
 * Marcos Aguilera: maguilera@cool4code.com,
 * David Alméciga: walmeciga@cool4code.com"
 */

define(function(require) {

	"use strict";

	moment = require('moment');

	var bcv = {

		deferred: $.Deferred(),

		categorias: [],

		checkUpdatedData: function() {
			console.log("checkUpdatedData: Comprobando si los datos están actualizados!");
			bcv.deferred.notify({
				msg: "Comprobando datos actualizados!"
			});
			var updated = window.localStorage.getItem("updated");

			if (updated && moment() < moment(updated).add(7, "days")) {
				console.log("checkUpdatedData: Los datos están actualizados! " + updated);
				return true;
			} else {
				console.log("checkUpdatedData: Los datos no están actualizados!");
				return false;
			}
		},

		loadCategorias: function() {
			console.log("loadCategorias: Consultando datos como vamos!");
			bcv.deferred.notify({
				msg: "Descargando datos: BCV!"
			});
			var url = "http://api.bogotacomovamos.org/api/dimensions/3?key=comovamos";
			var xhr = bcv.getJson(url);
			xhr.success(function(r) {
				console.log("loadCategorias: Descarga completa!");
				$.each(r.d, function(k, v) {
					bcv.categorias.push(v);
				});

				console.log("loadCategorias: Se descargaron los datos completos de open data!");
			});
			console.log("loadCategorias: " + url);
		},

		getJson: function(url) {
			return $.ajax({
				type: "GET",
				url: url,
				dataType: 'jsonp',
				error: function() {
					console.error("El repositorio de datos bogota como vamos no está disponible ó se ha perdido la conexión con la red!");
					navigator.notification.alert('El repositorio de datos bogota como vamos no está disponible ó se ha perdido la conexión con la red, inténtalo más tarde!', function() {}, 'Atención', 'Reintentar');
				}
			});
		},

		createDB: function() {
			console.log("createDB: Creando base de datos!");
			bcv.deferred.notify({
				msg: "Creando base de datos!"
			});
			var db = window.openDatabase("comovamos", "1.0", "BCV - Bogota Como Vamos", 4145728);
			db.transaction(bcv.populateDB, bcv.errorDB, bcv.successDB);
		},

		populateDB: function(tx) {
			console.log("populateDB: Creando tablas!");
			bcv.deferred.notify({
				msg: "Insertando datos!"
			});

			var tables = [{
				name: "categorias",
				fields: [],
				data: "categorias"
			}];

			$.each(tables, function(k, v) {
				$.each(bcv[v.data][0], function(k1, v1) {
					v.fields.push(k1);
				});
			});

			$.each(tables, function(k, v) {
				tx.executeSql('DROP TABLE IF EXISTS ' + v.name);

				console.log("populateDB: Creando tabla " + v.name + "!");
				tx.executeSql('CREATE TABLE IF NOT EXISTS ' + v.name + ' (' + v.fields.join() + ')');

				console.log("populateDB: Insertando registros en la tabla datos " + v.name + "!");
				$.each(bcv[v.data], function(k1, v1) {
					var values = [];
					$.each(v1, function(k2, v2) {
						values.push("'" + v2 + "'");
					});
					var sql = 'INSERT INTO ' + v.name + ' (' + v.fields.join() + ') VALUES (' + values.join() + ')';
					tx.executeSql(sql);
				});

			});
		},

		successDB: function() {
			console.log("successDB: Guardando fecha de actualización!");
			bcv.deferred.notify({
				msg: "Base de datos creada con éxito!"
			});

			var updated = new Date();
			window.localStorage.setItem("updated", updated);

			console.log("successDB: Base de datos creada con éxito!");
			bcv.init();
		},

		errorDB: function(err) {
			console.error(err);
			bcv.deferred.reject("Error en la base de datos!");
		},

		init: function() {
			console.log('init: Go bcv!');
			bcv.deferred.resolve({
				msg: "Datos actualizados!",
				count: 100
			});
		}

	};

});