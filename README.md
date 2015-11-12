# smaps - pretty view of smaps

- Download raw smaps file by double clicking pid.
- Drag-n-drop on body to parse.
- Android device's smaps supports.
- Tizen device's smaps supports.

## How to use

install by git clone

     git clone https://github.com/ivere27/smaps.git
     cd smaps
     npm install
     sudo DEBUG=* nodejs server.js

then, Navigate to http://localhost:8888 by your browser(ex, chrome).

## Android
check devices by

     adb devices

then,

     http://localhost:8888/android

## Tizen
check devices by

     sdb devices

then,

     http://localhost:8888/tizen
