'use strict';
var electron = require('electron');
var atmService = require('./atmService');

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
    var tray, currentStatus;

    var getImageByStatus = function (status) {
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

    var subscribe = function(level, gender, slotId) {
        atmService.subscribe(level, gender, slotId, function(error, status) {
            if (error) {
                console.log("something fishy here...");
            }

            if (currentStatus !== status) {
                currentStatus = status;
                updateMenuByStatus(status);
            }
        });
    };

    var init = function() {
        tray = new Tray(__dirname + '/icons/toilet-32x32.png');
        tray.setToolTip('Aconex Toilet Monitor');

        subscribe(4, "male", 1);
    };

    init();
});
