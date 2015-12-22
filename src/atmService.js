var request = require('request');
var WebSocket = require('ws');

var baseUrl = "52.62.29.150:8080/ts";

var transformDataToStatusText = function (data) {
    return JSON.parse(data).occupied ? 'occupied' : 'vacant';
};

var atmService = {
    getStatus: function(id, cb) {
        request('http://' + baseUrl + "/" + id, function (error, response, data) {
            if (error || response.statusCode !== 200) {
                cb(error, null);
            }

            cb(null, transformDataToStatusText(data));
        })
    },

    subscribe: function(id, cb) {
        var ws = new WebSocket('ws://' + baseUrl + '/' + id + '/subscribe');

        setTimeout(function() {
            ws.on('open', function() {
                console.log('Connected!');
            });

            ws.on('message', function(data, flags) {
                if (!JSON.parse(data).hasOwnProperty('message')) {
                    cb(null, transformDataToStatusText(data));
                }
            });

        }, 500);
    }
};

module.exports = atmService;