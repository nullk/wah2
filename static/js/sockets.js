// Initialize socket events ------------->
socket = io.connect('http://' + document.domain + ':' + location.port);

// Handle Connect ----------------------->
socket.on('connect', function () {
    socket.emit('joined');
});

// Load last video from DB -------------->
history_video_id = "";
socket.on('new-user-sync', function (id) {
    history_video_id = id["id"];
});

// Skip --------------------------------->
socket.on('server-skip', function (time) {
    player.seekTo(time);
    player.playVideo();
});

// Play / Pause ------------------------->
socket.on('server-play', function (time) {
    console.log("Received play socket")
    player.seekTo(time);
    player.playVideo();
});
socket.on('server-pause', function (time) {
    console.log("Received pause socket")
    player.seekTo(time);
    player.pauseVideo();
});
controlPlay = function () {
    socket.emit('client-play', {
        time: player.getCurrentTime()
    });
};
controlPause = function () {
    socket.emit('client-pause', {
        time: player.getCurrentTime()
    });
};

// Fullscreen --------------------------->
controlFullscreen = function () {
    // Chrome only
    var iframe = document.getElementById("video-placeholder");
    iframe.webkitRequestFullScreen();
}

// Process playing new video ------------>
socket.on('server-play-new', function (data) {
    player.loadVideoById(data["id"]);
    player.seekTo(0);
    player.playVideo();
});
controlPlayNew = function (url) {
    socket.emit('client-play-new', {
        url: url
    });
};

// Search function ---------------------->
socket.on('server-serve-list', function (data) {
    $("#search-list").empty();
    for (result in data["results"]) {
        $("#search-list").append("<tr><td><div class='search-result' onclick='controlPlayNew(\"https://www.youtube.com/watch?v=" + data["results"][result]["id"]["videoId"] + "\")' style='cursor:pointer'>" + data["results"][result]["snippet"]["title"] + "</td><td><img class='thumbnail' src='" + data["results"][result]["snippet"]["thumbnails"]["default"]["url"] + "'/></td></div></tr>");
    }
    if (data["results"].length == 0) {
        $("#search-list").append("<tr><td>No results found.</td></tr>");
    }
    $("#search").css("display", "block");
    document.querySelector("#search").scrollTop = 0;
});