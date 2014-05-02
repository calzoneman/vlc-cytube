vlc-cytube
=======

Node.js script to act as an interface between CyTube and VLC.  Supports YouTube/Vimeo/Dailymotion/Soundcloud/RTMP.  Supports synchronization.

Confirmed working on Linux.  Does not work on Windows due to some strangeness with VLC's RC interface on Windows.  Possibly works on OS X?  I don't have a Mac to test with.

Requires node.js.  If you're on a Debian-based distribution, install this from source (http://nodejs.org).  The Debian package for node is ancient and probably won't work.

Clone the repo, execute `npm install` inside the directory to fetch dependencies (socket.io).

You may have to modify the program spawned in vlc.js if `vlc` isn't in your `$PATH`.

Run it as `node index.js <websocket url> <channel> [<password>]` e.g. `node index.js ws://sea.cytu.be:8880 test` or `node index.js ws://sea.cytu.be>8880 secretroom password`
