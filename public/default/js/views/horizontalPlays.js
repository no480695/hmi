
nba.HorizontalPlays = Backbone.View.extend({

  el: $('div#play-array'),

  template: _.template($('#tplHorizontalPlayHolder').html()),

  initialize : function() {


    this.vars = {};

    this.collection.on('add', this.render, this);
    this.collection.on('change', this.render, this);
    this.render();

  },
  render: function(){
    this.renderIndividualPlays();
  },
  renderIndividualPlays : function(){

    this.vars.divWidth = 0;

    var plays = this.collection.models;

    var data = {
      plays: "",
    }
    var last_id = "";

    for ( var x = plays.length-1; x >= 0; x-- ){

      var last = false;
      if ( x == plays.length-1 ){
        last = true;
      }
      data.plays += new nba.HorizontalPlay( { model : plays[x], last:last } ).$el.html();
      this.vars.divWidth += 300;
    }
    var last_id = plays[plays.length-1].id;

    this.$el.html(this.template(data));

    $('div#play_holder').css('width',this.vars.divWidth);

    $("div#seq_"+last_id).animate({width: 'toggle'});

    var play_panel = $('.play-pane');

    play_panel.jScrollPane({
      autoReinitialise: true,
      hijackInternalLinks: true,
      animateScroll: true
    });

  }

});



nba.HorizontalPlay = Backbone.View.extend({

  template  : _.template( $('#tplHorizontalPlay').html() ),
  template_slide  : _.template( $('#tplHorizontalPlaySlide').html() ),

  initialize : function() {

        this.render();
  },
  render : function() {

      var seconds = +this.model.attributes['time-seconds'];
      if ( seconds < 10 ){
        seconds = '0'+seconds;
      }

      var clock = this.model.attributes['time-minutes']+":"+seconds;

      var data = {
        text: this.model.attributes['textual-description'],
        quarter: 'Q'+this.model.attributes.quarter,
        clock: clock,
        type: this.model.attributes['event-description'],
        seq: this.model.id
      }

      if ( this.options.last == true ){
        this.$el.html( this.template_slide( data ) );
      }
      else{
        this.$el.html( this.template( data ) );
      }

      return this;
  }

});