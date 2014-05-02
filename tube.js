var io = require('socket.io-client');
module.exports = function (url, channel, password) {
    var socket = io.connect(url);
    var links = require('./links');

    var newVideoListeners = [];
    var timeChangeListeners = [];
    var stateChangeListeners = [];

    var lastState = -1;

    socket.emit('initChannelCallbacks');
    socket.emit('joinChannel', {
        name: channel,
        pw: password
    });
    socket.on('changeMedia', handleNewVideo);
    socket.on('mediaUpdate', handleTimeChange);
    socket.on('needPassword', function () {
        socket.emit('channelPassword', password);
    });

    function handleNewVideo(data) {
        var cb = function (link) {
            if (link) {
                emitLink(link, data.time);
            }
        };

        switch (data.type) {
            case 'yt':
                links.youtube(data.id, cb);
                break;
            case 'vi':
                links.vimeo(data.id, cb);
                break;
            case 'dm':
                links.dailymotion(data.id, cb);
                break;
            case 'sc':
                links.soundcloud(data.id, cb);
                break;
            case 'rtmp':
                links.osmf(data.id, cb);
                break;
            default:
                break;
        }
    }

    function handleTimeChange(data) {
        emitTimeChange(data.currentTime);
        if (data.paused !== lastState) {
            lastState = data.paused;
            emitStateChange(data.paused);
        }
    }

    function emitLink(link, inittime) {
        newVideoListeners.forEach(function (fn) {
            setImmediate(function () {
                fn(link, inittime);
            });
        });
    }

    function emitTimeChange(time) {
        timeChangeListeners.forEach(function (fn) {
            setImmediate(function () {
                fn(time);
            });
        });
    }

    function emitStateChange(state) {
        stateChangeListeners.forEach(function (fn) {
            setImmediate(function () {
                fn(state);
            });
        });
    }

    return {
        onVideoChange: function (cb) {
            newVideoListeners.push(cb);
        },

        onTimeChange: function (cb) {
            timeChangeListeners.push(cb);
        },

        onStateChange: function (cb) {
            stateChangeListeners.push(cb);
        }
    };
};
