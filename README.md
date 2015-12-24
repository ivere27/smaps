# smaps - pretty view of smaps

# Features

- Download raw smaps file by double clicking pid.
- Drag-n-drop a smaps file to browser in order to parse.
- Smaps to Excel Exports(thanks to Datatables)
- Android device's smaps supports.
- Tizen device's smaps supports.

## How to use

install by git clone

     git clone https://github.com/ivere27/smaps.git
     cd smaps
     npm install

launch http server,

     sudo DEBUG=* node server.js

then, Navigate to http://localhost:8888 by browsers(ex, chrome).

## Android
check devices by

     adb devices

and check ADB_PATH in settings.json, then

     http://localhost:8888/android

## Tizen
check devices by

     sdb devices

and check SDB_PATH in settings.json, then

     http://localhost:8888/tizen
