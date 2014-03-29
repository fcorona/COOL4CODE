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
        Backbone = require('backbone');

    var HomeView = require('app/views/home'),
        IndicadorView = require('app/views/indicador'),
        IndicadoresView = require('app/views/indicadores'),
        ReporteView = require('app/views/reporte');

    var Datos = require('app/models/datos'),
        Reporte = require('app/models/reporte'),
        Categoria = require('app/models/categorias');


    return Backbone.Router.extend({

        routes: {
            "": "intro",
            "home": "home",
            "indicadores": "indicadores",
            "indicador/:id":  "indicador",
            "reporte" : "reporte"
        },

        initialize: function() {
            App.slider = new PageSlider($('body'));
        },

        checkConnection: function() {
            console.log("checkConnection: Comprobando conectividad a internet!");
            var networkState = navigator.connection.type;
            if (networkState == Connection.NONE || networkState == Connection.UNKNOWN) {
                console.log("checkConnection: No hay internet!");
                return false;
            } else {
                console.log("checkConnection: Si hay internet!");
                return true;
            }
        },

        intro: function() {
            if (this.checkConnection()) {

                require(['app/adapters/comovamos-init', 'app/views/intro'], function(Bcv, IntroView) {

                    App.views.intro = new IntroView();
                    App.views.intro.render();
                    App.slider.slidePage(App.views.intro.$el);

                    App.utils.bcv = new Bcv();
                    $.when(App.utils.bcv).then(function(r) {
                        App.views.intro.progressBar(r.count, r.msg);
                        setTimeout(function() {
                            App.router.navigate("home", {
                                trigger: true
                            });
                        }, 1000);
                    }, function(err) {
                        navigator.notification.alert('El repositorio de datos bogota como vamos no está disponible ó se ha perdido la conexión con la red, inténtalo más tarde!', function() {
                            Backbone.history.loadUrl("/");
                        }, 'Atención', 'Reintentar');
                    }, function(r) {
                        App.views.intro.progressBar(r.count, r.msg);
                    });

                });
            } else {
                navigator.notification.alert('No hay una conexión a internet!', function() {
                    console.log("Start again!!!");
                    Backbone.history.loadUrl("/");
                }, 'Atención', 'Reintentar');
            }
        },

        home: function() {

            var self = this;

            require(['async!https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false'], function() {

                if (self.checkConnection() && typeof google !== 'undefined') {
                    App.views.home = new HomeView();
                    App.views.home.render();
                    App.slider.slidePage(App.views.home.$el);
                } else {
                    navigator.notification.alert('No hay una conexión a internet!', function() {
                        console.log("Start again!!!");
                        Backbone.history.loadUrl("/");
                    }, 'Atención', 'Reintentar');
                }
            });
        },

        indicadores: function() {

            if (typeof App.collections.datos === "undefined")
                App.collections.datos = new Datos.Collection();
            App.collections.datos.fetch({
                "success": function() {
                    if (typeof App.views.indicadores === "undefined") {
                        App.views.indicadores = new IndicadoresView({
                            collection: App.collections.datos
                        });
                        App.views.indicadores.render();
                    } else {
                        App.views.indicadores.delegateEvents();
                    }
                    App.slider.slidePage(App.views.indicadores.$el);
                }
            });
        },

        indicador : function(id) {
            App.models.indicador = new Datos.Model({
                id: id
            });
            App.models.indicador.fetch({
                "success": function() {
                    App.slider.slidePage(new IndicadorView({
                        model: App.models.indicador
                    }).render().$el);
                }
            });
        },

        reporte : function() {
            App.models.reporte = new Reporte.Model();

            if (typeof App.collections.categories === "undefined")
                App.collections.categories = new Categoria.Collection();
            App.collections.categories.fetch({
                "success": function() {
                    App.views.reporte = new ReporteView({
                        collection : App.collections.categories,
                        model : App.models.reporte
                    });
                    App.slider.slidePage(App.views.reporte.render().$el);
                }
            });
        }

    });

});