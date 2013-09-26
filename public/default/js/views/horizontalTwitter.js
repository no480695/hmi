nba.HorizontalTweetList = Backbone.View.extend({

  el: $('div#twitter-row'),

  template: _.template($('#tplHorizontalTweetHolder').html()),

  initialize : function() {

    this.collection.on('add', this.render, this);
    this.collection.on('change', this.render, this);
    this.render();

  },
  render : function(){

    this.renderIndividualTweets();

  },
  renderIndividualTweets : function( type, shade ){

    var tweets = this.collection.models;

    var data = {
      tweets: "",
    }

    for ( var x = 0; x < tweets.length; x++ ){
      data.tweets += new nba.HorizontalTweet( { model : tweets[x] } ).$el.html();
    }


    this.$el.html(this.template(data));

    $('.scroll-pane').jScrollPane();

  }

});

nba.HorizontalTweet = Backbone.View.extend({

  template  : _.template( $('#tplHorizontalTweet').html() ),

  initialize : function() {

        this.render();
  },
  render : function() {

      if ( this.model.attributes.user ){

        var data = {
          text: this.model.attributes.text,
          name: this.model.attributes.user.name,
          screen_name: this.model.attributes.user.screen_name,
          urls: this.model.attributes.entities.urls,
          hashtags: this.model.attributes.entities.hashtags
        }
        this.$el.html( this.template( data ) );

      }
      return this;
  }

});