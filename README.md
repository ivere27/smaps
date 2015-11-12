# smaps - pretty view of smaps

# Features

- Download raw smaps file by double clicking pid.
- Drag-n-drop a smaps file to browser in order to parse.
- Samps to Excel Exports(thanks to Datatables)
- Android device's smaps supports.
- Tizen device's smaps supports.

## How to use

install by git clone

     git clone https://github.com/ivere27/smaps.git
     cd smaps
     npm install

launch http server,

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
