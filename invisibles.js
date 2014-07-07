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

				var t = title.replace(/\W|_/g, '');

				wiki[t] = revisions;

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
			title = $this.attr('data-real-wiki');
		$.ajax({
			url: 'http://en.wikipedia.org/w/api.php?action=query&format=json&prop=revisions&titles=' + title + '&rvprop=timestamp|user&rvlimit=500',
			dataType: 'jsonp',
			success: function(data) {
				var revisions = [];
				pushRevisions($this, revisions, data, title);
			}
		});
	}
	$('[data-wiki]').each(getRevisions);

	function setGraphHeight(graph, height) {
		graph.attr({
			height: height
		});
	}

	function insertBar(graph, height, barX, barY, barWidth, barHeight, d, activeKey, dateString) {
		
		var shadowRect = graph.rect( barX, 0, barWidth, height ).attr({
			'class': 'graph-bar-invisible',
			'data-show-modal': true,
			'data-edits': graph.data('dates')[activeKey][d].length,
			'data-date-string': dateString,
			'fill': '#f2f2f2'
		});

		var fillRect = graph.rect( barX, barY, barWidth, 0).attr({
			'class': 'graph-bar fill-red',
			'data-show-modal': true,
			'data-edits': graph.data('dates')[activeKey][d].length,
			'data-date-string': dateString
		}).animate({ 
			height: barHeight,
			y: height - barHeight
		}, 250);

		shadowRect.hover(function(){
			fillRect.attr({
				fill: '#d20700'
			});
		}).mouseout(function(){
			fillRect.attr({
				fill: '#f42800'
			});
		});
		fillRect.hover(function(){
			shadowRect.attr({
				fill: '#d8d8d8'
			});
		}).mouseout(function(){
			shadowRect.attr({
				fill: '#f2f2f2'
			});
		});
	}

	function generateGraph(graph, activeKey) {

		body.attr('data-displaying', activeKey);

		var dates = graph.data('dates');

		var title = $(graph.node).closest('.invisible').find('h3 span');
		
		title.find('.over-last').remove();

		if ( activeKey === 'all' ) {
			title.html( title.html() + '<span class="over-last"> - Edits since page creation</span>' );

		} else {
			title.html( title.html() + '<span class="over-last"> - Edits over last ' + Object.keys(dates[activeKey]).length + ' ' + activeKey + '</span>' );
		}

		var bars = graph.selectAll('.graph-bar'),
			invisibleBars = graph.selectAll('.graph-bar-invisible');

		var delay = 200;

		var i = 0,
			height = 0;

		for ( var d in dates[activeKey] ) {

			var barHeight = 5 * dates[activeKey][d].length;

			if ( barHeight > height + 40 ) {
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

				// one extra for the date
				if ( activeKey === 'all' ) { barHeight -= 5; }

					var dateString,
						dateParts = d.split('-');

				if ( activeKey === 'all' ) {
					dateParts = dates[activeKey][d][0].split('-');
				}

				if ( activeKey === 'all' || activeKey === 'months' ) {
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

		}, delay + 1);
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

		title = title.replace(/\W|_/g, '');

		var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		svg.id = title;

		var invisible = $('[data-wiki="' + title + '"]');

		invisible.append(svg);

		var graph = Snap( '#' + title ),
			height = 0,
			width = invisible.width();

		if (graph) {
			graph.attr({ 
				height: height,
				width: width
			});

			var dates = {
				all: {},
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

			for ( var i = 0; i < revisions.length; i++ ) {

				var date = new Date(revisions[i].timestamp),
					year = date.getFullYear(),
					month = date.getMonth() + 1,
					day = date.getDay(),
					hour = date.getHours();

				if ( !dates['all'][year + '-' + month] ) { 
					dates['all'][year + '-' + month] = [];
				}
				dates['all'][year + '-' + month].push(revisions[i]);

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

			// fill in blanks in "all"
			for ( var mo in dates['all'] ) {
				
				mo = mo.split('-');

				var y = +mo[0],
					m = +mo[1];

				var nextM = m === 12 ? 1 : m + 1,
					nextY = nextM === 1 ? y + 1 : y;
				if ( !dates['all'][nextY + '-' + nextM] && y !== theYear && m !== theMonth ) {
					dates['all'][nextY + '-' + nextM] = [];
				}
			}
			var cm = theMonth,
				cy = theYear;
			while ( true ) {
				if ( !dates['all'][cy + '-' + cm] ) {
					dates['all'][cy + '-' + cm] = [];
				} else {
					break;
				}
				if ( cm === 1 ) {
					cm = 12;
					cy--;
				} else {
					cm--;
				}
			}

			dates['all'] = _.sortBy(dates['all'], function(n, v){ 
				n.push(v);
				n = n.reverse();
				var t = v.split('-'),
					sum;
				t[0] = +t[0] * 12;
				t[1] = +t[1];
				sum = t[0] + t[1];
				return -sum;
			});
			graph.data('dates', dates);

			generateGraph(graph, 'months');
		}
	}

	var modal = $('<div id="invisibles-modal">');
	body.append(modal);

	function showModal(e) {

		var $this = $(this),
			numEdits = +this.getAttribute('data-edits'),
			dateString = this.getAttribute('data-date-string');

		if ( body.attr('data-displaying') === 'all' ) { numEdits = numEdits - 1; }

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

		chooseDateRange.append('<h3>See edits over the last:</h3>');
		chooseDateRange.append('<ul class="clearfix"><li><button data-choose-date="hours">24 hours</button></li><li><button data-choose-date="days">30 days</button></li><li><button class="active" data-choose-date="months">12 months</button></li><li><button data-choose-date="all">All time</button></li></ul>');
		
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