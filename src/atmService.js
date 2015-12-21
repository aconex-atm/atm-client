var request = require('request');

var baseUrl = "http://52.62.29.150:8080/ts";

var transformStatusFlagToStatusText = function (isOccupied) {
    return isOccupied ? 'occupied' : 'vacant';
};

var atmService = {
    getStatus: function(id, cb) {
        request(baseUrl + "/" + id, function (error, response, body) {
            if (error || response.statusCode !== 200) {
                cb(error, null);
            }

            cb(null, transformStatusFlagToStatusText(JSON.parse(body).occupied));
        })
    }
};

module.exports = atmService;