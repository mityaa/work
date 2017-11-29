const dgram = require('dgram');
const request = require('request');
const syncrequest = require('sync-request');
const ConfigParser = require('../ConfigParser');

class Kibana {
    static send(dataToSend) {
        return new Promise(function (resolve, reject) {
            var client = dgram.createSocket('udp4');
            var PORT = ConfigParser.getProperties().kibana.port;
            var HOST = ConfigParser.getProperties().kibana.host;

            if (dataToSend.event === undefined) {
                dataToSend.event = 'test';
            }
            var message = new Buffer(JSON.stringify(dataToSend));

            client.send(message, 0, message.length, PORT, HOST, function (err) {
                if (err) {
                    console.log('Error while sending UDP message');
                    reject(err);
                } else {
                    console.log('UDP message sent');
                    resolve();
                }
                client.close();
            });
        });
    }

    static getTopList(listSize) {
        return new Promise(function (resolve, reject) {
            var url = ConfigParser.getProperties().kibana.url;
            var path = '/elasticsearch/logstash-*/_search/?';
            var params = `size=${listSize}&sort=@timestamp:desc&q=event:meta_avia%20AND%20event_type:request%20AND%20@timestamp:[now-1h%20TO%20now]`;

            var username = 'avia',
                password = 'kibana4avia',
                urll = 'https://' + username + ':' + password + '@' + url + path + params;

            request({ url: urll }, function (error, response, body) {
                if (error) reject(error);
                var trips = [];
                JSON.parse(body).hits.hits.forEach(function (hit) {
                    trips.push([hit._source.direction, hit._source.flight_type]);
                });
                resolve(trips);
            });
        });
    }

    static getTopListSync(listSize) {
        var url = ConfigParser.getProperties().kibana.url;
        var path = '/elasticsearch/logstash-*/_search/?';
        var params = `size=${listSize}&sort=@timestamp:desc&q=event:meta_avia%20AND%20event_type:request%20AND%20@timestamp:[now-1h%20TO%20now]`;

        var username = 'avia',
            password = 'kibana4avia',
            urll = 'https://' + username + ':' + password + '@' + url + path + params;

        var res = syncrequest('GET', urll);
        var trips = [];
        JSON.parse(res.getBody()).hits.hits.forEach(function (hit) {
            trips.push([hit._source.direction, hit._source.flight_type]);
        });

        return trips;
    }

    /**
     * 
     * @param {array} trips - [ [ 'TASKZN', 'RT' ], [ 'TASKZN', 'RT' ] ]
     */
    static formatTripList(trips) {
        var tripsArray = [];
        trips.forEach(function (trip) {
            if (trip[1] == 'RT') {
                tripsArray.push(`${trip[0].slice(0, 3)}-${trip[0].slice(3, 6)}|${trip[0].slice(3, 6)}-${trip[0].slice(0, 3)}`);
            } else {
                tripsArray.push(`${trip[0].slice(0, 3)}-${trip[0].slice(3, 6)}`);
            }
        });
        return tripsArray;
    }

    static getAircompanyTrip(aircompany) {
        var url = ConfigParser.getProperties().kibana.url;
        var path = '/elasticsearch/logstash-*/_search/?';
        var params = `size=1&sort=@timestamp:desc&q=event:third_page_request AND validating_supplier_code:${aircompany} AND @timestamp:[now-36h TO now]`;
        var username = 'avia',
            password = 'kibana4avia',
            urll = 'https://' + username + ':' + password + '@' + url + path + params;
        var res = syncrequest('GET', urll);
        if (JSON.parse(res.getBody()).hits.hits[0] !== undefined) {
            return [[JSON.parse(res.getBody()).hits.hits[0]._source.direction, JSON.parse(res.getBody()).hits.hits[0]._source.flight_type]];
        } else {
            console.log('В кибане не были найдены перелеты по авиакомпании - ' + aircompany);
        }
    }

    /**
     * 
     * @param {Array} trip - e.g. [ 'LEDMOW', 'OW' ]
     */
    static parseSingleTrip(trip) {
        return {
            departure: trip[0].slice(0, 3),
            arrival: trip[0].slice(3, 6),
            type: trip[1]
        };
    }
}

module.exports = Kibana;