<?php require_once 'slogans.php'; ?>

<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Unified Playlist</title>
        <link rel="stylesheet" type="text/css" href="css/playlist.css" />
        <script type="text/javascript">

            var _gaq = _gaq || [];
            _gaq.push(['_setAccount', 'UA-27456281-1']);
            _gaq.push(['_trackPageview']);

            (function() {
                var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
                ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
                var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
            })();

        </script>
    </head>
    <body>
        <div id="wrapper">
            <div id="main">
                <div id="playlist-view">
                    <ol id="tracks"></ol>
                </div>
                <div id="search-view">
                    <div id="search-form">
                        <div>
                            <input type="text" class="search-link" size="30"/>
                            <a href onclick="return false;" id="search-button-text">Search</a>
                        </div>
                        <div id="search-options">
                            <label><input type="checkbox" value="YouTube" /><span>YouTube</span></label>
                            <label><input type="checkbox" value="SoundCloud" /><span>SoundCloud</span></label>
                        </div>
                    </div>
                </div>
            </div>
            <div id="right-side">
                <div id="video-container">
                    <div id="video"></div>
                </div>
                <div id="side-controls">
                    <div id="side-content">
                        <div id="playlist-info">
                            <div class="rows">
                                <div class="player-row">
                                    <div id="track-count-wrapper">
                                        Tracks: <span id="track-count">0</span>
                                    </div>
                                    <div id="playlist-duration-wrapper">
                                        Duration: <span id="playlist-duration">0:00</span>
                                    </div>
                                </div>
                                <div class="player-row">
                                    <div id ="controls">
                                        <a href onclick="return false;" id="previous"></a>
                                        <a href onclick="return false;" id="play"></a>
                                        <a href onclick="return false;" id="stop"></a>
                                        <a href onclick="return false;" id="next"></a>
                                        <a href onclick="return false;" id="shuffle"></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="volume">
                            <div id="volume-outer">
                                <div id="volume-inner"></div>
                            </div>
                            <div id="volume-amount">Volume: 50</div>
                        </div>
                        <div class="rows">
                            <div class="player-row">
                                <div id="adder">
                                    <input type="text" class="search-link" size="30"/>
                                    <div class="search-button-container">
                                        <img src="img/addmediasource.png" />
                                        <a href onclick="return false;" class="search-button" id="adder-button">Add Media Source</a>
                                    </div>
                                </div>
                            </div>
                            <div class="player-row">
                                <div id="timebar">
                                    <div id="timebar-outer">
                                        <div id="timebar-inner"></div>
                                    </div>
                                </div>
                                <div id="time-elapsed">0:00</div>
                            </div>
                        </div>
                        <div class="rows">
                            <div class="player-row">
                                <a href onclick="return false;" id="search-activate">Search</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="footer">
                    <div id="footer-content"><b>Unified Playlist</b> powered by <a href="http://www.soundcloud.com">SoundCloud</a> and <a href="http://www.youtube.com">YouTube</a>. App by <a href="mailto:rfruchtose@gmail.com">Robert Fruchtman</a>.
                        <?php
                        $slogan = get_random_db_slogan();

                        if ($slogan !== false)
                            echo "<span class=\"slogan\">$slogan</span>";
                        ?>
                    </div>
                </div>
            </div>
        </div>
        <script src="js/swfobject.js" type="text/javascript"></script>
        <script src="js/jquery-1.7.1.min.js" type="text/javascript"></script>
        <script src="js/jquery.ajaxmanager.js" type="text/javascript"></script>
        <script src="js/jquery-ui-1.8.16.custom.min.js" type="text/javascript"></script>
        <script src="js/jquery.layout-latest.min.js" type="text/javascript"></script>
        <script src="js/jQuery.tubeplayer.js" type="text/javascript"></script>
        <script src="js/jquery.blockUI.js" type="text/javascript"></script>
        <script src="js/jquery.draginside.js" type="text/javascript"></script>
        <script src="js/soundmanager2-nodebug-jsmin.js" type="text/javascript"></script>
        <script src="js/jsclass.js" type="text/javascript"></script>
        <script src="js/config.js" type="text/javascript"></script>
        <script src="js/player.js" type="text/javascript"></script>
        <script src="js/playlist.js" type="text/javascript"></script>
        <script src="js/router.js" type="text/javascript"></script>
        <script src="js/ui.js" type="text/javascript"></script>
        <script src="js/input.js" type="text/javascript"></script>
    </body>
</html>
