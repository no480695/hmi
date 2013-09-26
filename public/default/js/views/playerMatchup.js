nba.PlayerMatchup = Backbone.View.extend({

  el: $("div[data-tab-id='#matchup']"),

  template: _.template($('#tplPlayerMatchup').html()),

  initialize : function() {

    nba.homeTeamRoster.on('change', this.render, this );
    nba.awayTeamRoster.on('change', this.render, this );

    this.home_abbr = nba.colors.get('homeColorAbbr');
    this.away_abbr = nba.colors.get('awayColorAbbr');

    this.render();

  },

  render : function() {

    var players = nba.gameState.get('playerStats');
    var leaders = nba.gameState.get('leaderStats');

    var home_team_id = nba.homeTeam.get('team-code')['global-id'];
    var away_team_id = nba.awayTeam.get('team-code')['global-id'];

    var data = players;

    data.homeAbbr = this.home_abbr;
    data.awayAbbr = this.away_abbr;

    var first_player_home = players.home_team[0];
    var first_player_away = players.away_team[0];
    data.player_photo_away = first_player_away.player_code;
    data.player_photo_home = first_player_home.player_code;

    data.home_ast = first_player_home.stats.assists.average;
    data.home_ast_height = (data.home_ast/leaders.ast[0].stats.assists.average)*165;
    if ( data.home_ast_height > 165 ) data.home_ast_height = 165;
    data.home_ast_margin = 165 - data.home_ast_height;

    data.away_ast = first_player_away.stats.assists.average;
    data.away_ast_height = (data.away_ast/leaders.ast[0].stats.assists.average)*165;
    if ( data.away_ast_height > 165 ) data.away_ast_height = 165;
    data.away_ast_margin = 165 - data.away_ast_height;

    data.away_reb = first_player_away.stats.rebounds['total-average'];
    data.away_reb_height = (data.away_reb/leaders.reb[0].stats.rebounds['total-average'])*165;
    if ( data.away_reb_height > 165 ) data.away_reb_height = 165;
    data.away_reb_margin = 165 - data.away_reb_height;

    data.home_reb = first_player_home.stats.rebounds['total-average'];
    data.home_reb_height = (data.home_reb/leaders.reb[0].stats.rebounds['total-average'])*165;
    if ( data.home_reb_height > 165 ) data.home_reb_height = 165;
    data.home_reb_margin = 165 - data.home_reb_height;


    data.home_pts = first_player_home.stats.points.average;
    data.home_pts_height = (data.home_pts/leaders.pts[0].stats.points.average)*165;
    if ( data.home_pts_height > 165 ) data.home_pts_height = 165;
    data.home_pts_margin = 165 - data.home_pts_height;

    data.away_pts = first_player_away.stats.points.average;
    data.away_pts_height = (data.away_pts/leaders.pts[0].stats.points.average)*165;
    if ( data.away_pts_height > 165 ) data.away_pts_height = 165;
    data.away_pts_margin = 165 - data.away_pts_height;

    this.$el.html(this.template(data));

  },

  renderStats : function( player_code, select_side ){

    var side = select_side.split('-')[1];

    var players = nba.gameState.get('playerStats');

    var leaders = nba.gameState.get('leaderStats');

    var array = players.home_team.concat(players.away_team);

    var player = _.find(array, function(num){ return num.player_code == player_code; });

    var player_ast_height = (player.stats.assists.average/leaders.ast[0].stats.assists.average)*165;
    if ( player_ast_height > 165 ) player_ast_height = 165;
    var player_ast_margin = 165 - player_ast_height;

    $('.'+side+'-stat.'+side+'-ast.stat-col').animate({'height':player_ast_height,'margin-top':player_ast_margin});
    $('.'+side+'-stat.'+side+'-ast.stat-col').html(player.stats.assists.average);

    var player_reb_height = (player.stats.rebounds['total-average']/leaders.reb[0].stats.rebounds['total-average'])*165;
    if ( player_reb_height > 165 ) player_reb_height = 165;
    var player_reb_margin = 165 - player_reb_height;

    $('.'+side+'-stat.'+side+'-reb.stat-col').animate({'height':player_reb_height,'margin-top':player_reb_margin});
    $('.'+side+'-stat.'+side+'-reb.stat-col').html(player.stats.rebounds['total-average']);

    var player_pts_height = (player.stats.points.average/leaders.pts[0].stats.points.average)*165;
    if ( player_pts_height > 165 ) player_pts_height = 165;
    var player_pts_margin = 165 - player_pts_height;

    $('.'+side+'-stat.'+side+'-pts.stat-col').animate({'height':player_pts_height,'margin-top':player_pts_margin});
    $('.'+side+'-stat.'+side+'-pts.stat-col').html(player.stats.points.average);

    $('.'+side+'player_card').attr('id','player-'+player_code);

    $('#primary_'+select_side.split('matchup-')[1]+'_matchup_image').attr('src','/common/img/large/'+player.player_code+'.png');

  }

});