_.templateSettings.variable = 'data';

var Raphael = Raphael || undefined;

nba.utils = {

  parseApiUpdate : function( data ) {

    data || ( data = nba.initialUpdate );

    var obj = {

      plays         : nba.utils.getPlays( data ),
      rosters       : nba.utils.getRosters( data ),
      clock         : nba.clock.set( nba.utils.getClock( data ) ),
      awayScore     : nba.utils.getScore( data, 'visiting' ),
      homeScore     : nba.utils.getScore( data, 'home' ),
      awayTeam      : nba.awayTeam.set( nba.utils.getTeam( data, 'visiting' )),
      homeTeam      : nba.homeTeam.set( nba.utils.getTeam( data, 'home' )),
      lastGoal      : nba.lastGoal.set( nba.utils.getLastGoal( data )),
      playerStats   : nba.utils.getPlayerStats( data ),
      leaderStats   : nba.utils.getLeaderStats( data ),
      matchStats    : nba.utils.getMatchStats( data ),
      boxscore      : nba.boxscore.set( nba.utils.getBoxscore( data )),
      quarterlyStats : nba.utils.getQuarterlyStats( data ),
      teamColors    : nba.utils.assignColors ( data ),
      personalInfo  : nba.utils.getPersonalInfo( data ),
      league        : nba.utils.getLeagueUpdates( data )

    };

    return obj;

  },
  getLeagueUpdates : function( data ){

    for ( var x in data.league ){

      data.league[x].game_time = moment(data.league[x].date+' '+data.league[x].time,'YYYY-MM-DD HH:mm:ss ZZ').format('ddd h:mmA');
      data.league[x]['seq-number'] = data.league[x]['last-play']['seq-number'];
    }

    nba.leagueGames.set( data.league );

    return data.league;
  },
  getPersonalInfo : function( data ){

    var home = data.personalInfo['home_team']['nba-player'];
    var away = data.personalInfo['away_team']['nba-player'];

    var player_array = home.concat(away);


    return player_array;
  },
  assignColors : function ( data ){

    var home_abbr = data.gameInfo['home-team']['team-name'].alias.toUpperCase();
    var away_abbr = data.gameInfo['visiting-team']['team-name'].alias.toUpperCase();

    var obj = {};

    obj.homeColorAbbr = home_abbr;
    obj.homeColorHex = nba.teamColors[home_abbr].hex;
    obj[home_abbr] = home_abbr;

    console.log(home_abbr,away_abbr);

    if ( nba.teamColors[home_abbr].category == nba.teamColors[away_abbr].category ){
      obj.awayColorAbbr = 'DEFAULT';
      obj.awayColorHex = nba.teamColors['DEFAULT'].hex;
      obj[away_abbr] = 'DEFAULT';
    }
    else{
      obj.awayColorAbbr = away_abbr;
      obj.awayColorHex = nba.teamColors[away_abbr].hex;
      obj[away_abbr] = away_abbr;
    }

    nba.colors.set(obj);
    return obj;

  },
  setLeaderViewChoice : function ( choice ){

    nba.utils.leaderViewChoice = choice;

  },

  setQuarterChoice : function ( choice ){

    if ( choice != 'all'){
      choice = choice.replace(/\D/g,'');
    }
    nba.utils.quarterChoice = choice;
  },

  getQuarterlyStats : function ( data ){


    var home_id = data.gameInfo['home-team']['team-code']['global-id'];
    var away_id = data.gameInfo['visiting-team']['team-code']['global-id'];

    var final_data = {
      home_team:{
        turnovers:{},
        assists:{},
        rebounds:{},
        fouls:{}
      },
      away_team:{
        turnovers:{},
        assists:{},
        rebounds:{},
        fouls:{}
      }
    }

    var play_array = data.pbp['sports-scores']['nba-scores']['nba-playbyplay'].play;

    for (var x = 0; x < play_array.length; x++ ){

      var quarter = +play_array[x]['quarter'];



      if( play_array[x]['global-player-id-1'] && play_array[x]['quarter']){
        var side = "";
        if ( play_array[x]['team-code-1'] == home_id ){ //its a home play
          side = 'home_team';
        }
        else if ( play_array[x]['team-code-1'] == away_id ){ //its an away play
          side = 'away_team';
        }

        if ( +play_array[x]['event-id'] == 7 ){

          if(!final_data[side]['turnovers'][quarter]){
            final_data[side]['turnovers'][quarter] = {};
          }

          if(!final_data[side]['turnovers']['all']){
            final_data[side]['turnovers']['all'] = {};
          }
          if (!final_data[side]['turnovers'][quarter][play_array[x]['global-player-id-1']]){
            final_data[side]['turnovers'][quarter][play_array[x]['global-player-id-1']] = 1;
          }
          else{
            final_data[side]['turnovers'][quarter][play_array[x]['global-player-id-1']] += 1;
          }
          if (!final_data[side]['turnovers']['all'][play_array[x]['global-player-id-1']]){
            final_data[side]['turnovers']['all'][play_array[x]['global-player-id-1']] = 1;
          }
          else{
            final_data[side]['turnovers']['all'][play_array[x]['global-player-id-1']] += 1;
          }
        }
        else if ( +play_array[x]['event-id'] == 1 || +play_array[x]['event-id'] == 3 ){
          if ( +play_array[x]['global-player-id-2'] != 0 ){

            if(!final_data[side]['assists'][quarter]){
              final_data[side]['assists'][quarter] = {};
            }
            if(!final_data[side]['assists']['all']){
              final_data[side]['assists']['all'] = {};
            }
            if(!final_data[side]['assists'][quarter][play_array[x]['global-player-id-2']]){
              final_data[side]['assists'][quarter][play_array[x]['global-player-id-2']] = 1;
            }
            else{
              final_data[side]['assists'][quarter][play_array[x]['global-player-id-2']] += 1;
            }
            if(!final_data[side]['assists']['all'][play_array[x]['global-player-id-2']]){
              final_data[side]['assists']['all'][play_array[x]['global-player-id-2']] = 1;
            }
            else{
              final_data[side]['assists']['all'][play_array[x]['global-player-id-2']] += 1;
            }
          }
        }
        else if ( +play_array[x]['event-id'] == 6 || +play_array[x]['event-id'] == 5 ){

          if(!final_data[side]['rebounds'][quarter]){
            final_data[side]['rebounds'][quarter] = {};
          }
          if(!final_data[side]['rebounds']['all']){
            final_data[side]['rebounds']['all'] = {};
          }
          if(!final_data[side]['rebounds'][quarter][play_array[x]['global-player-id-1']]){
            final_data[side]['rebounds'][quarter][play_array[x]['global-player-id-1']] = 1;
          }
          else{
            final_data[side]['rebounds'][quarter][play_array[x]['global-player-id-1']] += 1;
          }
          if(!final_data[side]['rebounds']['all'][play_array[x]['global-player-id-1']]){
            final_data[side]['rebounds']['all'][play_array[x]['global-player-id-1']] = 1;
          }
          else{
            final_data[side]['rebounds']['all'][play_array[x]['global-player-id-1']] += 1;
          }
        }
        else if ( +play_array[x]['event-id'] == 8 ){
          if(!final_data[side]['fouls'][quarter]){
            final_data[side]['fouls'][quarter] = {};
          }
          if(!final_data[side]['fouls']['all']){
            final_data[side]['fouls']['all'] = {};
          }
          if(!final_data[side]['fouls'][quarter][play_array[x]['global-player-id-1']]){
            final_data[side]['fouls'][quarter][play_array[x]['global-player-id-1']] = 1;
          }
          else{
            final_data[side]['fouls'][quarter][play_array[x]['global-player-id-1']] += 1;
          }
          if(!final_data[side]['fouls']['all'][play_array[x]['global-player-id-1']]){
            final_data[side]['fouls']['all'][play_array[x]['global-player-id-1']] = 1;
          }
          else{
            final_data[side]['fouls']['all'][play_array[x]['global-player-id-1']] += 1;
          }
        }
      }
    }
    nba.quarterlyStats.set( final_data );

    return final_data;

  },
  getBoxscore : function ( data ){

    var boxscore = data.boxscore['sports-boxscores']['nba-boxscores']['nba-boxscore'];
    return boxscore;

  },

  setCourtSettings : function ( obj ){
    nba.utils.courtSettings = obj;
  },

  updateCourtView : function (){

    var obj = nba.utils.courtSettings;

    var plays = nba.plays.models;

    if( obj.goal_type == 'shots-3p' ){
      plays = _.filter(plays,function(play){
       return +play.get('points-type') == 3;
      });
    }
    else if( obj.goal_type == 'shots-field' ){
      plays = _.filter(plays,function(play){
       return +play.get('points-type') == 2 || +play.get('points-type') == 1;
      });
    }

    if( obj.view_type == 'shots' ){
      plays = _.filter(plays,function(play){
       return +play.get('event-id') == 1 || +play.get('event-id') == 3;
      });
    }
    else if( obj.view_type == 'misses'){
      plays = _.filter(plays,function(play){
       return +play.get('event-id') == 2 || +play.get('event-id') == 4;
      });
    }
    else if( obj.view_type == 'blocked shots'){
      plays = _.filter(plays,function(play){
       return play.get('blocked') == "true";
      });
    }

    //filter by quarter
    if ( obj.quarter == 'all' ){
      //dont limit any quarters
    }
    else{
      plays = _.filter(plays,function(play){
       return +play.get('quarter') == +obj.quarter.replace(/\D/g,'');
      });
    }

    //filter by player ids
    plays = _.filter(plays,function(play){

      var home_players = obj.home_player_id.split(' ');
      var away_players = obj.away_player_id.split(' ');

       return _.contains(home_players,play.get('global-player-id-1')) || _.contains(away_players,play.get('global-player-id-1'));
    });

    //filter by shot type
    /*plays = _.filter(plays,function(play){
       return +play.get('global-player-id-1') == +obj.home_player_id || +play.get('global-player-id-1') == +obj.away_player_id;
    });

    //filter by goal type
    plays = _.filter(plays,function(play){
       return +play.get('global-player-id-1') == +obj.home_player_id || +play.get('global-player-id-1') == +obj.away_player_id;
    });*/

    //obj.goal_type
    //obj.view_type

    console.log(obj);

    console.log(plays);
    nba.courtItems.reset(plays);

  },

  parseTwitterUpdate : function ( data ){

    nba.tweets.set( data );

  },

  getMatchStats : function( data ){

    var obj = data.boxscore['sports-boxscores']['nba-boxscores']['nba-boxscore']['team-stats'];

    nba.matchStats.set(obj);

    return obj;

  },
  getLeaderStats : function( data ){

    var stats = data.playerInfo;
    var players = [];

    _.each(stats,function(player){

      var pl = {};

      pl.player_code = player['player-code']['global-id'];
      pl.player_number = player['player-number'];
      pl.name = player['name'];
      pl.teamAbbr = player['team-name'].alias;

      if ( _.isArray( player['nba-player-split'] ) ){
        pl.stats = _.last(player['nba-player-split']);
      }
      else{
        pl.stats = player['nba-player-split'];
      }

      players.push(pl);

    });

    var assist_sort = _.sortBy(players,function(playa){

      return +playa.stats.assists.average;

    });
    var best_assist = _.last(assist_sort,3).reverse();

    var reb_sort = _.sortBy(players,function(playa){

      return +playa.stats.rebounds['total-average'];

    });
    var best_reb = _.last(reb_sort,3).reverse();

    var pts_sort = _.sortBy(players,function(playa){

      return +playa.stats.points.average;

    });
    var best_pts = _.last(pts_sort,3).reverse();

    //also for leaders
    var fgp_sort = _.sortBy(players,function(playa){

      return +playa.stats['field-goals'].percentage;

    });
    var best_fgp = _.last(fgp_sort,3).reverse();

    var blk_sort = _.sortBy(players,function(playa){

      return +playa.stats['blocked-shots'].average;

    });
    var best_blk = _.last(blk_sort,3).reverse();

    var stl_sort = _.sortBy(players,function(playa){

      return +playa.stats.steals.average;

    });
    var best_stl = _.last(stl_sort,3).reverse();


    var obj = {
      pts: best_pts,
      per: null,
      ast: best_assist,
      reb: best_reb,
      fgp: best_fgp,
      blk: best_blk,
      stl: best_stl
    }

    return obj;

  },
  getPlayerStats : function( data ){

    var home_stat_array = [];
    var away_stat_array = [];

    var home_team_id = data.gameInfo['home-team']['team-code']['global-id'];
    var away_team_id = data.gameInfo['visiting-team']['team-code']['global-id'];

    var obj = {};

    _.each(data.playerInfo,function(player){
      var pl = {};

      pl.player_code = player['player-code']['global-id'];
      pl.player_number = player['player-number'];
      pl.name = player['name'];
      pl.teamAbbr = player['team-name'].alias;

      if ( _.isArray( player['nba-player-split'] ) ){
        pl.stats = _.last(player['nba-player-split']);
      }
      else{
        pl.stats = player['nba-player-split'];
      }

      if ( player['team-code']['global-id'] == home_team_id ){
        home_stat_array.push(pl);
      }
      else{
        away_stat_array.push(pl);
      }

    });

    home_stat_array = _.sortBy(home_stat_array,function(pla){
      return +pla.stats.points.average;
    }).reverse();

    away_stat_array = _.sortBy(away_stat_array,function(pla){
      return +pla.stats.points.average;
    }).reverse();

    var obj = {
      home_team : home_stat_array,
      away_team : away_stat_array
    }


    return obj;

  },
  getLastGoal : function( data ){

    var array = data.pbp['sports-scores']['nba-scores']['nba-playbyplay'].play;

    var last_goal = null;
    var index = array.length-1;

    while (!last_goal && index >= 0 ){
      if ( +array[index]['points-type'] > 0 && array[index]['textual-description'].indexOf("misses") == -1){
            last_goal = array[index];
        }
      index--;
    }

    return last_goal;
  },

  getScore : function( data, side ){

    return data.gameInfo[side+'-team-score'].score;

  },
  getTeam : function( data, side ){

    return data.gameInfo[side+'-team'];

  },
  getPlays : function( data ){

    var play_array = data.pbp['sports-scores']['nba-scores']['nba-playbyplay'].play;

    var no_starting_lineup = _.filter(play_array,function(play){
      return  play['textual-description'] != 'Starting Lineup';
    })

    nba.plays.set( no_starting_lineup );

    return no_starting_lineup;

  },
  getClock : function( data ){

    var last_play = _.last(data.pbp['sports-scores']['nba-scores']['nba-playbyplay'].play);

    var obj = {};

    if ( +last_play.quarter == 1 ) obj.quarter = '1ST';
    else if ( +last_play.quarter == 2 ) obj.quarter = '2ND';
    else if ( +last_play.quarter == 3 ) obj.quarter = '3RD';
    else if ( +last_play.quarter == 4 ) obj.quarter = '4TH';
    else obj.quarter = '?';

    if ( +last_play['time-seconds'] < 10 ){
      last_play['time-seconds'] = '0'+last_play['time-seconds'];
    }

    obj.quarter_number = +last_play.quarter;

    obj.clock = last_play['time-minutes']+':'+last_play['time-seconds'];

    return obj;
  },
  getRosters : function( data ){

    var home_team = data.boxscore['sports-boxscores']['nba-boxscores']['nba-boxscore']['player-stats']['home-player-stats'];

    for ( var x = 0; x < home_team.length; x++ ){
      home_team[x].player_id = home_team[x]['player-code']['global-id'];
    }

    var away_team = data.boxscore['sports-boxscores']['nba-boxscores']['nba-boxscore']['player-stats']['visiting-player-stats'];

    for ( var x = 0; x < away_team.length; x++ ){
      away_team[x].player_id = away_team[x]['player-code']['global-id'];
    }

    var obj = {
      home_team: home_team,
      away_team: away_team
    }

    nba.homeTeamRoster.set( home_team );
    nba.awayTeamRoster.set( away_team );

    return obj;

  }

}