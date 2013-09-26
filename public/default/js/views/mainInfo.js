nba.MainScore = Backbone.View.extend({

  initialize : function() {


    this.setColor();
    this.render();
    nba.gameState.on('change:' + this.options.teamSide + 'Score', this.updateScore, this );
  },

  render : function() {

    this.updateScore();

  },

  updateScore : function() {
     var score = nba.gameState.get( this.options.teamSide + 'Score' );

     $(".score.score_" + this.options.teamSide).html(score);

    return this;
  },

  setColor: function(){

    $(".score.score_" + this.options.teamSide).addClass('TEAM-COLOR-'+nba.colors.get(this.options.teamSide+'ColorAbbr'));

  }

});


nba.MainTeamName = Backbone.View.extend({

  initialize : function() {

    this.render();
    nba.gameState.on('change:' + this.options.teamSide + 'Team', this.updateName, this );
  },

  render : function() {

    this.updateName();

  },

  updateName : function() {
     var team_city = nba.gameState.get( this.options.teamSide + 'Team' ).get('team-city').city;

     $(".team.team_" + this.options.teamSide).html(team_city);

    return this;
  }

});

nba.LastGoal = Backbone.View.extend({

  initialize : function() {

    this.render();
    this.model.on('add', this.getTeamSide, this );
  },

  render : function() {

    this.getTeamSide();

  },
  getTeamSide : function(){

    var current_team_code = this.model.get('team-code-1');
    var home_team_code = nba.gameState.get('homeTeam').get('team-code').id;

    var side = '';

    if ( +current_team_code == +home_team_code ){
      side = 'home';
    }
    else{
      side = 'away';
    }

    this.updateLastGoal(side);
  },
  updateLastGoal : function( side ) {

    var goal_type =  this.model.get('points-type') + ' PTS ';
    var goal_author = this.model.get('first-name-1').charAt(0) + '.' + this.model.get('last-name-1');

    $('.goal_'+side).children('.goal-type').html(goal_type);
    $('.goal_'+side).children('.goal-author').html(goal_author);

    if ( side == 'home' ){
      $('.goal_away').fadeOut();
      $('.goal_home').fadeIn();
    }
    else{
      $('.goal_home').fadeOut();
      $('.goal_away').fadeIn();
    }

    return this;
  }

});