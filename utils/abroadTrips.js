var mysql = require('mysql');
var Kibana = require('./Kibana');

class abroadTrips {

    static getConnection() {
        var connection = mysql.createConnection({
            host: '89.175.169.168',
            user: 'aviakassa',
            password: 'aviakassa',
            database: 'aviakassa'
        });
        return connection;
    }

    getCityCountry(departure, arrival) {
        var connection = abroadTrips.getConnection();
        return new Promise(function (resolve, reject) {
            connection.query(`SELECT airport_country FROM sabre_airports_short WHERE airport_iata in ("${departure}","${arrival}")`, function (err, result) {
                if (err) {
                    connection.end();
                    reject(err);
                } else {
                    connection.end();
                    resolve(result);
                }
            });
        });
    }

    /**
     * 
     * @param {int} tripCount 
     */
    getCorrectTrips(tripCount) {
        var correctArr = [];
        var _self = this;
        var trips = Kibana.formatTripList(Kibana.getTopListSync(tripCount));
        return new Promise(function (resolve) {
            trips.forEach(function (trip, i) {
                var oneway = trip.split('|');
                oneway = oneway[0].split('-');
                _self.getCityCountry(oneway[0], oneway[1])
                    .then(function (countries) {
                        if (countries[0].airport_country !== 'RU' || countries[1].airport_country !== 'RU') {
                            correctArr.push(trip);
                            if (i >= trips.length - 1) {
                                resolve(correctArr);
                            }
                        } else {
                            if (i >= trips.length - 1) {
                                resolve(correctArr);
                            }
                        }
                    });
            });
        });
    }

}

var a = new abroadTrips();
a.getCorrectTrips(150)
    .then(function (arr) {
        console.log(arr)
    });