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

		dimensiones: [],

		categorias: [],

		datos: [],

		checkUpdatedData: function() {
			console.log("checkUpdatedData: Comprobando si los datos están actualizados!");
			bcv.deferred.notify({
				msg: "Comprobando datos actualizados!",
				count: 0
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

		loadDimensiones: function() {
			console.log("loadDimensiones: Consultando datos BOGOTA COMO VAMOS!");
			bcv.deferred.notify({
				msg: "Descargando datos: Dimensiones!",
				count: 10
			});
			var url = "http://api.bogotacomovamos.org/api/dimensions/3?key=comovamos";
			var xhr = bcv.getJson(url);
			xhr.success(function(r) {
				console.log("loadDimensiones: Descarga completa!");
				bcv.dimensiones.push(r);
				bcv.loadCategorias();
			});
			console.log("loadDimensiones: " + url);
		},

		loadCategorias: function() {
			console.log("loadCategorias: Consultando datos BOGOTA COMO VAMOS!");
			bcv.deferred.notify({
				msg: "Descargando datos: Categorias!",
				count: 20
			});

			var items = [];
			$.each(this.dimensiones, function(k1, v1) {
				$.each(v1, function(k2, v2) {
					if (k2 === "categories") {
						$.each(v2, function(k3, v3) {
							$.each(v3, function(k4, v4) {
								if (k4 === "href") {
									items.push(d(v4));
								}
							});
						});
					}
				});
			});
			$.when.apply($, items).done(bcv.loadDatos);

			function d(ref) {
				console.log("loadCategorias: " + ref);
				var def = $.Deferred();
				var xhr = bcv.getJson(ref);
				xhr.success(function(r) {
					console.log("loadCategorias: Descarga completa!");
					bcv.categorias.push(r);
					def.resolve();
				});
				return def.promise();
			}
		},

		loadDatos: function() {
			console.log("loadDatos: Consultando datos BOGOTA COMO VAMOS!");
			bcv.deferred.notify({
				msg: "Descargando datos: Datos!",
				count: 40
			});

			var items = [];
			$.each(bcv.categorias, function(k1, v1) {
				$.each(v1, function(k2, v2) {
					if (k2 === "datas") {
						$.each(v2, function(k3, v3) {
							$.each(v3, function(k4, v4) {
								if (k4 === "href") {
									items.push(d(v4));
								}
							});
						});
					}
				});
			});
			$.when.apply($, items).done(bcv.createDB);

			function d(ref) {
				console.log("loadDatos: " + ref);
				var def = $.Deferred();
				var xhr = bcv.getJson(ref);
				xhr.success(function(r) {
					console.log("loadDatos: Descarga completa!");
					bcv.datos.push(r);
					def.resolve();
				});
				return def.promise();
			}
		},

		getJson: function(url) {
			return $.ajax({
				type: "GET",
				url: url,
				dataType: 'json',
				error: function() {
					console.error("El repositorio de datos bogota BOGOTA COMO VAMOS no está disponible ó se ha perdido la conexión con la red!");
					navigator.notification.alert('El repositorio de datos bogota BOGOTA COMO VAMOS no está disponible ó se ha perdido la conexión con la red, inténtalo más tarde!', function() {}, 'Atención', 'Reintentar');
				}
			});
		},

		createDB: function() {
			console.log("createDB: Creando base de datos!");
			bcv.deferred.notify({
				msg: "Creando base de datos!",
				count: 50
			});
			var db = window.openDatabase("comovamos", "1.0", "BCV - Bogota BOGOTA COMO VAMOS", 4145728);
			db.transaction(bcv.populateDB, bcv.errorDB, bcv.successDB);
		},

		populateDB: function(tx) {
			console.log("populateDB: Creando tablas!");
			bcv.deferred.notify({
				msg: "Insertando datos!",
				count: 60
			});

			var tables = [{
				name: "dimensiones",
				fields: [],
				data: "dimensiones"
			}, {
				name: "categorias",
				fields: [],
				data: "categorias"
			}, {
				name: "datos",
				fields: [],
				data: "datos"
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
						var v;
						if (typeof v2 === "object") {
							v = JSON.stringify(v2);
						} else {
							v = v2;
						}
						values.push("'" + v + "'");
					});
					if (values.length === v.fields.length) {
						var sql = 'INSERT INTO ' + v.name + ' (' + v.fields.join() + ') VALUES (' + values.join() + ')';
						tx.executeSql(sql);
					} else {
						console.error("El registro " + values.join() + " no coincide el numero de columnas!");
					}
				});

			});
		},

		successDB: function() {
			console.log("successDB: Guardando fecha de actualización!");
			bcv.deferred.notify({
				msg: "Base de datos creada con éxito!",
				count: 80
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
				count: 0
			});
		}

	};

	return function() {
		if (bcv.checkUpdatedData()) {
			bcv.init();
		} else {
			bcv.loadDimensiones();
		}

		return bcv.deferred.promise();
	};

});