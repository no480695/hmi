var api  = module.exports = {},
  app    = require( BASE_DIR + '/app' ),
  Client       = require('request-json').JsonClient,
  client       = new Client('http://localhost:1234/'),
  helper = require( BASE_DIR + '/util/helper' ),
  _      = require('underscore'),
  moment = require('moment'),
  async  = require('async');




api.getScheduleInfo = function ( req, res, next ){

  var gameCode = req.params.gameCode,
    teamAbbr = req.params.teamAbbr,
    scheduleInfo;

  if ( gameCode ){
    helper.getScheduleFromGameCode( gameCode, function( schedule ){
      if ( schedule ){
        res.locals.scheduleInfo = schedule;
        next();
        return;
      }
    })
  }

  if ( teamAbbr ){
    helper.getScheduleFromteamAbbr( teamAbbr, function( schedule ){
      if ( schedule ){
        res.locals.scheduleInfo = schedule;
        next();
        return;
      }
    })
  }

  if ( !gameCode && !teamAbbr ){
    helper.getMostRecentSchedule( function( schedule ){
      if ( schedule ){

        res.locals.scheduleInfo = schedule;
        next();
        return;
      }
    })
  }

}

api.update = function ( req, res, next ){


  if ( res.locals.scheduleInfo.gamecode ){

    var game_code = res.locals.scheduleInfo.gamecode.code;
    //get update info
    client.get('update/'+game_code, function(err, resp, body) {
       if ( err ) {
        res.send('Game could not be found');
       }
       else if( body ){
        res.locals.initialUpdate = JSON.stringify(body);
        res.locals.api = body;
        next();
       }
       else{
          res.send('Game could not be found');
       }
    });
  }
  else{
    res.send('Game could not be found');
  }
}


