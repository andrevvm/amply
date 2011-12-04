var body;
var bodyLayoutOptions = {
    center: {
        paneSelector: "#main"
            
    },
    north: {
        closable: false,
        paneSelector: "#player-wrapper",
        resizable: false,
        size: 60,
        slidable: false
    },
    south: {
        closable: false,
        paneSelector: "#footer",
        resizable: false,
        size: 20,
        slidable: false
    }
};

var header;
var headerLayoutOptions = {
    center: {
        paneSelector: "#timebar",
        minSize: 400
    },
    defaults: {
        closable: false,
        resizable: false,
        slidable: false
    },
    east: {
        minSize: 300,
        paneSelector: "#adder",
        size: 300
    },
    west: {
        minSize: 300,
        paneSelector: "#controls",
        size: 300
    }
};

var tracksTableOptions = {
    "bFilter": false,
    "bInfo": false,
    "bPaginate": false,
    "bSort": false,
    "oLanguage": {
        "sZeroRecords": "Tracks will show up here!"
    },
    "sDOM": 't'
};

$(document).ready(function() {
    body = $('body').layout(bodyLayoutOptions);
    header = $('#player-wrapper').layout(headerLayoutOptions);
    $('table#tracks').dataTable(tracksTableOptions);
});

$('#previous').live('click', function() {
    playlist.previousTrack();
});

$('#play').live('click', function() {
    if (playlist.isPlaying()) {
        playlist.togglePause();
    }
    else {
        playlist.play();
    }
});

$('#next').live('click', function() {
    playlist.nextTrack();
});

$('#stop').live('click', function() {
    playlist.stop();
});

$('#shuffle').live('click', function() {
    playlist.shuffle();
});

$('#adder-button').live('click', function(){
    var value = $('#adder-link').val();
    router.addTracks(value);
    $('#adder-link').val("");
});

var timebar, timebarLastUpdated = new Date(), timebarNowUpdated, timeElapsed;
var updateTimebar = function(percentage) {
    if (percentage >= 0 && percentage <= 100) {
        timebarNowUpdated = new Date();
        if (timebarNowUpdated - timebarLastUpdated < 333) {
            return;
        }
        timebar.width(percentage.toFixed(2) + "%");
        timebarLastUpdated = new Date();
    }   
}

$(function() {
    timebar = $('#timebar-inner');
    timeElapsed = $('#time-elapsed');
});

$(document).ready(function() {
    var timebarOuter = $("#timebar-outer");
    timebarOuter.click(function(e) {
        var fraction = (e.pageX - timebarOuter.offset().left) / timebarOuter.width();
       playlist.seek(fraction.toFixed(4)); 
    });
});

var secondsToString = function(duration) {
        var str = "";
        // The duration can be a decimal, but we want it to be an integer so the user 
        // doesn't end up seeing the a track is 4:20 when the track is actually 260.75 seconds long.
        // This would mean that adding this track to the playlist twice would cause the 
        // total duration to be 8:41 (260.75 + 260.75 = 521.5 seconds). To prevent this from happening, 
        // we round up. The track of 260.75 seconds is now reported to be 4:21, and 
        // the adding this track twice to the playlist would make the total duration 
        // to be 8:42, which the user would expect intuitively.
        var secondsLeft = Math.ceil(duration);
        var hours = Math.floor(secondsLeft / 3600);
        if (hours >= 1) {
            secondsLeft -= hours * 3600;
        }
        var minutes = Math.floor(secondsLeft / 60);
        if (minutes >= 1) {
            secondsLeft -= (minutes * 60);
        }
        var seconds = Math.floor(secondsLeft);
        str = (hours >= 1) ? (hours.toString() + ":") : "";
        if (minutes < 10 && hours >= 1) {
            str += "0";
        }
        str += minutes.toString() + ":";
        if (seconds < 10) {
            str += "0";
        }
        str += seconds.toString();
        return str;
    }