/*
============================================================
VIEW: Main Center Scroller
============================================================
*/

var graphHeight = 300;
var textSpeed = 100;

nba.ProbMeter = Backbone.View.extend({

  initialize : function() {

    this.collection.on( 'add', this.addPlay, this );

    this.vars = {};
    this.vars.width   = 900;
    this.vars.height  = 81;
    this.vars.$graph  =   $('#'+this.options.container);
    this.vars.paper   =    Raphael(this.options.container, this.vars.width, this.vars.height);
    this.vars.awayColor = nba.colors.get('awayColorHex');
    this.vars.homeColor = nba.colors.get('homeColorHex');

    this.renders();

  },

  renders : function() {

    this.home_id = nba.homeTeam.get('team-code')['global-id'];

    this.processEvents(this.collection.models);
    // Create containers

    return this;

  },

  processEvents : function(array){

    this.temp_events = [];

    for ( var x = 0; x < array.length; x++ ){
        if ( +array[x].attributes['points-type'] > 0 && array[x].attributes['textual-description'].indexOf("misses") == -1){
            this.addEvent(array[x].attributes);
        }
    }

    this.compareInput();

  },
  temp_events: [],
  full_events: [],
  events: [],
  current_min: 0,
  current_max: 0,
  event_data:[],
  away_start: 0,
  home_start: 0,
  away_end: 0,
  home_end: 0,
  addEvent : function( item ){
    var new_event = {};

    if ( item['team-code-1'] == this.home_id ){
        new_event.color = this.vars.homeColor;
        new_event.points = +item['home-score'];
        new_event.quarter = item['quarter'];
        new_event.side = 'home';
        new_event.lead = +item['home-score'] - +item['visitor-score'];
    }
    else{
        new_event.color = this.vars.awayColor;
        new_event.points = +item['visitor-score'];
        new_event.quarter = item['quarter'];
        new_event.side = 'visiting';
        new_event.lead = +item['visitor-score'] - +item['home-score'];
    }

    new_event.data = item;

    var minutes = (12-(+item['time-minutes'])-1)*60;

    var quart = ((+new_event.quarter-1)*12)*60;

    var secs = 60-(+item['time-seconds']);

    var seconds = quart+minutes+secs;
    new_event.seconds = seconds;
    var second_ratio = seconds/2880;

    new_event.seconds_ratio = second_ratio;

    this.temp_events.push(new_event);

  },
  compareInput: function(){

      if ( this.temp_events.length > this.full_events.length ){
          this.events = this.temp_events;
          this.full_events = this.temp_events;
          this.renderProbGraph();
      }

  },
  renderProbGraph: function(){

    this.vars.paper.clear();
    var home_path = "M0 40";
    var away_path = "M0 40";
    var circle_array = [];

    for(var x = 0; x < this.events.length; x++ ){

        var adj;

        if ( this.events[x].lead <=0 ){
            adj_us = -(this.events[x].seconds/100);
            adj_them = (this.events[x].seconds/100);
        }
        else{
            adj_us = (this.events[x].seconds/100);
            adj_them = -(this.events[x].seconds/100);
        }

        var allowed = this.events[x].points-this.events[x].lead;
        var earned = this.events[x].points;

        var rat = allowed/earned;

        var seconds_left = 2880-this.events[x].seconds;
        var multi = seconds_left/250;
        var multi2 = this.events[x].seconds/2880;


        var pyth = ((1 / ( 1 + Math.pow(rat,2))));
        pyth = ((multi*0.5)+pyth)/(multi+1);

        if ( this.events[x].lead < 0 ){
            pyth = pyth-((1-pyth)*multi2/5);
        }
        else{
            pyth = pyth+((1-pyth)*multi2/5);
        }



        if ( this.events[x].side == 'home' ){
            var varient = 81 - 81*pyth;
            if ( this.home_start == 0 ){
                this.home_start = varient;
            }
            this.home_end = 900*this.events[x].seconds_ratio;
            home_path += "L"+900*this.events[x].seconds_ratio+" "+varient;

            circle_array[x] = {};
            circle_array[x].x = 900*this.events[x].seconds_ratio;
            circle_array[x].y = varient;
            circle_array[x].stroke = this.vars.homeColor;

        }
        else{
            var varient = 81 - 81*pyth;
            if ( this.away_start == 0 ){
                this.away_start = varient;
            }
            this.away_end = 900*this.events[x].seconds_ratio;
            away_path += "L"+900*this.events[x].seconds_ratio+" "+varient;

            circle_array[x] = {};
            circle_array[x].x = 900*this.events[x].seconds_ratio;
            circle_array[x].y = varient;
            circle_array[x].stroke = this.vars.awayColor;
        }
    }
    home_path += "L"+this.home_end+" 200L0 200 L0 40";
    away_path += "L"+this.away_end+" 200L0 200 L0 40";

    var away_line = this.vars.paper.path(away_path);
    away_line.attr ("stroke", this.vars.awayColor);
    away_line.attr("stroke-width", "3");
    away_line.attr("fill", this.vars.awayColor);
    away_line.attr("fill-opacity", 0.3);
    away_line.attr("stroke-linecap", "round");

    var home_line = this.vars.paper.path(home_path);
    home_line.attr ("stroke", this.vars.homeColor);
    home_line.attr("stroke-width", "3");
    home_line.attr("fill", this.vars.homeColor);
    home_line.attr("fill-opacity", 0.3);

    for( var v = 0; v < circle_array.length;v++){
        var d = this.vars.paper.circle(circle_array[v].x,circle_array[v].y,3);
            d.attr ("stroke", circle_array[v].stroke);
            d.attr("stroke-width", "2");
            d.attr("fill", "#444");
            d.attr("fill-opacity", 1);
    }

  },

  addPlay: function(){
    this.renders();
  }

});