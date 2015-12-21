'use strict';
var electron = require('electron');
var request = require('request');
var notifier = require('node-notifier');

var app = electron.app;  // Module to control application life.
var Menu = electron.Menu;
var Tray = electron.Tray;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
//var mainWindow;

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform != 'darwin') {
        app.quit();
    }
});

app.on('ready', function () {
    var tray = new Tray('./vacant.png');

    var transformStatusFlagToStatusText = function (isOccupied) {
        return isOccupied ? 'occupied' : 'vacant';
    };

    var currentStatus = transformStatusFlagToStatusText(false);

    var notifyStatus = function(status) {
        notifier.notify({
            title: 'Aconex Toilet Monitor',
            message: 'Toilet is ' + status,
            time: 1000
        });
    };

    var pollData = function () {
        request('http://52.62.29.150:8080/ts/1', function (error, response, body) {
            if (!error && response.statusCode === 200) {
                var status = transformStatusFlagToStatusText(JSON.parse(body).occupied);

                if (currentStatus !== status) {
                    currentStatus = status;
                    notifyStatus(status);
                    updateMenuByStatus(status);
                }
            } else {
                console.error('There is something fishy here......');
            }
        });
    };

    var updateMenuByStatus = function (status) {
        tray.setImage(status + '.png');
        tray.setContextMenu(Menu.buildFromTemplate([
            {
                label: 'Aconex Toilet Monitor',
                enabled: false
            },
            {
                label: 'Status:       ' + status
            },
            {
                label: 'Quit',
                click: function () {
                    app.quit();
                }
            }
        ]));
    };

    tray.setToolTip('Aconex Toilet Monitor');

    updateMenuByStatus(currentStatus);
    setInterval(pollData, 1000);
});
