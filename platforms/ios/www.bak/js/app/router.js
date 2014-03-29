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


    return Backbone.Router.extend({

        routes: {
            "": "intro",
            "home": "home"
        },

        initialize: function() {
            App.slider = new PageSlider($('#content'));
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

                require(['app/adapters/comovamos-data', 'app/views/intro'], function(Bcv, IntroView) {

                    App.views.intro = new IntroView();
                    App.views.intro.render();

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
            
        }
        
    });

});