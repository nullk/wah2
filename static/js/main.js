/*

For most of the code in this file, credit goes to:
https://demo.tutorialzine.com/2015/08/how-to-control-youtubes-video-player-with-javascript/

*/

var player;
var socket;

window.onYouTubeIframeAPIReady = function() {
    player = new YT.Player('video-placeholder', {
        width: $("#progress-bar").width(),
        height: 400,
        videoId: 'gMslUkDaDZA',
        playerVars: {
            color: 'white',
            controls: 0,
            rel: 0,
            showinfo: 0,
            'origin': 'http://jiejie.stream',
            'frameborder': 0
        },
        events: {
            onReady: initialize,
            onStateChange: stateChange
        }
    });
}

window.initialize = function(event) {
    //player.setSize({width: $("#resize-video-frame").width, height: $("#resize-video-frame").height});
    $("#page-title").html("<a href='https://www.youtube.com/watch?v="+event.target.getVideoData()["video_id"]+"'>"+event.target.getVideoData()["title"]+"</a>");
    $("#page-author").html('By ' + event.target.getVideoData()["author"]);
    updateProgressBar();
    updateTimerDisplay()

    // Start interval to update elapsed time display and
    // the elapsed part of the progress bar every second.
    var time_update_interval = setInterval(function () {
        updateProgressBar();
        updateTimerDisplay()
    }, 1000)
};

window.stateChange = function(event) {
    $("#page-title").html("<a href='https://www.youtube.com/watch?v="+event.target.getVideoData()["video_id"]+"'>"+event.target.getVideoData()["title"]+"</a>");
    $("#page-author").html('By ' + event.target.getVideoData()["author"]);
}

// This function is called by initialize()
function updateProgressBar(){
    // Update the value of our progress bar accordingly.
    $('#progress-bar').val((player.getCurrentTime() / player.getDuration()) * 100);
}

function updateTimerDisplay(){
    // Update current time text display.
    $('#current-time').text(formatTime( player.getCurrentTime() ));
    $('#duration').text(formatTime( player.getDuration() ));
}

function formatTime(time){
    time = Math.round(time);

    var minutes = Math.floor(time / 60),
    seconds = time - minutes * 60;

    seconds = seconds < 10 ? '0' + seconds : seconds;

    return minutes + ":" + seconds;
}