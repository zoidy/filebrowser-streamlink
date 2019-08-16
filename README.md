# Filebrowser Stream Link
## Problem
The Filebrowser interface allows you to stream media within the browser without having to transcode it. However, not all media can be played in the browser. Some video players like VLC allow you to stream media but Filebrowser does not have built-in functionality to generate a streaming link. This is especially problematic when the Filebrowser instance is protected by a login, meaning you can't just copy and paste the link from the browser's URL bar into VLC.

## Solution
![screenshot](https://github.com/zoidy/filebrowser-streamlink/raw/master/screenshot.png)

This userscript adds a button to filebrowser (https://github.com/filebrowser/filebrowser) to more easily generate a network streaming link for playing in an external player like VLC. Selecting a file and clicking the button will download an M3U playlist file that can be quickly opened with VLC.

## Install
1. You must have the [Tampermonkey](https://www.tampermonkey.net) extension installed in your browser. It will probably work with Greasemonkey too.
1. [Install](https://github.com/zoidy/filebrowser-streamlink/raw/master/filebrowser-stream-link-user.js) this userscript. 
1. **Important: Edit the `@include` line to point to whatever domain you're running Filebrowser on!**

