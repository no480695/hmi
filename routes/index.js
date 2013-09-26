var _ = require('underscore'),
  moment = require('moment'),
  helper = require( BASE_DIR + '/util/helper' ),
  avalanche = require( 'avalanche' );

exports.main = function( req, res, next ) {

  var config                = res.locals.config,
    mobile                  = res.locals.isMobile,
    current_page            = res.locals.fullPathArray[0],
    pageStuff               = res.locals.pageSettings;

  var template = avalanche.use('default');

  res.render( avalanche.templates.default.pages[current_page], {
    layout : template.layout,
    partials : avalanche.createKeys(template.partials),
    page : pageStuff
  });

}