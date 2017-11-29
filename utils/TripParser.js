var fs = require('fs');
var parse = require('csv-parse/lib/sync');
var Tools = require('../Tools');

module.exports = class TripParser {

    constructor(file) {
        this.csvFile = file;
    }

/**
 * Возврат направлений из файла 
 */
    getRandomTrip() {
        var csv = parse(fs.readFileSync(this.csvFile, 'utf8'), { delimiter: ';' });
        var trip = Tools.randomFromArray(csv);

        // BOOKDATE
        var bookDate = Tools.randomDateForward(7, 14);
        var owdep, owarr, rtdep, rtarr;
        var voyages = {};

        var ow = trip.toString().split("|")[0];
        var rt = trip.toString().split("|")[1];
        if (ow !== undefined) {
            var forwardBookDate = new Date(bookDate);
            owdep = ow.split("-")[0];
            owarr = ow.split("-")[1];
            voyages.oneway = {
                departure: owdep,
                arrival: owarr,
                date: forwardBookDate,
            };
        }
        if (rt !== undefined) {
            var backBookDate = new Date(bookDate);
            backBookDate.setDate(bookDate.getDate() + Tools.randomInt(1, 7));
            rtdep = rt.split("-")[0];
            rtarr = rt.split("-")[1];
            voyages.return = {
                departure: rtdep,
                arrival: rtarr,
                date: backBookDate,
            };
        }
        return voyages;
    }
    
};
