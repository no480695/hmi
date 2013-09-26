
nba.MatchupLeaderPieView = Backbone.View.extend({

  initialize : function() {

    this.vars = {};
    this.vars.size =     140;         // Canvas size;
    this.vars.aspd =     500;
    this.vars.sw =       5;          // Border width;
    this.vars.r =        (this.vars.size - this.vars.sw) / 2;    // Radius;
    this.vars.strp =     83;          // Strikes percentage;
    this.vars.arc =      null;
    this.vars.home_text= null;
    this.vars.away_text= null;
    this.vars.homeColor = nba.colors.get('homeColorHex');
    this.vars.awayColor = nba.colors.get('awayColorHex');

    this.model.on( 'change', this.render, this );

  },

  render : function( model ) {

    this.setRaphael();
    this.renderClock();

  },
  setRaphael : function(){

    if (this.vars.paper) {
        return;
    }
    this.vars.$graph =   $('#matchLeaderPie');
    this.vars.paper =    Raphael('matchLeaderPie', this.vars.size, this.vars.size);

// Ball to strike graph;
    this.vars.paper.customAttributes.arc = function (w, h, value, total, r) {
      var a = value,
        aR = a * (Math.PI / 180),
        x = w / 2 - r * Math.sin(aR),
        y = h / 2 + r * Math.cos(aR),
        moveTo = ['M', w / 2, (h - 5 / 2)],
        path;

      if (total === value) {
        path = [moveTo, ['A', r, r, 0, 1, 0, x - 0.01, y]];
      } else {
        path = [moveTo, ['A', r, r, 0, +(a > 180), 1, x, y]];
      }

      return {path: path};
    };

    this.vars.background = this.vars.paper.circle(this.vars.size / 2, this.vars.size / 2, this.vars.r).attr({
      'stroke': '#212121',
      'fill' : '#212121',
      'stroke-width': this.vars.sw
    });

    // Draw circle;
    this.vars.background_arc = this.vars.paper.circle(this.vars.size / 2, this.vars.size / 2, this.vars.r).attr({
      'stroke': this.vars.awayColor,
      'stroke-width': this.vars.sw
    });

    this.vars.background = this.vars.paper.circle(this.vars.size / 2, this.vars.size / 2, this.vars.r).attr({
      'stroke': this.vars.awayColor,
      'stroke-width': this.vars.sw
    });

    // Draw arc;
    this.vars.arc = this.vars.paper.path().attr({
      'stroke': this.vars.homeColor,
      'stroke-width': this.vars.sw,
      arc: [this.vars.size, this.vars.size, 0, 360, this.vars.r]
    });

    this.vars.home_text = this.vars.paper.text(39, 70, "").attr({
          font: '50px Arial',
          fill: this.vars.homeColor,
          'text-anchor': 'middle'
      }).toFront();

    this.vars.away_text = this.vars.paper.text(102, 70, "").attr({
        font: '50px Arial',
        fill: this.vars.awayColor,
        'text-anchor': 'middle'
    }).toFront();

  },

  renderClock : function() {



    var view = nba.utils.leaderViewChoice || 'assists';
    var sq = nba.utils.quarterChoice || 'all';

    var home_team_abbr = nba.homeTeam.get('team-name').alias.toUpperCase();
    var away_team_abbr = nba.awayTeam.get('team-name').alias.toUpperCase();

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

    var home_player_amount = +home_player.val;
    var away_player_amount = +away_player.val;

    var tot_amount  = home_player_amount+away_player_amount;

    var arc_amount = Math.ceil((home_player_amount/tot_amount)*360);

    if ( arc_amount > 360 ) arc_amount = 360;

    this.vars.background.animate({
      stroke: this.vars.awayColor
    }, this.vars.aspd, 'elastic');

    this.vars.arc.animate({
      arc: [this.vars.size, this.vars.size, arc_amount, 360, this.vars.r]
    }, this.vars.aspd, 'elastic');

    this.vars.home_text.stop().animate({ opacity: 0 }, textSpeed, '>', function(){
        this.attr({ text: home_player_amount }).animate({ opacity: 1 }, textSpeed, '<');
    });

    this.vars.away_text.stop().animate({ opacity: 0 }, textSpeed, '>', function(){
        this.attr({ text: away_player_amount }).animate({ opacity: 1 }, textSpeed, '<');
    });

    return this;

  }

});
