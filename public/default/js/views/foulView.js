nba.FoulView = Backbone.View.extend({

  el: $("div[data-tab-id='#fouls-table']"),

  template: _.template($('#tplFoulsView').html()),

  initialize : function() {

    this.model.on('change', this.render, this )
    this.home_abbr = nba.colors.get('homeColorAbbr');
    this.away_abbr = nba.colors.get('awayColorAbbr');
    this.render();

  },

  render : function() {

    var data = this.getDataForSelection();

    this.$el.html( this.template(data) );

  },

  getDataForSelection : function(){

    var sq = nba.utils.quarterChoice || 'all';
    var data = {};

    var home_roster = nba.homeTeamRoster.models;
    var away_roster = nba.awayTeamRoster.models;

    data.home_team_abbr = this.home_abbr;
    data.away_team_abbr = this.away_abbr;

    var home_team_fouls = this.model.get('home_team').fouls[sq];
    var away_team_fouls = this.model.get('away_team').fouls[sq];

    //console.log(home_team_fouls);

    var home_array = [];
    var away_array = [];

    for(var prop in home_team_fouls) {
        var val = home_team_fouls[prop];
        var found_player = _.find( home_roster, function(player){
          return player.attributes['player-code']['global-id'] == prop;
        });
        var name = found_player.attributes.name['first-name']+' '+found_player.attributes.name['last-name'];

        var obj = {
          name: name,
          val: val
        }
        home_array.push(obj);
    }

    for(var prop in away_team_fouls) {
        var val = away_team_fouls[prop];
        var found_player = _.find( away_roster, function(player){
          return player.attributes['player-code']['global-id'] == prop;
        });
        var name = found_player.attributes.name['first-name']+' '+found_player.attributes.name['last-name'];

        var obj = {
          name: name,
          val: val
        }
        away_array.push(obj);
    }

    var home_array = _.sortBy(home_array, function(pl){ return pl.val; }).reverse();
    var away_array = _.sortBy(away_array, function(pl){ return pl.val; }).reverse();

    if ( home_array[0] ){
      data.home_first_value = home_array[0].val;
      data.home_first_name = home_array[0].name;
    }
    else{
      data.home_first_value = '-';
    }
    if ( home_array[1] ){
      data.home_second_value = home_array[1].val;
      data.home_second_name = home_array[1].name;
    }
    else{
      data.home_second_value = '-';
    }
    if ( home_array[2] ){
      data.home_third_value = home_array[2].val;
      data.home_third_name = home_array[2].name;
    }
    else{
      data.home_third_value = '-';
    }
    if ( home_array[3] ){
      data.home_fourth_value = home_array[3].val;
      data.home_fourth_name = home_array[3].name;
    }
    else{
      data.home_fourth_value = '-';
    }
    if ( away_array[0] ){
      data.away_first_value = away_array[0].val;
      data.away_first_name = away_array[0].name;
    }
    else{
      data.away_first_value = '-';
    }
    if ( away_array[1] ){
      data.away_second_value = away_array[1].val;
      data.away_second_name = away_array[1].name;
    }
    else{
      data.away_second_value = '-';
    }
    if ( away_array[2] ){
      data.away_third_value = away_array[2].val;
      data.away_third_name = away_array[2].name;
    }
    else{
      data.away_third_value = '-';
    }
    if ( away_array[3] ){
      data.away_fourth_value = away_array[3].val;
      data.away_fourth_name = away_array[3].name;
    }
    else{
      data.away_fourth_value = '-';
    }

    return data;
  }

});