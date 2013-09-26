
nba.LeagueGamesView = Backbone.View.extend({

  el: $('div.score-board'),

  template: _.template($('#tplLeagueGameHolder').html()),

  initialize : function() {

    this.vars = {};
    this.collection.on('add', this.render, this);
    this.collection.on('change', this.render, this);
    this.render();

  },
  render: function(){
    this.renderIndividualGames();
  },
  renderIndividualGames : function(){

    var games = this.collection.models;

    var data = {
      games: "",
    }

    for ( var x = 0; x < games.length; x++ ){
      data.games += new nba.LeagueGameView( { model : games[x]} ).$el.html();
    }

    this.$el.html(this.template(data));

    $('.slider').cycle({
      speed: 200,
      fx: 'carousel',
      timeout: 0,
      allowWrap: false,
      carouselOffset: 31,
      carouselVisible: 9,
      paused: true,
      prev: '> .prev',
      next: '> .next',
      slides: '> .item',
      log: false,
      swipe: true
    });
  }

});

nba.LeagueGameView = Backbone.View.extend({

  template  : _.template( $('#tplLeagueGame').html() ),

  initialize : function() {
        this.render();
  },
  render : function() {

      var game = this.model.attributes;

      var data = {};

      if ( +game.gamestate['status-id'] == 4 ){
        data.status = 'final';
      }
      else{
        data.status = game.game_time;
      }
      data.game_code = game.gamecode.code;

      data.home_abbr = game['home-team']['team-name'].alias;
      data.away_abbr = game['visiting-team']['team-name'].alias;

      data.home_score = +game['home-team'].linescore.score;
      data.away_score = +game['visiting-team'].linescore.score;

      if ( data.home_score > data.away_score ){
        data.home_win = 'highlighted';
      }
      else if ( data.away_score > data.home_score ){
        data.away_win = 'highlighted';
      }

      this.$el.html( this.template( data ) );

      return this;
  }

});