
nba.FullCourtChart = Backbone.View.extend({

  initialize: function(){

    this.collection.on( 'add', this.render, this );
    this.collection.on( 'change', this.render, this );
    this.collection.on( 'reset', this.render, this );

    this.vars = {};
    this.vars.width   = 450;
    this.vars.height  = 220;
    this.vars.$graph  = $('#'+this.options.container);
    this.vars.paper   = Raphael(this.options.container, this.vars.width, this.vars.height);
    this.chart_colors = ["#444","#333","#222","#111"];
    this.render();

    this.renderType = this.options.type;

  },
  render: function(){

    this.vars.start_time = new Date();

    this.overal_count = 0;
    this.court_values = [];

    this.area_info = {
      'a1_percent': 0, 'a1_count': 0,
      'a2_percent': 0, 'a2_count': 0,
      'a3_percent': 0, 'a3_count': 0,
      'a4_percent': 0, 'a4_count': 0,
      'b1_percent': 0, 'b1_count': 0,
      'b2_percent': 0, 'b2_count': 0,
      'b3_percent': 0, 'b3_count': 0,
      'b4_percent': 0, 'b4_count': 0,
      'c1_percent': 0, 'c1_count': 0,
      'c2_percent': 0, 'c2_count': 0,
      'c3_percent': 0, 'c3_count': 0,
      'c4_percent': 0, 'c4_count': 0,
      'd1_percent': 0, 'd1_count': 0,
      'd2_percent': 0, 'd2_count': 0,
      'd3_percent': 0, 'd3_count': 0,
      'd4_percent': 0, 'd4_count': 0,
      'e1_percent': 0, 'e1_count': 0,
      'e2_percent': 0, 'e2_count': 0,
      'e3_percent': 0, 'e3_count': 0,
      'e4_percent': 0, 'e4_count': 0
    };
    this.renderType = this.options.type;
    this.syncPlays( this.collection.models );

  },
  processArray: function( obj ){

    this.court_values = obj;

    this.sortCourtValues();

  },
  arc: function(center, radius, startAngle, endAngle){
    angle = startAngle;
    coords = this.toCoords(center, radius, angle);
    path = "M " + coords[0] + " " + coords[1];
    while(angle<=endAngle) {
      coords = this.toCoords(center, radius, angle);
      path += " L " + coords[0] + " " + coords[1];
      angle += 1;
    }
    return path;
  },
  toCoords: function(center, radius, angle){
    var radians = (angle/180) * Math.PI;
    var x = center[0] + Math.cos(radians) * radius;
    var y = center[1] + Math.sin(radians) * radius;
    return [x, y];
  },
  sortCourtValues: function(){
    var sorted_court_values = _.sortBy(this.court_values, function(area){
      return area.val;
    });

    for( var x = 0; x < sorted_court_values.length; x++ ){
      if ( x <= 6 ){
        sorted_court_values[x].color = this.chart_colors[0];
      }
      else if( x < 15 ){
        sorted_court_values[x].color = this.chart_colors[1];
      }
      else{
        sorted_court_values[x].color = this.chart_colors[2];
      }
    }

    this.renderChart( sorted_court_values );
  },
  generatePath: function( area ){

    var obj = {};

    if ( area == 'a1' ){
      obj.path =  "M 0 0 L 55 0 L 55 75 L 0 75 L 0 0";
      obj.x_text = 35;
      obj.y_text = 8;
    }
    else if( area == 'a2' ){
      obj.path = "M 55 0 L 165 0 L 165 75 L 55 75 L 55 0";
      obj.x_text = 126;
      obj.y_text = 35;
    }
    else if( area == 'a3' ){
      obj.path = "M 285 0 L 395 0 L 395 75 L 285 75 L 285 0";
      obj.x_text = 340;
      obj.y_text = 35;
    }
    else if( area == 'a4' ){
      obj.path = "M 395 0 L 450 0 L 450 75 L 395 75 L 395 0";
      obj.x_text = 432;
      obj.y_text = 10;
    }
    else if( area == 'b1' ){
      obj.path = this.arc([27,110],90,270,288)+" L 55 25 L 55 110 L 0 110 L 0 20 L 27 20";
      obj.x_text = 35;
      obj.y_text = 47;
    }
    else if( area == 'b2' ){
      obj.path = this.arc([27,110],90,288,360)+" L 55 110 L 55 25";
      obj.x_text = 96;
      obj.y_text = 80;
    }
    else if( area == 'b3' ){
      obj.path = this.arc([423,110],90,180,252)+" L 395 110 L 333 110";
      obj.x_text = 368;
      obj.y_text = 80;
    }
    else if( area == 'b4' ){
      obj.path = this.arc([423,110],90,252,270)+" L 423 20 L 450 20 L 450 110 L 395 110 L 395 25";
      obj.x_text = 432;
      obj.y_text = 47;
    }
    else if( area == 'c1' ){
      obj.path = "M 0 75 L 68 75 L 68 145 L 0 145 L 0 75";
      obj.x_text = 45;
      obj.y_text = 110;
    }
    else if( area == 'c2' ){
      obj.path = "M 55 75 L 165 75 L 165 145 L 55 145 L 55 75";
      obj.x_text = 148;
      obj.y_text = 110;
    }
    else if( area == 'c3' ){
      obj.path = "M 285 75 L 395 75 L 395 145 L 285 145 L 285 75";
      obj.x_text = 315;
      obj.y_text = 110;
    }
    else if( area == 'c4' ){
      obj.path = "M 382 75 L 450 75 L 450 145 L 382 145 L 382 75";
      obj.x_text = 426;
      obj.y_text = 110;
    }
    else if( area == 'd1' ){
      obj.path = this.arc([27,110],90,72,90)+" L 0 200 L 0 110 L 55 110 L 55 195";
      obj.x_text = 35;
      obj.y_text = 173;
    }
    else if( area == 'd2' ){
      obj.path = this.arc([27,110],90,0,72)+" L 55 110 L 117 110";
      obj.x_text = 96;
      obj.y_text = 140;
    }
    else if( area == 'd3' ){
      obj.path = this.arc([423,110],90,108,180)+" L 395 110 L 395 195";
      obj.x_text = 369;
      obj.y_text = 140;
    }
    else if( area == 'd4' ){
      obj.path = this.arc([423,110],90,90,108)+" L 395 110 L 450 110 L 450 200 L 423 200";
      obj.x_text = 432;
      obj.y_text = 173;
    }
    else if( area == 'e1' ){
      obj.path = "M 0 145 L 55 145 L 55 220 L 0 220 L 0 145";
      obj.x_text = 35;
      obj.y_text = 210;
    }
    else if( area == 'e2' ){
      obj.path = "M 55 145 L 165 145 L 165 220 L 55 220 L 55 145";
      obj.x_text = 126;
      obj.y_text = 185;
    }
    else if( area == 'e3' ){
      obj.path = "M 285 145 L 395 145 L 395 220 L 285 220 L 285 145";
      obj.x_text = 340;
      obj.y_text = 185;
    }
    else if( area == 'e4' ){
      obj.path = "M 395 145 L 450 145 L 450 220 L 395 220 L 395 145";
      obj.x_text = 432;
      obj.y_text = 210;
    }
    else{
      obj.path = '';
      obj.x_text = 0;
      obj.y_text = 0;
    }

    return obj;
  },

  syncPlays: function( play_array ){

    for ( var x = 0; x < play_array.length; x++ ){
      //if it has a location on the court

      var this_play = play_array[x].attributes;

      if ( this_play['x-shot-coord'] != "" ){

        var item = this_play;
        //if it is a home shot ( left )
        if ( +this_play['global-team-code-1'] == this.options.homeTeamID ){

          fill_color = "#A00000";

          var graph_x = 25 + +this_play['x-shot-coord'];
          var graph_y = +this_play['y-shot-coord']

        }
        //it is away ( right );
        else{

          fill_color = "#F0F0F0";

          var graph_x = 25 - +this_play['x-shot-coord'];
          var graph_y = 94 - +this_play['y-shot-coord'];

        }

        //fordebuggin only

        if ( this.renderType == 'pin' ){

          var chart_y = graph_y/0.20888889;
          var chart_x = graph_x/0.22727272;

          var pin = this.mChart.circle(chart_y, chart_x, 3);
            pin.attr("stroke", fill_color);
            pin.attr("fill", fill_color);
            pin.attr("opacity", 0.4);

        }
        //calculate the zone right here
        //if it is ab above cirlces
        if ( graph_x >= 47 ){
          if ( graph_y < 11.49 ){
            this.addCount('a1');
          }
          else if ( graph_y < 34.48 ){
            this.addCount('a2');
          }
          else if ( graph_y > 82.5 ){
            this.addCount('a4');
          }
          else{
            this.addCount('a3');
          }
        }
        //if it is below circles
        else if( graph_x <= 3 ){
          if ( graph_y < 11.49 ){
            this.addCount('e1');
          }
          else if ( graph_y < 34.48 ){
            this.addCount('e2');
          }
          else if ( graph_y > 82.5 ){
            this.addCount('e4');
          }
          else{
            this.addCount('e3');
          }
        }
        else{
          var distance_left = Math.sqrt(Math.pow((25-graph_x),2)+Math.pow((4-graph_y),2));
          var distance_right = Math.sqrt(Math.pow((25-graph_x),2)+Math.pow((90-graph_y),2));

          if ( distance_left <= 21.7 ){
            if ( graph_y <= 14.2 && graph_x < 32.95 && graph_x > 17.04 ){
              this.addCount('c1');
            }
            else if( graph_y >= 11.48 && graph_x >= 25 ){
              this.addCount('b2');
            }
            else if( graph_y >= 11.48 && graph_x <= 25 ){
              this.addCount('d2');
            }
            else if( graph_y <= 11.48 && graph_x > 25 ){
              this.addCount('b1');
            }
            else{
              this.addCount('d1');
            }
          }
          else if( distance_right <= 21.7 ){
            if ( graph_y >= 79.8 && graph_x < 32.95 && graph_x > 17.04 ){
              this.addCount('c4');
            }
            else if( graph_y <= 82.51 && graph_x >= 25 ){
              this.addCount('b3');
            }
            else if( graph_y >= 82.51 && graph_x >= 25 ){
              this.addCount('b4');
            }
            else if( graph_y <= 82.51 && graph_x < 25 ){
              this.addCount('d3');
            }
            else{
              this.addCount('d4');
            }
          }
          else{
            if ( graph_y <= 34.4 ){
              if ( graph_x > 32.94 ){
                this.addCount('a2');
              }
              else if ( graph_x > 17.04 ){
                this.addCount('c2');
              }
              else{
                this.addCount('e2');
              }
            }
            else{
              if ( graph_x > 32.94 ){
                this.addCount('a3');
              }
              else if ( graph_x > 17.04 ){
                this.addCount('c3');
              }
              else{
                this.addCount('e3');
              }
            }
          }
        }
      }
    }

      this.sendToArray();

  },
  renderJustAreas: function(){
    var background = this.vars.paper.path("M 0 0 L 450 0 L 450 220 L 0 220 L 0 0");
            background.attr({stroke:'#666','stroke-width':0,'fill':'#666'});

          var d1 = this.vars.paper.path("M 165 0 L 225 0 L 225 220 L 165 220 L 165 0");
            d1.attr({stroke:'#000','stroke-width':1,'fill':'#444'});

          var d2 = this.vars.paper.path("M 225 0 L 285 0 L 285 220 L 225 220 L 225 0");
            d2.attr({stroke:'#000','stroke-width':1,'fill':'#444'});

          var center_court = this.vars.paper.circle(225,110,35);
            center_court.attr({stroke:'#000','stroke-width':1,'fill':'#444'});
          },
  addCount: function( area ){

    this.area_info[ area+'_count']++;
    this.overal_count++;

    var percent = +this.area_info[ area+'_count']/this.overal_count;

    this.area_info[ area+'_percent'] = percent;

  },

  sendToArray: function(){
    this.court_values[0] = {}; this.court_values[0].val = Math.floor(this.area_info['a1_percent']*100); this.court_values[0].area = 'a1'; this.court_values[0].display_level = 0;
    this.court_values[1] = {}; this.court_values[1].val = Math.floor(this.area_info['a2_percent']*100); this.court_values[1].area = 'a2'; this.court_values[1].display_level = 0;
    this.court_values[2] = {}; this.court_values[2].val = Math.floor(this.area_info['a3_percent']*100); this.court_values[2].area = 'a3'; this.court_values[2].display_level = 0;
    this.court_values[3] = {}; this.court_values[3].val = Math.floor(this.area_info['a4_percent']*100); this.court_values[3].area = 'a4'; this.court_values[3].display_level = 0;
    this.court_values[4] = {}; this.court_values[4].val = Math.floor(this.area_info['b1_percent']*100); this.court_values[4].area = 'b1'; this.court_values[4].display_level = 1;
    this.court_values[5] = {}; this.court_values[5].val = Math.floor(this.area_info['b2_percent']*100); this.court_values[5].area = 'b2'; this.court_values[5].display_level = 1;
    this.court_values[6] = {}; this.court_values[6].val = Math.floor(this.area_info['b3_percent']*100); this.court_values[6].area = 'b3'; this.court_values[6].display_level = 1;
    this.court_values[7] = {}; this.court_values[7].val = Math.floor(this.area_info['b4_percent']*100); this.court_values[7].area = 'b4'; this.court_values[7].display_level = 1;
    this.court_values[8] = {}; this.court_values[8].val = Math.floor(this.area_info['c1_percent']*100); this.court_values[8].area = 'c1'; this.court_values[8].display_level = 2;
    this.court_values[9] = {}; this.court_values[9].val = Math.floor(this.area_info['c2_percent']*100); this.court_values[9].area = 'c2'; this.court_values[9].display_level = 0;
    this.court_values[10] = {}; this.court_values[10].val = Math.floor(this.area_info['c3_percent']*100); this.court_values[10].area = 'c3'; this.court_values[10].display_level = 0;
    this.court_values[11] = {}; this.court_values[11].val = Math.floor(this.area_info['c4_percent']*100); this.court_values[11].area = 'c4'; this.court_values[11].display_level = 2;
    this.court_values[12] = {}; this.court_values[12].val = Math.floor(this.area_info['d1_percent']*100); this.court_values[12].area = 'd1'; this.court_values[12].display_level = 1;
    this.court_values[13] = {}; this.court_values[13].val = Math.floor(this.area_info['d2_percent']*100); this.court_values[13].area = 'd2'; this.court_values[13].display_level = 1;
    this.court_values[14] = {}; this.court_values[14].val = Math.floor(this.area_info['d3_percent']*100); this.court_values[14].area = 'd3'; this.court_values[14].display_level = 1;
    this.court_values[15] = {}; this.court_values[15].val = Math.floor(this.area_info['d4_percent']*100); this.court_values[15].area = 'd4'; this.court_values[15].display_level = 1;
    this.court_values[16] = {}; this.court_values[16].val = Math.floor(this.area_info['e1percent']*100); this.court_values[16].area = 'e1'; this.court_values[16].display_level = 0;
    this.court_values[17] = {}; this.court_values[17].val = Math.floor(this.area_info['e2_percent']*100); this.court_values[17].area = 'e2'; this.court_values[17].display_level = 0;
    this.court_values[18] = {}; this.court_values[18].val = Math.floor(this.area_info['e3_percent']*100); this.court_values[18].area = 'e3'; this.court_values[18].display_level = 0;
    this.court_values[19] = {}; this.court_values[19].val = Math.floor(this.area_info['e4_percent']*100); this.court_values[19].area = 'e4'; this.court_values[19].display_level = 0;

    for( var x = 0; x < this.court_values.length; x++ ){
      if ( isNaN(this.court_values[x].val) ){
        this.court_values[x].val = 0;
      }
    }
    this.processArray( this.court_values );

  },

  renderChart: function( array ){
    this.vars.paper.clear();


    //draw background color and middle stuff
    var background = this.vars.paper.path("M 0 0 L 450 0 L 450 220 L 0 220 L 0 0");
      background.attr({stroke:'#666','stroke-width':0,'fill':'#666'});

    var d1 = this.vars.paper.path("M 165 0 L 225 0 L 225 220 L 165 220 L 165 0");
      d1.attr({stroke:'#000','stroke-width':1,'fill':'#444'});

    var d2 = this.vars.paper.path("M 225 0 L 285 0 L 285 220 L 225 220 L 225 0");
      d2.attr({stroke:'#000','stroke-width':1,'fill':'#444'});

    var center_court = this.vars.paper.circle(225,110,35);
      center_court.attr({stroke:'#000','stroke-width':1,'fill':'#444'});

    // sort by display
    var for_display = _.sortBy(array, function(area){
      return area.display_level;
    });
    //loop and draw
    for ( var i = 0; i < for_display.length ; i++ ){

      var current_area = this.generatePath(for_display[i].area);

      if ( for_display[i].val == 0 ){
        for_display[i].color = this.chart_colors[0];
      }

      var geo = this.vars.paper.path(current_area.path);
      geo.attr({stroke:'#000','stroke-width':1,'fill':for_display[i].color});

      var cur_opacity = 1;

      //get font opacity
      if ( for_display[i].color == this.chart_colors[2] ) cur_opacity = 1;
      else if ( for_display[i].color == this.chart_colors[1] ) cur_opacity = 0.7;
      else if ( for_display[i].color == this.chart_colors[0] ) cur_opacity = 0.4;

      var percent = this.vars.paper.text(current_area.x_text+11, current_area.y_text+2, '%');

      percent.attr({  "font-size": 12,
                //"font-family": "Arial, Helvetica, sans-serif",
                "fill":"#fff",
                "opacity":cur_opacity,
                "text-anchor": "end"
      });

      var number = this.vars.paper.text(current_area.x_text,current_area.y_text, for_display[i].val);

      number.attr({   "font-size": 18,
                //"font-family": "Arial, Helvetica, sans-serif",
                "fill":"#fff",
                "opacity":cur_opacity,
                "text-anchor": "end"
      });

    }


  }

});