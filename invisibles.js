(function($){

	var win = $(window),
		body = $('body');

	window.wiki = {};

	var now = new Date(),
		theYear = now.getFullYear(),
		theMonth = now.getMonth() + 1,
		theDate = now.getDate(),
		theHour = now.getHours();

	var theMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

	// Array with number of days in each month (consider leap years)
	var monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	if ( theYear % 4 === 0 && theYear !== 2100 ) {
		monthDays[1] = 29;
	}

	function pushRevisions($this, revisions, data, title) {

		for (var id in data.query.pages) {

			for (var i = 0; i < data.query.pages[id].revisions.length; i++) {
				revisions.push(data.query.pages[id].revisions[i]);
			}

			if ( data['query-continue'] ) {

				getMoreRevisions($this, revisions, data, title);

			} else {

				$this.find('.edits span').html( commas(revisions.length.toString()) );

				wiki[title] = revisions;

				buildGraphData(title);
			}
		}
	}

	function getMoreRevisions($this, revisions, data, title) {
		$.ajax({
			url: 'http://en.wikipedia.org/w/api.php?action=query&format=json&prop=revisions&titles=' + title + '&rvprop=timestamp|user&rvlimit=500&rvcontinue=' + data['query-continue'].revisions.rvcontinue,
			dataType: 'jsonp',
			success: function(data) {
				pushRevisions($this, revisions, data, title);
			}
		});
	}

	function getRevisions() {
		var $this = $(this),
			title = $this.attr('data-wiki');
		$.ajax({
			url: 'http://en.wikipedia.org/w/api.php?action=query&format=json&prop=revisions&titles=' + title + '&rvprop=timestamp|user&rvlimit=500',
			dataType: 'jsonp',
			success: function(data) {
				var revisions = [];
				pushRevisions($this, revisions, data, title);
			},
			error: function() {
				var revisions = [];
				var data = {"warnings":{"main":{"*":"Unrecognized parameter: '_'"}},"query":{"normalized":[{"from":"Denise_Scott_Brown","to":"Denise Scott Brown"}],"pages":{"6620714":{"pageid":6620714,"ns":0,"title":"Denise Scott Brown","revisions":[{"user":"50.86.10.241","anon":"","timestamp":"2014-02-24T20:36:11Z"},{"user":"50.86.10.241","anon":"","timestamp":"2014-02-24T20:35:51Z"},{"user":"Q**78","timestamp":"2014-02-06T09:48:13Z"},{"user":"Robert4565","timestamp":"2014-02-02T20:29:33Z"},{"user":"Josh3580","timestamp":"2014-01-24T19:16:48Z"},{"user":"50.74.57.218","anon":"","timestamp":"2014-01-24T19:14:44Z"},{"user":"Solar-Wind","timestamp":"2014-01-19T23:35:26Z"},{"user":"Frze","timestamp":"2014-01-17T10:55:20Z"},{"user":"1000years","timestamp":"2014-01-16T02:26:20Z"},{"user":"Goyah","timestamp":"2013-12-22T11:38:02Z"},{"user":"Morgan Riley","timestamp":"2013-09-12T00:43:00Z"},{"user":"JackofOz","timestamp":"2013-06-24T08:32:06Z"},{"user":"BoringHistoryGuy","timestamp":"2013-05-31T18:14:34Z"},{"user":"Aval286","timestamp":"2013-04-19T17:01:22Z"},{"user":"Aval286","timestamp":"2013-04-19T16:56:28Z"},{"user":"Aval286","timestamp":"2013-04-19T16:55:15Z"},{"user":"The Rambling Man","timestamp":"2013-04-19T16:51:58Z"},{"user":"92.225.117.52","anon":"","timestamp":"2013-04-18T20:15:59Z"},{"user":"Malerooster","timestamp":"2013-03-20T03:22:19Z"},{"user":"Waacstats","timestamp":"2013-03-14T21:24:04Z"},{"user":"148.233.161.66","anon":"","timestamp":"2013-03-11T21:51:53Z"},{"user":"148.233.161.66","anon":"","timestamp":"2013-03-11T21:49:44Z"},{"user":"Addbot","timestamp":"2013-02-27T08:04:30Z"},{"user":"108.52.16.76","anon":"","timestamp":"2013-02-26T07:25:58Z"},{"user":"Omnipaedista","timestamp":"2012-12-18T06:13:55Z"},{"user":"VIAFbot","timestamp":"2012-11-21T23:41:34Z"},{"user":"Endlessstairs","timestamp":"2012-11-19T18:53:11Z"},{"user":"202.50.208.25","anon":"","timestamp":"2012-11-09T00:01:11Z"},{"user":"202.50.208.25","anon":"","timestamp":"2012-11-09T00:00:32Z"},{"user":"Ponyo","timestamp":"2012-11-04T01:25:41Z"},{"user":"Chaim1995","timestamp":"2012-10-02T01:31:52Z"},{"user":"Helpful Pixie Bot","timestamp":"2012-05-06T00:13:08Z"},{"user":"Gerbis","timestamp":"2012-05-02T13:09:40Z"},{"user":"Ammott80","timestamp":"2012-04-08T17:11:26Z"},{"user":"Dthomsen8","timestamp":"2012-04-05T13:01:50Z"},{"user":"ClueBot NG","timestamp":"2012-02-09T07:28:29Z"},{"user":"90.208.154.125","anon":"","timestamp":"2012-02-09T07:28:26Z"},{"user":"Kaldari","timestamp":"2012-02-03T20:55:50Z"},{"user":"Reeze2000","timestamp":"2012-02-01T21:16:07Z"},{"user":"Rjwilmsi","timestamp":"2012-01-03T08:14:47Z"},{"user":"TXiKiBoT","timestamp":"2012-01-02T07:07:01Z"},{"user":"Chesterct","timestamp":"2011-12-18T01:17:21Z"},{"user":"Chesterct","timestamp":"2011-12-18T01:15:38Z"},{"user":"Pablitochumm2","timestamp":"2011-08-02T14:30:37Z"},{"user":"HappyLarry88","timestamp":"2011-07-22T09:41:40Z"},{"user":"HappyLarry88","timestamp":"2011-07-20T14:00:50Z"},{"user":"Hu12","timestamp":"2011-06-30T16:07:49Z"},{"user":"Architectcheck","timestamp":"2011-06-30T15:55:05Z"},{"user":"Architectcheck","timestamp":"2011-06-29T19:42:13Z"},{"user":"Yobot","timestamp":"2011-06-27T14:30:44Z"},{"user":"216.1.41.19","anon":"","timestamp":"2011-06-01T16:19:52Z"},{"user":"Kleeingram","timestamp":"2011-03-01T21:24:58Z"},{"user":"Nymf","timestamp":"2011-02-13T13:11:40Z"},{"user":"Pezespe","timestamp":"2011-02-08T03:52:14Z"},{"user":"Neptunekh2","timestamp":"2011-02-06T20:07:15Z"},{"user":"Neptunekh2","timestamp":"2011-02-06T20:04:44Z"},{"user":"Johnpacklambert","timestamp":"2011-01-05T00:10:18Z"},{"user":"Johnpacklambert","timestamp":"2011-01-05T00:09:51Z"},{"user":"Fitzrovia calling","timestamp":"2010-11-05T15:37:51Z"},{"user":"Yobot","timestamp":"2010-09-24T12:54:17Z"},{"user":"Good Olfactory","timestamp":"2010-08-06T04:08:56Z"},{"user":"79.23.177.87","anon":"","timestamp":"2010-07-29T14:59:31Z"},{"user":"Wizardman","timestamp":"2010-07-19T16:31:47Z"},{"user":"74.94.38.148","anon":"","timestamp":"2010-04-24T12:38:24Z"},{"user":"NE Ent","timestamp":"2010-01-20T12:58:40Z"},{"user":"SmackBot","timestamp":"2009-12-22T14:38:27Z"},{"user":"DutchTreat","timestamp":"2009-10-11T17:38:36Z"},{"user":"DutchTreat","timestamp":"2009-10-11T17:36:31Z"},{"user":"DutchTreat","timestamp":"2009-10-11T17:33:34Z"},{"user":"DutchTreat","timestamp":"2009-10-11T17:27:58Z"},{"user":"DutchTreat","timestamp":"2009-10-11T14:06:21Z"},{"user":"DutchTreat","timestamp":"2009-10-11T14:01:04Z"},{"user":"Reeze2000","timestamp":"2009-09-21T14:15:10Z"},{"user":"Reeze2000","timestamp":"2009-09-21T14:14:25Z"},{"user":"93.95.83.1","anon":"","timestamp":"2009-09-20T09:10:50Z"},{"user":"Elekhh","timestamp":"2009-09-16T07:23:29Z"},{"user":"Jeff G.","timestamp":"2009-07-29T04:41:50Z"},{"user":"Kevinlynch97","timestamp":"2009-07-29T04:30:26Z"},{"user":"Kevinlynch97","timestamp":"2009-07-29T04:28:57Z"},{"user":"Kevinlynch97","timestamp":"2009-07-29T04:26:25Z"},{"user":"Kevinlynch97","timestamp":"2009-07-29T04:24:51Z"},{"user":"Fadesga","timestamp":"2009-07-22T15:50:53Z"},{"user":"PigFlu Oink","timestamp":"2009-05-23T16:24:46Z"},{"user":"SmackBot","timestamp":"2009-03-27T07:43:04Z"},{"user":"Johnpacklambert","timestamp":"2009-02-27T23:32:30Z"},{"user":"LisaNielsenAgnew","timestamp":"2008-11-10T15:41:04Z"},{"user":"Lightbot","timestamp":"2008-10-06T14:19:18Z"},{"user":"Paralympic","timestamp":"2008-08-31T23:50:22Z"},{"user":"SmackBot","timestamp":"2008-08-31T15:52:54Z"},{"user":"Rockpocket","timestamp":"2008-07-17T19:35:29Z"},{"user":"59.95.161.9","anon":"","timestamp":"2008-06-01T15:20:54Z"},{"user":"59.95.161.9","anon":"","timestamp":"2008-06-01T15:19:05Z"},{"user":"59.95.161.9","anon":"","timestamp":"2008-06-01T15:18:13Z"},{"user":"59.95.161.9","anon":"","timestamp":"2008-06-01T15:15:55Z"},{"user":"193.11.212.177","anon":"","timestamp":"2008-04-13T21:12:36Z"},{"user":"Superbret","timestamp":"2008-04-10T14:02:51Z"},{"user":"Gene Nygaard","timestamp":"2007-12-20T08:20:29Z"},{"user":"74.71.241.188","anon":"","timestamp":"2007-12-13T05:00:33Z"},{"user":"Thijs!bot","timestamp":"2007-11-01T13:22:53Z"},{"user":"Bobblehead","timestamp":"2007-09-19T02:07:46Z"},{"user":"Superbret","timestamp":"2007-07-26T19:10:53Z"},{"user":"Superbret","timestamp":"2007-07-26T19:08:33Z"},{"user":"Superbret","timestamp":"2007-07-26T14:36:12Z"},{"user":"Superbret","timestamp":"2007-07-26T14:35:45Z"},{"user":"Superbret","timestamp":"2007-07-26T14:34:59Z"},{"user":"Superbret","timestamp":"2007-07-26T14:33:08Z"},{"user":"Superbret","timestamp":"2007-07-26T14:32:35Z"},{"user":"Superbret","timestamp":"2007-07-23T21:23:59Z"},{"user":"Superbret","timestamp":"2007-07-23T21:21:44Z"},{"user":"Superbret","timestamp":"2007-07-23T21:20:31Z"},{"user":"Superbret","timestamp":"2007-07-23T21:19:37Z"},{"user":"Superbret","timestamp":"2007-07-23T19:38:45Z"},{"user":"Superbret","timestamp":"2007-07-23T19:34:32Z"},{"user":"Superbret","timestamp":"2007-07-23T19:28:56Z"},{"user":"Superbret","timestamp":"2007-07-23T18:10:34Z"},{"user":"Superbret","timestamp":"2007-07-23T18:05:57Z"},{"user":"Superbret","timestamp":"2007-07-23T17:15:09Z"},{"user":"Superbret","timestamp":"2007-07-23T17:11:57Z"},{"user":"Superbret","timestamp":"2007-07-20T21:55:30Z"},{"user":"Superbret","timestamp":"2007-07-20T21:54:23Z"},{"user":"Superbret","timestamp":"2007-07-20T21:50:22Z"},{"user":"Superbret","timestamp":"2007-07-20T21:49:35Z"},{"user":"74.94.38.157","anon":"","timestamp":"2007-07-20T21:47:38Z"},{"user":"74.94.38.157","anon":"","timestamp":"2007-07-20T21:43:16Z"},{"user":"74.94.38.157","anon":"","timestamp":"2007-07-20T21:29:15Z"},{"user":"74.94.38.157","anon":"","timestamp":"2007-07-20T20:22:35Z"},{"user":"74.94.38.157","anon":"","timestamp":"2007-07-20T20:21:58Z"},{"user":"69.176.202.54","anon":"","timestamp":"2007-03-09T18:36:41Z"},{"user":"24.158.224.58","anon":"","timestamp":"2007-02-23T22:28:03Z"},{"user":"24.158.224.58","anon":"","timestamp":"2007-02-23T22:27:34Z"},{"user":"24.158.224.58","anon":"","timestamp":"2007-02-23T22:25:51Z"},{"user":"QuizzicalBee","timestamp":"2007-02-19T03:20:19Z"},{"user":"QuizzicalBee","timestamp":"2007-02-15T21:50:06Z"},{"user":"193.255.108.20","anon":"","timestamp":"2007-02-15T14:34:32Z"},{"user":"205.228.73.11","anon":"","timestamp":"2006-12-21T16:34:13Z"},{"user":"Stemonitis","timestamp":"2006-12-20T16:36:27Z"},{"user":"Muntuwandi","timestamp":"2006-12-20T06:06:19Z"},{"user":"Lincher","timestamp":"2006-11-13T21:58:58Z"},{"user":"Lincher","timestamp":"2006-11-13T21:58:11Z"},{"user":"Charles Matthews","timestamp":"2006-11-13T09:07:58Z"},{"user":"72.64.154.91","anon":"","timestamp":"2006-11-01T15:53:52Z"},{"user":"FlaBot","timestamp":"2006-10-22T02:44:36Z"},{"user":"Shirley Ku","timestamp":"2006-09-01T23:23:13Z"},{"user":"H0n0r","timestamp":"2006-09-01T22:41:33Z"},{"user":"H0n0r","timestamp":"2006-09-01T22:41:16Z"},{"user":"H0n0r","timestamp":"2006-08-23T00:17:29Z"},{"user":"H0n0r","timestamp":"2006-08-23T00:12:30Z"}]}}}};
				pushRevisions($this, revisions, data, title);
			}
		});
	}
	$('[data-wiki]').each(getRevisions);

	function setGraphHeight(graph, height) {

		graph.attr({
			height: +graph.attr('height') + (height > graph.attr('height') ? 1 : -1)
		});
		
		if ( Math.abs(height - (+graph.attr('height'))) < 3 ) {
			graph.attr({
				height: height
			});
		} else {
			setTimeout(function(){
				setGraphHeight(graph, height);
			}, 3);
		}
	}

	function insertBar(graph, height, barX, barY, barWidth, barHeight, d, activeKey, dateString) {
		
		graph.rect( barX, 0, barWidth, height ).attr({
			'class': 'graph-bar-invisible',
			'data-show-modal': true,
			'data-edits': graph.data('dates')[activeKey][d].length,
			'data-date-string': dateString,
			'fill': '#f2f2f2'
		});

		graph.rect( barX, barY, barWidth, 0).attr({
			'class': 'graph-bar fill-red',
			'data-show-modal': true,
			'data-edits': graph.data('dates')[activeKey][d].length,
			'data-date-string': dateString
		}).animate({ 
			height: barHeight,
			y: height - barHeight
		}, 250);
	}

	function generateGraph(graph, activeKey) {

		var dates = graph.data('dates');

		var title = $(graph.node).closest('.invisible').find('h3 span');
		
		title.find('.over-last').remove();

		title.html( title.html() + '<span class="over-last"> - Edits over last ' + Object.keys(dates[activeKey]).length + ' ' + activeKey + '</span>' );

		var bars = graph.selectAll('.graph-bar'),
			invisibleBars = graph.selectAll('.graph-bar-invisible');

		var delay = 200;

		var i = 0,
			height = 0;

		for ( var d in dates[activeKey] ) {

			var barHeight = 5 * dates[activeKey][d].length;

			if ( barHeight > height) {
				height = barHeight + 40;
			}

			if ( height < 120 ) { height = 120; }

			setGraphHeight(graph, height)

			i++;
		}

		for ( var b = 0; b < bars.length; b++ ) {
			bars[b].animate({
				height: 0,
				y: height
			}, delay, '', function() {
				$(graph).find('.graph-bar').remove();
			});
			invisibleBars[b].animate({
				height: 0,
				y: height
			}, delay, '', function() {
				$(graph).find('.graph-bar-invisible').remove();
			});
		}

		setTimeout(function() {

			// loop through again and create or animate the bars of the graph
			var it = 0;

			for ( d in dates[activeKey] ) {

				var barX = graph.attr('width') - (it + 1) * (graph.attr('width') / Object.keys(dates[activeKey]).length),
					barY = height,
					barWidth = graph.attr('width') / Object.keys(dates[activeKey]).length,
					barHeight = 5 * dates[activeKey][d].length;

				var dateString,
					dateParts = d.split('-');

				if ( activeKey === 'months' ) {
					dateString = 'during ' + theMonths[(+dateParts[1]) - 1] + '&nbsp;' + dateParts[0];
				} else if ( activeKey === 'days' ) {
					dateString = 'on ' + theMonths[(+dateParts[1]) - 1] + '&nbsp;' + dateParts[2];
				} else if ( activeKey === 'hours' ) {
					var ampm = +dateParts[3] >= 12 ? 'pm' : 'am',
						toHour = (+dateParts[3] + 12) % 12 || 12,
						fromHour = toHour - 1;

					if ( toHour === 12 ) {
						if ( ampm === 'pm' ) {
							fromHour += ' am';
						} else {
							fromHour += ' pm';
						}
					}

					dateString = 'from<br>' + fromHour + ' &ndash; ' + toHour + ' ' + ampm + ' on ' + theMonths[(+dateParts[1]) - 1] + ' ' + dateParts[2];
				}

				insertBar(graph, height, barX, barY, barWidth, barHeight, d, activeKey, dateString);

				it++;
			}

		}, delay);
	}

	function resizeGraphs() {
		var graphs = $('svg');
		graphs.each(function(){
			var $this = $(this),
				graph = Snap(this),
				width = $this.parent().width();
			graph.attr({
				width: $this.parent().width()
			});
			var bars = graph.selectAll('rect');
			for (var i = 0; i < bars.length; i++) {
				bars[i].attr({
					x: width - Math.ceil((i + 1) / 2) * width / 12,
					width: width / 12
				});
			}
		});
	}
	$(window).on('resize', resizeGraphs);

	function buildGraphData(title) {

		var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		svg.id = title;

		var invisible = $('[data-wiki="' + title + '"]');

		invisible.append(svg);

		var graph = Snap( '#' + title ),
			height = 0,
			width = invisible.width();

		graph.attr({ 
			height: height,
			width: width
		});

		var dates = {
			months: {},
			days: {},
			hours: {}
		};

		var key;
		// Build months object a la 2014-5, keeping in mind that we might be going back a year
		for ( var m = theMonth; m > theMonth - 12; m-- ) {
			key = m > 0 ? theYear + '-' + ((m + 12) % 12 || 12) : (theYear - 1) + '-' + ((m + 12) % 12 || 12);
			dates.months[key] = [];
		}

		// Build days object a la 2014-5-7, keeping in mind that we might be going back a month and a year
		for ( var d = theDate; d > theDate - 30; d-- ) {
			if ( d > 0 ) {
				key = theYear + '-' + theMonth + '-' + d;
			} else {
				var keyMonth = theMonth - 1 === 0 ? 12 : theMonth - 1,
					daysInMonth = monthDays[keyMonth - 1];
				if ( keyMonth === 12 ) {
					key = (theYear - 1) + '-' + keyMonth + '-' + ((d + daysInMonth) % daysInMonth || daysInMonth);
				} else {
					key = theYear + '-' + keyMonth + '-' + ((d + daysInMonth) % daysInMonth || daysInMonth);
				}
			}
			dates.days[key] = [];
		}

		// Build hours object a la 2014-5-7-21, keeping in mind that we might be going back a day, a month, and a year
		for ( var h = theHour; h > theHour - 24; h-- ) {
			if ( h >= 0 ) {
				key = theYear + '-' + theMonth + '-' + theDate + '-' + h;
			} else {
				var keyDay = theDate - 1;
				// if we're going back a month...
				if ( keyDay === 0 ) {
					var keyMonth = theMonth - 1 === 0 ? 12 : theMonth - 1,
						daysInMonth = monthDays[keyMonth - 1];
					
					if ( keyMonth === 12 ) {
						key = (theYear - 1) + '-' + keyMonth + '-' + ((keyDay + daysInMonth) % daysInMonth || daysInMonth) + '-' + ((h + 24) % 24);
					} else {
						key = theYear + '-' + keyMonth + '-' + ((keyDay + daysInMonth) % daysInMonth || daysInMonth) + '-' + ((h + 24) % 24);
					}
				// not going back a month
				} else {
					key = theYear + '-' + theMonth + '-' + keyDay + '-' + ((h + 24) % 24);
				}
			}
			dates.hours[key] = [];
		}

		var revisions = wiki[title];

		for (var i = 0; i < revisions.length; i++) {

			var date = new Date(revisions[i].timestamp),
				year = date.getFullYear(),
				month = date.getMonth() + 1,
				day = date.getDay(),
				hour = date.getHours();

			if ( dates.months[year + '-' + month] ) {
				dates.months[year + '-' + month].push(revisions[i]);
			}

			if ( dates.days[year + '-' + month + '-' + day] ) {
				dates.days[year + '-' + month + '-' + day].push(revisions[i]);
			}

			if ( dates.hours[year + '-' + month + '-' + day + '-' + hour] ) {
				dates.hours[year + '-' + month + '-' + day + '-' + hour].push(revisions[i]);
			}
		}

		graph.data('dates', dates);

		generateGraph(graph, 'months');
	}

	var modal = $('<div id="invisibles-modal">');
	body.append(modal);

	function showModal(e) {

		var $this = $(this),
			numEdits = +this.getAttribute('data-edits'),
			dateString = this.getAttribute('data-date-string');

		modal.show().html( commas(numEdits.toString()) + ' edit' + (numEdits === 1 ? '' : 's') + ' ' + dateString );
	
		modal.css({
			left: $this.offset().left + 0.5 * +this.getAttribute('width') - 0.5 * modal.width(),
			top: $this.parent().offset().top + $this.parent().height() + 1 - win.scrollTop(),
		});
	}

	function hideModal() {
		modal.hide();
	}

	body
		.on('mouseenter', '[data-show-modal]', showModal)
		.on('mouseleave', '[data-show-modal]', hideModal);

	var chooseDateRange = $('<div id="choose-date-range">');

	function hideOrShowChooseDateRange() {
		if ( win.scrollTop() + win.height() > $('.invisible').first().offset().top + 1.5 * chooseDateRange.outerHeight() ) {
			chooseDateRange.css({
				bottom: 0
			});
		} else {
			chooseDateRange.css({
				bottom: -chooseDateRange.outerHeight()
			});
		}
	}
	win.on('load scroll', hideOrShowChooseDateRange);

	function insertChooseDateRange() {
		chooseDateRange.hide();

		chooseDateRange.append('<h3>See all edits over the last:</h3>');
		chooseDateRange.append('<ul class="clearfix"><li><button data-choose-date="hours">24 hours</button></li><li><button data-choose-date="days">30 days</button></li><li><button class="active" data-choose-date="months">12 months</button></li></ul>');
		
		body.append(chooseDateRange);

		chooseDateRange.css('bottom', -chooseDateRange.outerHeight()).show();
	}
	$(document).ready(insertChooseDateRange);

	body.on('click', '[data-choose-date]', function(){
		var $this = $(this);
		if (!$this.hasClass('active')) {

			$this.addClass('active');
			$('[data-choose-date]').not($this).removeClass('active');
			
			$('svg').each(function(){
				generateGraph(Snap(this), $this.attr('data-choose-date'));
			});
		}
	});

	// ----- Utilities

	function commas(string) {
		string += '';
		x = string.split('.');
		x1 = x[0];
		x2 = x.length > 1 ? '.' + x[1] : '';
		var rgx = /(\d+)(\d{3})/;
		while (rgx.test(x1)) {
			x1 = x1.replace(rgx, '$1' + ',' + '$2');
		}
		return x1 + x2; 
	}

}(jQuery));