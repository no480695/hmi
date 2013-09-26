


nba.RosterView = Backbone.View.extend({

    //template : _.template( $('#tplRosterCard').html() ),

    initialize : function() {

        this.onCourtDudes = _.filter( this.collection.models, function( model ) {

            return model.get('games')['on-court'] == true;

        });

        this.rankedDudes = _.sortBy( this.collection.models, function( player ) {

            return player.get('ranking');

        }).reverse();

        this.collection.on('add',this.render, this);

        this.render();

    },

    render : function() {

        //this.$el.html( this.template( ) );

        //this.renderRows('onCourtDudes');
        this.renderRoster('rankedDudes');
        //$('#roster_' + (this.options.teamSide == 'away' ? 'left' : 'right')).append(this.$el);

    },

    renderRoster : function( type ) {

        var viewable = "";

        for( var i = 0; i < this[type].length; i++ ) {

            var name = this[type][i].get('name');

            viewable += '<p>'+name['first-name']+' '+name['last-name']+' '+this[type][i].get('ranking')+'</p>';

            //this.$el.find('table.' + type + ' tbody').append( new nba.RosterTableRow( { model : this[type][i] } ).$el );

        }

        $("#"+this.options.teamSide+'TeamRankings').html(viewable);

        return this;

    }
});
