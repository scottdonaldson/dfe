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

				buildGraph(title);
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

	function buildGraph(title) {

		var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		svg.id = title;

		var invisible = $('[data-wiki="' + title + '"]');

		invisible.append(svg);

		var graph = Snap( '#' + title ),
			height = 0,
			width = invisible.width() - invisible.find('.edits').width() - 10;

		graph.attr({ 
			height: height,
			width: width
		});

		var revisions = wiki[title],
			users = 0,
			dates = {};

		for (var i = 0; i < revisions.length; i++) {

			var date = new Date(revisions[i].timestamp),
				year = date.getFullYear(),
				month = date.getMonth() + 1,
				day = date.getDay();

			// date = year + '-' + month + '-' + day;
			date = year + '-' + month;

			if ( !dates.hasOwnProperty(date) ) {
				dates[date] = [];
			}

			dates[date].push(revisions[i]);

		}

		// loop through dates ONCE to get find the tallest (most edits)
		for ( var d in dates ) {

			var barHeight = 5 * dates[d].length;

			if ( barHeight > height) {
				height = barHeight;
			}

			if ( height < 80 ) { height = 80; }

			graph.attr({
				height: height
			});
		}

		// loop through again and create the bars of the graph
		var it = 0;
		for ( d in dates ) {

			var barX = it * (width / Object.keys(dates).length),
				barY = height,
				barWidth = width / Object.keys(dates).length,
				barHeight = 5 * dates[d].length;

			graph.rect( barX, 0, barWidth, height ).attr({
				'data-show-modal': true,
				'data-edits': dates[d].length,
				'fill': '#fff'
			});

			graph.rect( barX, barY, barWidth, 0).attr({
				'class': 'fill-red',
				'data-show-modal': true,
				'data-edits': dates[d].length
			}).animate({ 
				height: barHeight,
				y: height - barHeight
			}, 500);

			it++;

		}
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