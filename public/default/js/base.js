
$(function(){


	setMomentumSlider(nba.clock.get('quarter_number'));

	$('.scroll-pane').jScrollPane({

  });

	$('.tabs-wrap').each(function () {
		var $triggersContainer = $(this).children('.triggers'),
			$tabsContainer = $(this).children('.tabs'),
			$collapse = $('.tabs-collapse', $triggersContainer),
			collapsedClass = 'collapsed',
			trigger = '.tab-trigger',
			triggerActiveClass = 'active',
			triggerDisabledClass = 'disabled',
			tabActiveClass = 'active',
			tab = '.tab';

		$triggersContainer.find(trigger).on('click', function (ev) {
			ev.preventDefault();

			var $trigger = $(this),
				target = $trigger.data('tab'),
				$tabs = $tabsContainer.children(tab + '.' + tabActiveClass),
				$targetTab = $tabsContainer.children(tab + '[data-tab-id="' + target + '"]');

			if (!$trigger.hasClass(triggerDisabledClass)) {
				$triggersContainer.find(trigger).removeClass(triggerActiveClass);
				$trigger.addClass(triggerActiveClass);
				$tabs.removeClass(tabActiveClass);
				$targetTab.addClass(tabActiveClass);
				if ($targetTab.find('.sel:visible').length) {
					$targetTab.find('.sel:visible').chosen({disable_search: true});
				}
				if ($targetTab.find('.scroll-pane.lineup-score').length) {
					applyCustomScroll($targetTab.find('.scroll-pane.lineup-score'));
				}
			}
		});

		$collapse.on('click', function (ev) {
			ev.preventDefault();

			if ($collapse.hasClass(collapsedClass)) {
				$tabsContainer.slideDown(150);
				$collapse.siblings(trigger).removeClass(triggerDisabledClass);
				$collapse.removeClass(collapsedClass);
			} else {
				$tabsContainer.slideUp(150);
				$collapse.siblings(trigger).addClass(triggerDisabledClass);
				$collapse.addClass(collapsedClass);
			}
		});
	});
// Selects;
	$('.sel').chosen({
		disable_search: true
	}).change(function(){

		//if it is a matchup select
		if ( $(this).attr('id').indexOf('matchup') != -1 ){
			nba.playerMatchup.renderStats( $(this).val(),$(this).attr('id'));
		}
		else{
			changeCourt();
		}

	});

	// Scrollbar;
	function applyCustomScroll($target) {
		$target.jScrollPane({
			mouseWheelSpeed: 50,
			horizontalGutter: 1,
			verticalGutter: 1
		});
	}

	$('.foul-quarter').on('click',function(e){
		e.preventDefault();
		nba.utils.setQuarterChoice($('.foul-quarter.active').html().toLowerCase());
		nba.foulView.render();

		$('.leader-quarter').removeClass('active');
		$('.leader-quarter.lq-'+$('.foul-quarter.active').html().toLowerCase()).addClass('active');
	});
	$('.court-quarter').on('click',function(){
		changeCourt();
	});

	$('.match-stat-tab').on('click',function(){
		nba.foulView.render();
		changeCourt();
	});

	$('.match-stat-leader-tab').on('click',function(){
		nba.utils.setLeaderViewChoice($('.match-stat-leader-tab.active').html().toLowerCase());
		nba.matchupLeader.render();
		nba.matchupLeaderPieView.render();
	});

	$('.leader-quarter').on('click',function(e){
		e.preventDefault();
		nba.utils.setQuarterChoice($('.leader-quarter.active').html().toLowerCase());
		nba.matchupLeader.render();
		nba.matchupLeaderPieView.render();

		$('.foul-quarter').removeClass('active');
		$('.foul-quarter.fq-'+$('.leader-quarter.active').html().toLowerCase()).addClass('active');
	});

	$('input[name=court-goals]').on('change',function(){
		changeCourt();
	});

	// Sliders;
	$('.slider').cycle({
		speed: 200,
		fx: 'carousel',
		timeout: 0,
		allowWrap: false,
		carouselOffset: 31,
		carouselVisible: 9,
		paused: true,
		prev: '> .prev',
		next: '> .next',
		slides: '> .item',
		log: false,
		swipe: true
	});

	$("a[rel*=modal]").on('click',function(){
		var id = $(this).attr('id').split('-')[1];
		var side = 'away';
		if ( $(this).hasClass('homeplayer_card') ){
			side = 'home';
		}
		nba.playerCard.render(id,side);
	});

	// Modal;
	$("a[rel*=modal]").leanModal({
		overlay: 0.8,
		top: '50%'
	});


});
function changeLeaderView(){
	var obj = {
		quarter : $('.leader-quarter.active').html().toLowerCase(),
		view_type : $('.match-stat-leader-tab.active').html().toLowerCase()
	}

	nba.matchupLeader.updateMatchupLeader( obj );
}

function changeCourt(){

	var obj = {
		quarter : $('.court-quarter.active').html().toLowerCase(),
		goal_type : 'all',
		home_player_id : $('#court-home').val(),
		away_player_id : $('#court-away').val(),
		view_type : $('.match-stat-tab.active').html().toLowerCase()
	}

	nba.courtView.updateCourtCollection( obj );
}

//function taht takes in new range and updates the view controlling the points being shown
function changeRange( ev, min_select, max_select ){

	var qa = nba.clock.get('quarter_number');

	var low = 0;
	var high = 0;

	if ( min_select > 3 ) low_increment = 300;
	else low_increment = 720;

	if ( max_select > 3 )	high_increment = 300;
	else high_increment = 720;

	var high_base = Math.floor(max_select);
	var high_diff = max_select - high_base;

	var low_base = Math.floor(min_select);
	var low_diff = min_select - low_base;

	var max_over = 0;

	if ( max_select > 3 ){
		max_over = max_select - 3;
		max_select = 3;
	}

	max_seconds = (max_select*720)+(max_over*300)+720;

	var min_over = 0;

	if ( min_select > 4 ){
		min_over = min_select - 4;
		min_select = 4;
	}

	min_seconds = (min_select*720)+(min_over*300);

	nba.momentumChart.adjustView(min_seconds,max_seconds);
}

function setMomentumSlider( q_number ){

	if ( nba.momentumChart ){
		var quarter_amount = q_number;
		var tabs_array = [];
		for ( var i = 0; i < quarter_amount; i++ ){

			var text = "";

			if( i >= 3 ){
				text += (i+1)+"TH";
			}
			else{
				if ( i == 0 ){ text += (i+1)+"ST"; }
				else if ( i == 1 ){ text += (i+1)+"ND"; }
				else text += (i+1)+"RD";
			}

			var data = i+1;

			tabs_array.push({text:text,data:data});

		}

		$( '#momentum-slider' ).html("");

	  var slide = new Razorfish.Slider( {
	            width : 400
	    , handleWidth : 12
	    ,    useRange : true
	    ,        tabs : tabs_array
	  } )
	    .appendTo ( $( '#momentum-slider' ) )
	    .bind     ( 'range', changeRange )
	    .setRange ( 0, quarter_amount-1);
	  }
}