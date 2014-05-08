(function($){

	var win = $(window);

	window.wiki = {};	

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
			}
		});
	}
	$('[data-wiki]').each(getRevisions);

	function generateGraph(graph, activeKey) {

		var dates = graph.data('dates');

		for ( var d in dates[activeKey] ) {

			var height = 0,
				barHeight = 5 * dates[activeKey][d].length;

			if ( barHeight > height) {
				height = barHeight + 40;
			}

			if ( height < 80 ) { height = 120; }

			graph.attr({
				height: height
			});
		}

		graph.clear();

		// loop through again and create the bars of the graph
		var it = 0;

		for ( d in dates[activeKey] ) {

			var barX = it * (graph.attr('width') / 12),
				barY = height,
				barWidth = graph.attr('width') / 12,
				barHeight = 5 * dates[activeKey][d].length;

			graph.rect( barX, 0, barWidth, height ).attr({
				'data-show-modal': true,
				'data-edits': dates[activeKey][d].length,
				'fill': '#fff'
			});

			graph.rect( barX, barY, barWidth, 0).attr({
				'class': 'fill-red',
				'data-show-modal': true,
				'data-edits': dates[activeKey][d].length
			}).animate({ 
				height: barHeight,
				y: height - barHeight
			}, 500);

			it++;
		}
	}

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

		var now = new Date(),
			theYear = now.getFullYear(),
			theMonth = now.getMonth() + 1,
			theDate = 1, // now.getDay(),
			theHour = 2 // now.getHours();

		// Array with number of days in each month (consider leap years)
		var monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		if ( theYear % 4 === 0 && theYear !== 2100 ) {
			monthDays[1] = 29;
		}

		var key;
		// Build months object a la 2014-5, keeping in mind that we might be going back a year
		for ( var m = theMonth; m > theMonth - 12; m-- ) {
			key = m > 0 ? theYear + '-' + ((m + 12) % 12 || 12) : (theYear - 1) + '-' + ((m + 12) % 12 || 12);
			dates.months[key] = [];
		}

		// Build days object a la 2014-5-7, keeping in mind that we might be going back a month and a year
		for ( var d = theDate; d > theDate - 12; d-- ) {
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
		for ( var h = theHour; h > theHour - 12; h-- ) {
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
		setTimeout(function(){
			generateGraph(graph, 'days');
		}, 3500);
	}

	var modal = $('<div id="invisibles-modal">');
	$('body').append(modal);

	function showModal(e) {

		var $this = $(this),
			numEdits = +this.getAttribute('data-edits');

		modal.show().text( commas(numEdits.toString()) + ' edit' + (numEdits === 1 ? '' : 's') );
	
		modal.css({
			left: $this.offset().left - 100,
			top: $this.parent().offset().top + $this.parent().height() + 10 - win.scrollTop(),
		});
	}

	function hideModal() {
		modal.hide();
	}

	$('body')
		.on('mouseenter', '[data-show-modal]', showModal)
		.on('mouseleave', '[data-show-modal]', hideModal);

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