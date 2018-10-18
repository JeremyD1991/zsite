const API_KEY = '60e555d8193e8fe932f9ff1f4ec4271e';
var Trackster = {};

$( document ).ready(function() {
    $('#search-button').click(function() {
		var $searchTerm = $('#search-input').val();
		Trackster.searchTracksByTitle($searchTerm);
		$('h1').addClass('animate');
	});
	$('#search-input').keypress(function(e){
		if(e.which === 13) {
			$('#search-button').click();
		}
	});
});

Trackster.renderTracks = function(tracks) {
	
	$('#track-list').empty();
	
	for (i = 0; i < tracks.length; i++) {
		var track = tracks[i];
		var mediumAlbumArt = track.image[1]["#text"];
		var listen = numeral(tracks[i].listeners).format (0,0);
		var htmlTrack = 
			'<div class="row track">' + 
				'	<div class="col-xs-1 col-xs-offset-1 play-button"><a href="' + tracks[i].url + '"><i class="fa fa-play-circle-o fa-2x"></i></a></div>' + 
				'	<div class="col-xs-4">' + tracks[i].name + '</div>' + 
				'	<div class="col-xs-2">' + tracks[i].artist + '</div>' + 
				'	<div class="col-xs-2"><img src="' + mediumAlbumArt + '"/></div>' + 
				'	<div class="col-xs-2">' + listen + '</div>' + 
			'</div>';
		$('#track-list').append(htmlTrack);
	}
};

Trackster.searchTracksByTitle = function(title) {
	$.ajax ({
		url: 'https://ws.audioscrobbler.com/2.0/?method=track.search&track=' + title + '&api_key=' + API_KEY + '&format=json',
		success: function(response) {
		Trackster.renderTracks(response.results.trackmatches.track);
		console.log(response);
	}
	});
};