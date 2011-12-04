var PlaylistDOMInformation = function() {
    this.dataTable = "table#tracks";
    
    this.parentTable = "table#tracks tbody";
    
    this.lastElementOfParent = this.parentTable + ":last";
    
    this.lastRowInParent = this.parentTable + " tr:last";
    
    this.allRowsInTable = this.parentTable + " tr";
    
    this.getRowCellsForID = function(id) {
      return this.getRowForID(id) + " td";  
    };
    
    this.getRowForID = function(id) {
        return this.parentTable + " tr." + id;
    };
    
    this.getRemovalHyperlinkForID =  function(id) {
        var selector = this.getRowForID(id) + " a.remove";
        return selector;
    };
};

function Playlist(soundManager) {
    this.currentTrack = 0;
    this.list = [];
    this.nextNewID = 0;
    this.newTrackIDs = [];
    this.playlistDOM = new PlaylistDOMInformation();
    this.soundManager = soundManager;
    this.totalDuration = 0; // Duration in seconds
    this.tracksByClass = new Object();
    this.tracksByID = new Object();
    
    this._addPlaylistDOMRow = function(soundObject, index) {
        var playlist = this;
        var id = soundObject.id;
         
        $(this.playlistDOM.dataTable).dataTable().fnAddData(this._getDOMRowForSoundObject(soundObject, index));
        $(this.playlistDOM.lastRowInParent).addClass(id);
        $(this.playlistDOM.getRemovalHyperlinkForID(id)).live('click', function() {
            playlist.removeTrack(id);
        });
    }
    
    this._getDOMRowForSoundObject = function(soundObject, index) {
        var extLink = '<a href="' + soundObject.permalink +'" target="_blank" class="external">' + soundObject.siteName + '</a>';
        var time = secondsToString(soundObject.duration);
        var remove = '<a onclick="return false;" class="remove" href>Remove</a>';
        return [index, soundObject.artist, soundObject.soundName, time, remove, extLink];
    }
    
    this._getDOMTableCellsForSoundObject = function(soundObject, index) {
        var column1 = '<td>' + index + '</td>';
        var column2 = '<td>' + soundObject.artist + '</td>';
        var column3 = '<td>' + soundObject.soundName + '</td>';
        var column4 = '<td>' + secondsToString(soundObject.duration) + '</td>';
        
        var remove = '<a onclick="return false;" class="remove" href>Remove</a>';
        var column5 = '<td>' + remove + '</td>';
        
        var extLink = '<a href="' + soundObject.permalink +'" target="_blank" class="external">' + soundObject.siteName + '</a>';
        var column6 = '<td>' + extLink + '</td>';
        
        return column1 + column2 + column3 + column4 + column5 + column6;
    }
    
    this._started = false;
    
    this.addTrack = function(soundObject) {
        var index = this.list.length;
        var trackNumber = index + 1;
        this.list[index] = soundObject;
        this.totalDuration += soundObject.duration;
        this._addPlaylistDOMRow(soundObject, trackNumber);
        $('#track-count').text(trackNumber.toString());
        $('#playlist-duration').text(secondsToString(this.totalDuration));
    };
    
    this.allocateNewIDs = function(count) {
        var firstNewID = this.nextNewID;
        this.nextNewID += count;
        var trackIDsLength = this.newTrackIDs.length;
        for (i = 0; i < count; i++) {
            this.newTrackIDs[trackIDsLength + i] = firstNewID + i;
        }
    }
    
    this.getNewTrackID = function() {
        var newID = this.newTrackIDs.splice(0, 1);
        newID = ($.isArray(newID) ? newID[0] : newID).toString();
        return newID;
    }
    
    this.hasNext = function() {
        return !this.isEmpty() && this.list.length > this.currentTrack + 1;
    }
    
    this.hasPrevious = function() {
        return !this.isEmpty() && this.currentTrack - 1 >= 0;
    }
    
    this.isEmpty = function() {
        return this.list.length == 0;
    }
    
    this.isPaused = function() {
        return this.list[this.currentTrack].getSound().paused;
    }
    
    this.isPlaying = function() {
        var status = false;
        if (!this.isEmpty()) {
            status = this.list[this.currentTrack].getSound().playState == 1;
        }
        return status;
    }
    
    this.nextTrack = function(autostart) {
        var wasPlaying = this.isPlaying();
        this.stop();
        this.currentTrack = this.currentTrack + 1 >= this.list.length ? 0 : this.currentTrack + 1;
        if (wasPlaying || autostart) {
            this.play();
        }
    }
    
    this.play = function() {
        if (!this.isEmpty()) {
            var playlist = this;
            var object = this.list[this.currentTrack].id;
            this.soundManager.play(object, {
                onfinish: function() {
                    playlist.nextTrack(true);
                },
                onload: function(success) {
                    if (!success) {
                        playlist.nextTrack(true);
                    }
                },
                whileplaying: function() {
                    var position = this.position, seconds = position/ 1000;
                    timeElapsed.text(secondsToString(seconds));
                    var percent = Math.min(100 * (position / this.duration), 100);
                    updateTimebar(percent);
                }
            });
            this._started = true;
            $('#play').text('Pause');
            $('.playing').removeClass('playing');
            var rowDOM = this.playlistDOM.getRowForID(this.list[this.currentTrack].id);
            $(rowDOM).addClass('playing');
        }
    }
    
    this.previousTrack = function(autostart) {
        var wasPlaying = this.isPlaying();
        this.stop();
        this.currentTrack = this.currentTrack - 1 >= 0 ? this.currentTrack - 1 : (this.isEmpty() ? 0 : this.list.length - 1);
        if (wasPlaying || autostart) {
            this.play();
        }
    }
    
    this.removeTrack = function(track_id) {
        var pos = -1;
        for (track in this.list) {
            if (this.list[track].id == track_id) {
                pos = track;
                break;
            }
        }
        if (pos >= 0) {
            var wasPlaying = this.isPlaying() && pos == this.currentTrack;
            this.stop();
            if (!this.hasNext()) {
                this.currentTrack = 0;
            }
            var trackDuration = this.list[pos].duration;
            this.list[pos].getSound().destruct();
            this.list.splice(pos, 1);
            this.totalDuration -= trackDuration;
            if (this.isEmpty()) {
                $('#play').text('Play');
            }
            else {
                if (wasPlaying) {
                    this.play();
                    $('#play').text('Pause');
                }
            }
            var rowDOM = this.playlistDOM.getRowForID(track_id);
            $(this.playlistDOM.dataTable).dataTable().fnDeleteRow(pos);
            $('#track-count').text(this.list.length.toString());
            $('#playlist-duration').text(secondsToString(this.totalDuration));
        }
    }
    
    this.seek = function(decimalPercent) {
        if (!this.isEmpty()) {
            var sound = this.list[this.currentTrack].sound;
            sound.setPosition(Math.floor(decimalPercent * sound.duration));
        }
    }
    
    this.shuffle = function() {
        if (this.isEmpty()) {
            return;
        }
        var listNumbers = [];
        for (track in this.list) {
            listNumbers[track] = track;
        }
        var newList = [];
        var newCurrentTrack = 0;
        while (listNumbers.length > 0) {
            var nextTrack = listNumbers[Math.floor(Math.random()*listNumbers.length)];
            listNumbers.splice(listNumbers.indexOf(nextTrack), 1);
            newList[newList.length] = this.list[nextTrack];
            if (nextTrack == this.currentTrack) {
                newCurrentTrack = newList.length - 1;
            }
        }
        var wasPlaying = this.isPlaying();
        if (this._started == true) {
            this.currentTrack = newCurrentTrack;
        }
        this.list = newList;
        var playlist = this;
        $(this.playlistDOM.allRowsInTable).attr("class", function(index) {
            return newList[index].id;
        }).each(function(index) {
            if (index == newCurrentTrack && wasPlaying) {
                $(this).addClass('playing');
            }
            $(playlist.playlistDOM.dataTable).dataTable().fnUpdate(playlist._getDOMRowForSoundObject(newList[index], index + 1), index, 0);
        });
    /*.each(function() {
            playlist.removeTrack(playlist.list[0].id);
        });*/
        
    /*for (index in this.list){
            this._addPlaylistDOMRow(this.list[index]);
        }*/
    }
    
    this.stop = function () {
        for (track in this.list) {
            this.list[track].getSound().stop();
        }
        timebar.width(0);
        $('#time-elapsed').text('0:00');
        $('#play').text('Play');
    }
    
    this.togglePause = function() {
        this.list[this.currentTrack].getSound().togglePause();
        if (this.isPaused()) {
            $('#play').text('Resume');
        }
        else {
            $('#play').text('Pause');
        }
    }
}
var playlist = new Playlist(soundManager);