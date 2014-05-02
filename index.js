var VLCPlayer = require('./vlc');

if (process.argv.length < 4) {
    console.log('usage: node index.js <websocket url> <channel> [<password>]');
    process.exit();
}

var url = process.argv[2];
var channel = process.argv[3];
var pw;
if (process.argv.length > 4) {
    pw = process.argv[4];
}

var tube = require('./tube')(process.argv[2], process.argv[3], pw);
var SYNC_ACCURACY = 2;

var vlc = new VLCPlayer();

tube.onVideoChange(function (link, time) {
    vlc.load(link);
    vlc.seek(time);
    vlc.play();
});

tube.onTimeChange(function (time) {
    vlc.getTime(function (t) {
        if (Math.abs(time - t) >= SYNC_ACCURACY) {
            console.log('seekforward', time - t);
            vlc.seek(Math.round(time));
        }
    });
});

tube.onStateChange(function (paused) {
    if (!paused) {
        vlc.play();
    } else {
        vlc.pause();
    }
});
