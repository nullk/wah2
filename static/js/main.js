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
            showinfo: 0
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

    // Start interval to update elapsed time display and
    // the elapsed part of the progress bar every second.
    var time_update_interval = setInterval(function () {
        updateProgressBar();
    }, 1000)

    // Initialize socket events
    socket = io.connect('http://' + document.domain + ':' + location.port);

    socket.on('connect', function() {
        socket.emit('joined');
    });

    socket.on('new-user-sync', function(id) {
        console.log(id);
        window.onload = function() {
            event.target.loadVideoById(id);
        }
    });
}

window.stateChange = function(event) {
    $("#page-title").html("<a href='https://www.youtube.com/watch?v="+event.target.getVideoData()["video_id"]+"'>"+event.target.getVideoData()["title"]+"</a>");
    $("#page-author").html('By ' + event.target.getVideoData()["author"]);
}

// This function is called by initialize()
function updateProgressBar(){
    // Update the value of our progress bar accordingly.
    $('#progress-bar').val((player.getCurrentTime() / player.getDuration()) * 100);
}
