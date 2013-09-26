nba.LeaderList = Backbone.View.extend({

  el: $('div[data-tab-id="#leaders"]'),

  initialize : function() {

    this.render();
  },
  render : function(){

    this.renderCol('pts', 'light');
    this.renderCol('ast', 'dark');
    this.renderCol('fgp', 'light');
    this.renderCol('reb', 'dark');
    this.renderCol('blk', 'light');
    this.renderCol('stl', 'dark');

  },
  renderCol : function( type, shade ){

    $(this.el).append( new nba.LeaderColumn( { model : this.collection[type], type: type, shade: shade } ).$el );

  }

});

nba.LeaderColumn = Backbone.View.extend({

  template  : _.template( $('#tplLeaderCol').html() ),

  className: "leaders-col col",

  initialize : function() {
        this.render();
  },
  render : function() {

      var stat = '';
      var cat = '';
      if ( this.options.type == 'pts' ){
        stat = 'points';
        cat = 'average';
      }
      else if ( this.options.type == 'ast' ){
        stat = 'assists';
        cat = 'average';
      }
      else if ( this.options.type == 'fgp' ){
        stat = 'field-goals';
        cat = 'percentage';
      }
      else if ( this.options.type == 'reb' ){
        stat = 'rebounds';
        cat = 'total-average';
      }
      else if ( this.options.type == 'blk' ){
        stat = 'blocked-shots';
        cat = 'average';
      }
      else if ( this.options.type == 'stl' ){
        stat = 'steals';
        cat = 'average';
      }

      var array = this.model;



      var data = {
        stat: this.options.type,
        value1: array[0].stats[stat][cat],
        name1: array[0].name['first-name'][0]+'. '+array[0].name['last-name'],
        value2: array[1].stats[stat][cat],
        name2: array[1].name['first-name'][0]+'. '+array[1].name['last-name'],
        value3: array[2].stats[stat][cat],
        name3: array[2].name['first-name'][0]+'. '+array[2].name['last-name'],
        player_photo: array[0].player_code,
        teamAbbr: nba.colors.get(array[0].teamAbbr.toUpperCase())
      }

      this.$el.html( this.template( data ) );
      $(this.el).addClass('i-'+this.options.shade)
      return this;
  }

});



