
nba.PlayerCard = Backbone.View.extend({

    el: $(".player-card"),

    template : _.template( $('#tplPlayerCard').html() ),

    initialize : function() {

        this.players = nba.gameState.get('playerStats');
        this.leaders = nba.gameState.get('leaderStats');
        this.personalInfo = nba.gameState.get('personalInfo');
        this.home_color = nba.colors.get('homeColorAbbr');
        this.away_color = nba.colors.get('awayColorAbbr');
        this.render(null,null);

    },

    render : function( player_code, side ) {

        var array = this.players.home_team.concat(this.players.away_team);

        var choice = 'home';

        if ( side == 'away'){
            choice = 'visiting';
        }
        var boxscore = nba.boxscore.get('player-stats')[choice+'-player-stats'];

        var player = array[0];

        var data = {};

        var box = {};

        if ( player_code ){
            player = _.find(array, function( obj ){ return obj.player_code == player_code; });
            box = _.find(boxscore, function( obj ){ return obj.player_id == player_code; });
            personal = _.find(this.personalInfo, function( obj ){
                return obj['player-code']['global-id'] == player_code;
            });

            if ( side == 'home' ){
                data.color_abbr = this.home_color;
            }
            else{
                data.color_abbr = this.away_color;
            }

            data.player_code = player_code;

            if ( personal ){

                data.height = Math.floor(personal.height.inches/12)+"'"+(personal.height.inches % 12)+'"';
                data.weight = personal.weight.pounds;
                data.age = personal.age;
                data.college = personal.school.school;
                data.debut = personal['first-year']['rookie-year'];
                data.experience = personal.experience.experience+' yrs';

            }
            else{

                data.height = 'unknown';
                data.weight = 'unknown';
                data.age = 'unknown';
                data.college = 'unknown';
                data.debut = 'unknown';
                data.experience = 'unknown';
            }

            data.pre_height = 100; //TODO
            if ( data.pre_height > 124 ) data.pre_height = 124;
            data.pre_margin = 124 - data.pre_height;

            data.ast_height = (player.stats.assists.average/this.leaders.ast[0].stats.assists.average)*124;
            if ( data.ast_height > 124 ) data.ast_height = 124;
            data.ast_margin = 124 - data.ast_height;
            data.ast = player.stats.assists.average;

            data.reb_height = (player.stats.rebounds['total-average']/this.leaders.reb[0].stats.rebounds['total-average'])*124;
            if ( data.reb_height > 124 ) data.reb_height = 124;
            data.reb_margin = 124 - data.reb_height;
            data.reb = player.stats.rebounds['total-average'];

            data.pts_height = (player.stats.points.average/this.leaders.pts[0].stats.points.average)*124;
            if ( data.pts_height > 124 ) data.pts_height = 124;
            data.pts_margin = 124 - data.pts_height;
            data.pts = player.stats.points.average;

            data.current_min = box.minutes.minutes;
            data.current_fgm_a = box['field-goals']['made']+'/'+box['field-goals']['attempted'];
            data.current_3pm_a = box['three-point-field-goals']['made']+'/'+box['three-point-field-goals']['attempted'];
            data.current_ftm_a = box['free-throws']['made']+'/'+box['free-throws']['attempted'];
            data.current_plus_minus = box['plus-minus']['number'];
            data.current_off = box['rebounds']['offensive'];
            data.current_def = box['rebounds']['defensive'];
            data.current_tot = box['rebounds']['total'];
            data.current_ast = box['assists']['assists'];
            data.current_pf = box['personal-fouls']['fouls'];
            data.current_pf = box['personal-fouls']['fouls'];
            data.current_st = box.steals.steals;
            data.current_to = box.turnovers.turnovers;
            data.current_bs = box['blocked-shots']['blocked-shots'];
            data.current_pts = box.points.points;


        this.$el.html( this.template( data ));

        }
    }
});
