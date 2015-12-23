var WebSocket = require('ws');

var baseUrl = "ws://52.62.29.150:8080";

var transformDataToStatusText = function (data) {
    return JSON.parse(data).occupied ? 'occupied' : 'vacant';
};

var atmService = {
    subscribe: function (level, gender, slotId, cb) {
        var connect = function () {
            var ws = new WebSocket(baseUrl + '/level/' + level + '/room/' + gender + '/slot/' + slotId + '/subscribe');
            ws.on('open', function () {
                console.log('Connected!');
            });

            ws.on('message', function (data) {
                cb(null, transformDataToStatusText(data));
            });

            ws.on('close', function () {
                console.log('socket close');
                setTimeout(connect, 10000);
            });
        };

        setTimeout(connect, 500);
    }
};

module.exports = atmService;