nba.BoxscoreView = Backbone.View.extend({

  el: $('div[data-tab-id="#boxscore"]'),

  template  : _.template( $('#tplBoxscore').html() ),

  initialize : function() {


    this.vars = {};
    this.vars.home_team_city = nba.homeTeam.get('team-city').city;
    this.vars.home_team_name = nba.homeTeam.get('team-name').name;
    this.vars.away_team_city = nba.awayTeam.get('team-city').city;
    this.vars.away_team_name = nba.awayTeam.get('team-name').name;
    this.model.on('change', this.render, this );
    this.render();

  },
  render : function(){

    var home_team = this.model.get('player-stats')['home-player-stats'];
    var away_team = this.model.get('player-stats')['visiting-player-stats'];

    var home_player_array = [];
    var away_player_array = [];

    for( var x = 0; x < home_team.length; x++ ){
      var player = new nba.BoxscorePlayerRow( { model : home_team[x] } ).el;
      home_player_array.push(player);
    }

    for( var x = 0; x < away_team.length; x++ ){
      var player = new nba.BoxscorePlayerRow( { model : away_team[x] } ).el;
      away_player_array.push(player);
    }

    var data = {
      home_player_array: home_player_array,
      away_player_array: away_player_array,
      home_full_name: this.vars.home_team_city+' '+this.vars.home_team_name,
      away_full_name: this.vars.away_team_city+' '+this.vars.away_team_name,
    }
    this.$el.html( this.template( data ) );

  }

});

nba.BoxscorePlayerRow = Backbone.View.extend({

  template  : _.template( $('#tplBoxscorePlayerRow').html() ),

  initialize : function() {
        this.render();
  },
  render : function() {

      var data = {
        player_name: this.model.name['first-name'][0].toUpperCase()+'. '+this.model.name['last-name'].toUpperCase(),
        pos: this.model.games.position,
        min: this.model.minutes.minutes,
        fgm_a: this.model['field-goals'].made+'/'+this.model['field-goals'].attempted,
        three_pm_a: this.model['three-point-field-goals'].made+'/'+this.model['three-point-field-goals'].attempted,
        ftm_a: this.model['free-throws'].made+'/'+this.model['free-throws'].attempted,
        plus_minus: this.model['plus-minus'].number,
        off: this.model.rebounds.offensive,
        def: this.model.rebounds.defensive,
        tot: this.model.rebounds.total,
        ast: this.model.assists.assists,
        pf: this.model['personal-fouls'].fouls,
        st: this.model.steals.steals,
        to: this.model.turnovers.turnovers,
        bs: this.model['blocked-shots']['blocked-shots'],
        pts: this.model.points.points
      };

      this.el = this.template( data );
      //this.$el.html( this.template( data ) );
      return this;
  }

});