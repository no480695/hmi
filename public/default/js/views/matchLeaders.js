nba.MatchupLeaderView = Backbone.View.extend({

  el: $("div#match-leader-stuff"),

  template: _.template($('#tplMatchupLeaders').html()),

  initialize : function() {

    this.model.on('change', this.render, this );

    this.render();

  },
  render : function( model ) {

    var data = this.getDataForSelection();

    this.$el.html( this.template(data) );

  },
  getDataForSelection : function(){

    var view = nba.utils.leaderViewChoice || 'assists';
    var sq = nba.utils.quarterChoice || 'all';

    var data = {};

    var home_roster = nba.homeTeamRoster.models;
    var away_roster = nba.awayTeamRoster.models;

    data.home_team_abbr = nba.colors.get('homeColorAbbr');
    data.away_team_abbr = nba.colors.get('awayColorAbbr');

    var home_team_info = this.model.get('home_team')[view][sq];
    var away_team_info = this.model.get('away_team')[view][sq];

    var array_home = [];

    for ( var prop in home_team_info ){
      array_home.push(
        {
          id:prop,
          val: home_team_info[prop]
        }
      );
    }

    var array_away = [];

    for ( var prop in away_team_info ){
      array_away.push(
        {
          id:prop,
          val: away_team_info[prop]
        }
      );
    }

    var home_player = _.max( array_home, function(player){ return player.val; });
    var away_player = _.max( array_away, function(player){ return player.val; });

    var found_home = _.find( home_roster, function(player){
      return player.attributes['player-code']['global-id'] == home_player.id;
    });
    var found_away = _.find( away_roster, function(player){
      return player.attributes['player-code']['global-id'] == away_player.id;
    });
    var home_name = found_home.attributes.name['first-name']+' '+found_home.attributes.name['last-name'];
    var away_name = found_away.attributes.name['first-name']+' '+found_away.attributes.name['last-name'];

    data.home_player_name = home_name;
    data.away_player_name = away_name;
    data.home_player_id = home_player.id;
    data.away_player_id = away_player.id;
    return data;
  }

});