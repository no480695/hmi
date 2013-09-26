nba.CourtView = Backbone.View.extend({

  el: $("div[data-tab-id='#court']"),

  template: _.template($('#tplCourtView').html()),

  initialize : function() {

    this.render();

  },

  render : function() {

    var players = nba.gameState.get('playerStats');

    var data = players;

    this.$el.html(this.template(data));

  },

  updateCourtCollection : function( obj ){

   //TODO
   //get current stuff after cha nging players and update the court Items collection

   nba.utils.setCourtSettings( obj );
   nba.utils.updateCourtView();

  }

});