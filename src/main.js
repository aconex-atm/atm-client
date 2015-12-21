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
    var tray;
    var transformStatusFlagToStatusText = function (isOccupied) {
        return isOccupied ? 'occupied' : 'vacant';
    };

    var currentStatus = transformStatusFlagToStatusText(false);

    var pollData = function () {
        request('http://52.62.29.150:8080/ts/1', function (error, response, body) {
            if (!error && response.statusCode === 200) {
                var status = transformStatusFlagToStatusText(JSON.parse(body).occupied);

                if (currentStatus !== status) {
                    currentStatus = status;
                    updateMenuByStatus(status);
                }
            } else {
                console.error('There is something fishy here......');
            }
        });
    };

    var getImageByStatus = function(status) {
        return __dirname + '/' + status + '.png';
    };

    var updateMenuByStatus = function (status) {
        tray.setImage(getImageByStatus(status));
        tray.setContextMenu(Menu.buildFromTemplate([
            {
                label: 'Aconex Toilet Monitor',
                enabled: false
            },
            {
                label: 'Status:       ' + status
            },
            {
                type: 'separator'
            },
            {
                label: 'Quit',
                click: function () {
                    app.quit();
                }
            }
        ]));
    };

    tray = new Tray(getImageByStatus(currentStatus));
    tray.setToolTip('Aconex Toilet Monitor');

    updateMenuByStatus(currentStatus);
    setInterval(pollData, 1000);
});
