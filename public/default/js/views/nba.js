nba.NbaView = Backbone.View.extend({

  el : $('#logoWrapper'),

  initialize : function() {

    this.determineGameStatus();
    this.model.on( 'change:renderType', this.determineGameStatus, this );
  },

  determineGameStatus : function() {

    if ( this.model.get('renderType') == 'preview' ) {

      this.renderPreview();

    } else if ( this.model.previous('renderType') != 'delay' ) {

      this.renderGameView();
      //this.renderPreview();

    }

  },

  renderPreview : function() {

    nba.awayTeamScore = new nba.MainScore({
      model : nba.gameState.get('awayScore'),
      teamSide : 'away'
    });

    nba.homeTeamScore = new nba.MainScore({
      model : nba.gameState.get('homeScore'),
      teamSide : 'home'
    });

    nba.awayTeamName = new nba.MainTeamName({
      model : nba.gameState.get('awayTeam'),
      teamSide : 'away'
    });

    nba.homeTeamName = new nba.MainTeamName({
      model : nba.gameState.get('homeTeam'),
      teamSide : 'home'
    });
    // TODO make preview state
    nba.clockView = new nba.ClockView({

      model : nba.gameState.get('clock')

    });

    nba.leagueGamesView = new nba.LeagueGamesView({

      collection: nba.leagueGames

    });

  },

  renderGameView : function() {
    /********************************************************
     * Instantiate all the views needed for the live game
     ********************************************************/

     $('.secondary-stat').css('display','block');
     $('.primary-stat').css('display','block');

    nba.awayTeamScore = new nba.MainScore({
      model : nba.gameState.get('awayScore'),
      teamSide : 'away'
    });

    nba.homeTeamScore = new nba.MainScore({
      model : nba.gameState.get('homeScore'),
      teamSide : 'home'
    });

    nba.awayTeamName = new nba.MainTeamName({
      model : nba.gameState.get('awayTeam'),
      teamSide : 'away'
    });

    nba.homeTeamName = new nba.MainTeamName({
      model : nba.gameState.get('homeTeam'),
      teamSide : 'home'
    });

    nba.lastGoalView = new nba.LastGoal({
      model : nba.lastGoal
    });

    // Play By Play
    nba.momentumChart = new nba.MomentumChart({

      collection : nba.plays,
      container : 'momentum'

    });

    nba.courtItems.set(nba.plays.models);

    nba.courtView = new nba.CourtView({


    });

    nba.boxscoreView = new nba.BoxscoreView({

      model: nba.boxscore

    });

    nba.fullCourtChart = new nba.FullCourtChart({

      collection : nba.courtItems,
      container : 'fullCourtChart',
      homeTeamID : nba.homeTeam.get('team-code')['global-id'],
      awayTeamID : nba.awayTeam.get('team-code')['global-id']

    });

    nba.matchupLeader = new nba.MatchupLeaderView({

      model: nba.quarterlyStats,

    });

    nba.playerCard = new nba.PlayerCard;

    nba.foulView = new nba.FoulView({

      model: nba.quarterlyStats,

    });

    nba.probChart = new nba.ProbMeter({

      collection : nba.plays,
      container : 'prob-chart'

    });

    nba.matchStatsView = new nba.MatchStatsView({

      model : nba.matchStats,

    });

    nba.homeTeamView = new nba.RosterView({

      collection : nba.homeTeamRoster,
      teamSide : 'home',
      show : true

    });

    nba.awayTeamView = new nba.RosterView({

      collection : nba.awayTeamRoster,
      teamSide : 'away'

    });

    nba.clockView = new nba.ClockView({

      model : nba.gameState.get('clock')

    });

    nba.matchupLeaderPieView = new nba.MatchupLeaderPieView({

      model : nba.quarterlyStats

    });

    nba.playerMatchup = new nba.PlayerMatchup({


    });

    nba.leaderList = new nba.LeaderList({

      collection: nba.gameState.get('leaderStats')

    });

    nba.horizontalTweetList = new nba.HorizontalTweetList({

      collection: nba.tweets

    });

    nba.horizontalPlayList = new nba.HorizontalPlays({

      collection: nba.plays

    });

    nba.leagueGamesView = new nba.LeagueGamesView({

      collection: nba.leagueGames

    });

  }

});

nba.nbaView = new nba.NbaView({
  model : nba.gameState
});