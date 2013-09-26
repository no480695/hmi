/*
============================================================
VIEW: Main Center Scroller
============================================================
*/

var graphHeight = 270;
var textSpeed = 100;

nba.MomentumChart = Backbone.View.extend({

  initialize : function() {

    this.collection.on( 'add', this.addPlay, this );

    this.vars = {};
    this.vars.width   = 405;
    this.vars.height  = 270;
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
        if ( +array[x].attributes['event-id'] == 1 ||+array[x].attributes['event-id'] == 3 ){
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
  addEvent : function( item ){
    var new_event = {};

    if ( item['team-code-1'] == this.home_id ){
        new_event.color = this.vars.homeColor
        new_event.points = +item['home-score'];
        new_event.quarter = item['quarter'];
    }
    else{
        new_event.color = this.vars.awayColor
        new_event.points = +item['visitor-score'];
        new_event.quarter = item['quarter'];
    }

    new_event.data = item;

    var minutes = (12-(+item['time-minutes'])-1)*60;

    var quart = ((+new_event.quarter-1)*12)*60;

    var secs = 60-(+item['time-seconds']);

    var seconds = quart+minutes+secs;
    new_event.seconds = seconds;

    this.temp_events.push(new_event);

  },
  compareInput: function(){

      if ( this.temp_events.length > this.full_events.length ){
          this.events = this.temp_events;
          this.full_events = this.temp_events;
          this.adjustView(this.current_min,this.current_max);
      }

  },
  adjustView: function( min, max ){

      this.current_min = min;
      this.current_max = max;

      this.events = [];

      for ( var x = 0; x < this.full_events.length; x++ ){

          if ( +this.full_events[x]['seconds'] >= min && +this.full_events[x]['seconds'] <= max ){

              this.events.push(this.full_events[x]);

          }

      }

      this.render();
  },

  render: function(){

    var max_points = _.max(this.events,function(i){
      return i.points;
    });
    var amount_points = +max_points.points;
    var amount_events = this.events.length;

    var barMargin = 1;
    var originX = 1;
    var originY = this.vars.height;
    var barWidth = (405-(barMargin*amount_events))/amount_events;

    if (amount_events < 16 ){
      barWidth = 36;
    }

    this.vars.paper.clear();
      this.event_data = [];




      var title = this.vars.paper.text(8, 30, "").attr({
          font: '10px Arial',
          fill: '#fff',
          'text-anchor': 'start'
      }).toFront();

      var title2 = this.vars.paper.text(8, 45, "").attr({
          font: '10px Arial',
          fill: '#fff',
          'text-anchor': 'start'
      }).toFront();


    for(var x = 0; x < this.events.length; x++ ){

      var adjusted_height = (this.vars.height*0.75)*(this.events[x].points/amount_points);

      var return_y = originY-adjusted_height;



        var z = this.vars.paper.rect(originX, return_y, barWidth, adjusted_height).attr({ 'fill': this.events[x].color, 'stroke': this.events[x].color, 'stroke-width':0, 'stuff': this.events[x].data,'cursor':'pointer' });

        originX = originX + barWidth + barMargin;

          this.event_data[z.id] = this.events[x].data;

        z.click(function(){

          var search_seq = nba.momentumChart.event_data[this.id]['seq-number'];
          var index = 0;

          for ( var x = nba.plays.models.length-1; x >= 0; x-- ){

              if ( nba.plays.models[x].id == search_seq){
                index = x;
              }
          }

          var total_width = nba.plays.models.length*300;

          var move_to = (total_width-(300*index)-300);

          var play_panel = $('.play-pane');

          play_panel.jScrollPane({
            autoReinitialise: true,
            hijackInternalLinks: true,
            animateScroll: true
          });

          var api = play_panel.data('jsp');

          //var index = nba.plays.models);indexOf(200);
          //console.log(nba.momentumChart.event_data[this.id]['seq-number']);
          api.scrollTo(move_to,0);
        });

        z.mouseover(function(){

              var text = nba.momentumChart.event_data[this.id]['textual-description'];

              var parts = [];
              var textPartOne = '';
              var textPartTwo = '';

              if (text.length > 60 ){
                parts = text.split(' ');
                for ( var x = 0; x < parts.length; x++ ){
                  if ( x < 10 ){
                    textPartOne += parts[x]+' ';
                  }
                  else{
                    textPartTwo += parts[x]+' ';
                  }
                }
              }
              else{
                textPartOne = text;
              }

            this.animate({ 'stroke-width': 3, opacity: .75 }, 100, '>');
            if(Raphael.type != 'VML') //solves IE problem
                this.toFront();

              title.stop().animate({ opacity: 0 }, textSpeed, '>', function(){
                  this.attr({ text: textPartOne }).animate({ opacity: 1 }, textSpeed, '<');
              });

              title2.stop().animate({ opacity: 0 }, textSpeed, '>', function(){
                  this.attr({ text: textPartTwo }).animate({ opacity: 1 }, textSpeed, '<');
              });

        }).mouseout(function(){
            this.animate({ 'stroke-width': 0, opacity: 1 }, 300, '<');
              title.stop().animate({ opacity: 0 }, textSpeed, '>', function(){
                  title.attr({ text: "" }).animate({ opacity: 1 }, textSpeed, '<');
              });
              title2.stop().animate({ opacity: 0 }, textSpeed, '>', function(){
                  title.attr({ text: "" }).animate({ opacity: 1 }, textSpeed, '<');
              });
        });



    }

  },

  addPlay: function(){
    this.renders();
  }

});