nba.MatchStatsView = Backbone.View.extend({

  el: $("div.match-bar"),

  template: _.template($('#tplMatchStats').html()),

  initialize : function() {

    this.model.on('change', this.render, this );
    this.render();



  },

  render : function() {
    //this.$el.html(this.template(data));
    this.awayAbbr = nba.awayTeam.get('team-name').alias.toUpperCase();
    this.homeAbbr = nba.homeTeam.get('team-name').alias.toUpperCase();

    this.$el.html('');

    this.renderArea('q-shots',this.calcShots(),'light');
    this.renderArea('q-misses',this.calcMisses(),'dark');
    this.renderArea('q-assists',this.calcAssists(),'light');
    this.renderArea('q-rebounds',this.calcRebounds(),'dark');
    this.renderArea('q-bshots',this.calcBlocks(),'light');
    this.renderArea('q-turnovers',this.calcTurnovers(),'dark');
    this.renderArea('q-fouls',this.calcFouls(),'light');


  },
  renderArea : function( area, values, shade ){

    var data = {
        shade: shade,
        area: area,
        amount_home: values.home_val,
        amount_away: values.away_val,
        teamAbbr_home: nba.colors.get('homeColorAbbr'),
        teamAbbr_away: nba.colors.get('awayColorAbbr'),
    }

    this.$el.append(this.template(data));

  },
  calcShots: function(){
    var obj = {
        home_val: this.model.attributes['home-team-stats']['field-goals'].made,
        away_val: this.model.attributes['visiting-team-stats']['field-goals'].made
    }
    return obj;
  },
  calcAssists : function(){
    var obj = {
        home_val: this.model.attributes['home-team-stats'].assists.assists,
        away_val: this.model.attributes['visiting-team-stats'].assists.assists
    }
    return obj;
  },
  calcRebounds : function(){
    var obj = {
        home_val: this.model.attributes['home-team-stats'].rebounds.total,
        away_val: this.model.attributes['visiting-team-stats'].rebounds.total
    }
    return obj;
  },
  calcBlocks : function(){
    var obj = {
        home_val: this.model.attributes['home-team-stats']['blocked-shots']['blocked-shots'],
        away_val: this.model.attributes['visiting-team-stats']['blocked-shots']['blocked-shots']
    }
    return obj;
  },
  calcTurnovers : function(){
    var obj = {
        home_val: this.model.attributes['home-team-stats']['turnovers']['turnovers'],
        away_val: this.model.attributes['visiting-team-stats']['turnovers']['turnovers']
    }
    return obj;
  },
  calcFouls : function(){

    var obj = {
        home_val: this.model.attributes['home-team-stats']['personal-fouls'].fouls,
        away_val: this.model.attributes['visiting-team-stats']['personal-fouls'].fouls
    }
    return obj;
  },

  calcMisses : function(){

    var home_total = +this.model.attributes['home-team-stats']['field-goals'].attempted - +this.model.attributes['home-team-stats']['field-goals'].made;
    var away_total = +this.model.attributes['visiting-team-stats']['field-goals'].attempted - +this.model.attributes['visiting-team-stats']['field-goals'].made;

    var obj = {
        home_val: home_total,
        away_val: away_total
    }
    return obj;
  },

});