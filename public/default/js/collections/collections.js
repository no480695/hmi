nba.Plays = Backbone.Collection.extend({

  model : nba.Play

});

nba.LeagueGames = Backbone.Collection.extend({

	model : nba.LeagueGame

});

nba.plays = new nba.Plays;

nba.courtItems = new nba.Plays;

nba.leagueGames = new nba.LeagueGames;