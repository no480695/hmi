
nba.ClockView = Backbone.View.extend({

  initialize : function() {


    if (!Raphael) {
        return;
    }

    this.vars = {};
    this.vars.size =     96;         // Canvas size;
    this.vars.aspd =     500;         // Animation speed;
    this.vars.$graph =   $('#clock_ticker');
    this.vars.paper =    Raphael('clock_ticker', this.vars.size, this.vars.size);
    this.vars.sw =       7;          // Border width;
    this.vars.r =        (this.vars.size - this.vars.sw) / 2;    // Radius;
    this.vars.strp =     83;          // Strikes percentage;
    this.vars.arc =      null;

// Ball to strike graph;
    this.vars.paper.customAttributes.arc = function (w, h, value, total, r) {
      var a = value,
        aR = a * (Math.PI / 180),
        x = w / 2 - r * Math.sin(aR),
        y = h / 2 + r * Math.cos(aR),
        moveTo = ['M', w / 2, (h - 7 / 2)],
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
      'stroke': '#4e4e4e',
      'stroke-width': this.vars.sw
    });

    this.vars.background = this.vars.paper.circle(this.vars.size / 2, this.vars.size / 2, this.vars.r).attr({
      'stroke': '#4e4e4e',
      'stroke-width': this.vars.sw
    });

    // Draw arc;
    this.vars.arc = this.vars.paper.path().attr({
      'stroke': '#ffc424',
      'stroke-width': this.vars.sw,
      arc: [this.vars.size, this.vars.size, 0, 360, this.vars.r]
    });



    this.render();
    this.model.on( 'change:quarter', this.renderQuarter, this );
    this.model.on( 'change:clock', this.renderClock, this );
    nba.gameState.on( 'change:endOfQuarter', this.clearClock, this );

  },

  render : function() {

    this.renderQuarter();
    this.renderClock();

  },

  renderQuarter : function() {

    var quarter = this.model.get('quarter');

    $('#quarter_text').html(quarter);

    //mlb.utils.fadeVal( this.$el.find('.f-balls'), balls );

    return this;

  },

  renderClock : function() {

    var clock = this.model.get('clock');

    var tot_seconds  = 720;

    $('#clock_text').html(clock);

    var quarter_number = this.model.get('quarter_number');

    if ( quarter_number > 4 ){
      tot_seconds = 300;
    }

    var parts   = clock.split(':'),
      minutes   = +parts[0]*60,
      seconds   = +parts[1]+minutes,
      arc_amount = Math.ceil((seconds/tot_seconds)*360);

    if ( arc_amount > 360 ) arc_amount = 360;

    if ( arc_amount == 0 ){
      this.vars.background.animate({
        stroke: '#f00'
      }, this.vars.aspd, 'bounce');
    }
    else{
      this.vars.background.animate({
        stroke: '#4e4e4e'
      }, this.vars.aspd, 'bounce');
    }

    this.vars.arc.animate({
      arc: [this.vars.size, this.vars.size, arc_amount, 360, this.vars.r]
    }, this.vars.aspd, 'bounce');

    return this;

  },

  clearClock : function( gameState ) {

    if ( gameState.get('endOfQuarter') ) {

      this.renderQuarter();
      this.renderClock();

    }

  }

});
