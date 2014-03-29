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
            "": "home"
        },

        initialize: function() {
            App.slider = new PageSlider($('#content'));
        },

        home: function() {
            
        }
        
    });

});