var Tools = require('./Tools.js');
var Passengers = require('./Passengers.js');


module.exports = function (info) {
    var input = info || undefined;
    var key;
    if (input !== undefined) {
        this.voyages = input.voyages;
        this.passengers = input.passengers;
        this.filghtPassengers = [];
        this.searchInput = {};
        this.daysBeforeFlight = 0;
        var _self = this;
        key = input.key || "4697ebff-468d-30ab-068a-e9b004fe233d"; // HARDCODE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    } else {
        key = "4697ebff-468d-30ab-068a-e9b004fe233d"; // HARDCODE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    }


    // generate input for search
    this.generateSearchInput = function () {
        var adt = 0;
        var chd = 0;
        var inf = 0;
        var total = 0;
        var service_classes = ['A', 'E', 'E', 'E', 'E', 'E', 'B'];

        _self.passengers.forEach(function (pasenger) {
            if (pasenger.type == 'ADT') {
                adt++;
            }
            if (pasenger.type == 'CHD') {
                chd++;
            }
            if (pasenger.type == 'INF') {
                inf++;
            }
            total++;
        });

        _self.searchInput.key = key;
        _self.searchInput.adt = adt;
        _self.searchInput.chd = chd;
        _self.searchInput.inf = inf;
        _self.searchInput.count = "0"; // HARDCODE
        _self.searchInput.lang = "ru"; // HARDCODE

        if (input.service_class === undefined) {
            _self.searchInput.service_class = Tools.randomFromArray(service_classes);
        } else {
            _self.searchInput.service_class = input.service_class;
        }

        var voyageCounter = 0;
        _self.voyages.forEach(function (voyage) {
            _self.searchInput['destinations[' + voyageCounter + '][departure]'] = voyage.departure;
            _self.searchInput['destinations[' + voyageCounter + '][arrival]'] = voyage.arrival;
            if (voyage.date === undefined) {
                _self.daysBeforeFlight = Tools.randomInt(60, 80);
                var randomDate = new Date();
                randomDate.setDate(_self.daysBeforeFlight);
                // _self.searchInput['rawdate'] = randomDate;
                _self.searchInput['destinations[' + voyageCounter + '][date]'] = randomDate;
            } else {
                _self.searchInput['destinations[' + voyageCounter + '][date]'] = voyage.date;
            }
            voyageCounter++;
        });
    };

    /**
     * searchs for duplicate passengers and return index of the passenger if found or returns "0"
     */
    this.findDuplicatePassengers = function (PeopleArray) {
        var n = PeopleArray.length,
            jIndex;
        for (var i = 0; i < n - 1; i++) {
            for (var j = i + 1; j < n; j++) {
                if (PeopleArray[i].imya === PeopleArray[j].imya &&
                    PeopleArray[i].familiya === PeopleArray[j].familiya) {
                    return 0;
                }
                jIndex = j;
            }
        }
        return jIndex;
    };

    /**
     * rename duplicate passenger and call a method for checking all passengers
     */
    this.renameDuplicatePassengers = function (PeopleArray) {
        var passengers = new Passengers();
        for (var i = 0; i <= PeopleArray.length; i++) {
            var index = this.findDuplicatePassengers(PeopleArray);
            if (index !== 0) {
                continue;
            } else {
                PeopleArray[index] = passengers.newName(PeopleArray[index]);
                this.renameDuplicatePassengers(PeopleArray);
            }
        }
    };

    this.generateTripPassengers = function (generalTripObject) {
        var passengers = new Passengers();

        generalTripObject.passengers.forEach(function (pasengerData) {
            passengers.add(pasengerData);
        });

        // rename passengers with equal names
        this.renameDuplicatePassengers(passengers.passengers);

        // set the parent for kids
        passengers.setParent();

        passengers.passengers.forEach(function (passenger) {
            if (passenger.payer_name !== undefined) {
                passengers.passengers.payer_name = passenger.firstname + passenger.middlename;
                passengers.passengers.payer_phone = passenger.payer_phone;
                passengers.passengers.payer_email = passenger.payer_email;
            }
        });

        return passengers.passengers;
    };
};


// generalTripObject = {
//     trip: {
//         departureCity: "Москва", //required
//         arrivalCity: "Симферополь", //required
//         date: new Date(),  //required
//         serviceClass: ""
//     },
//     passengers: [
//         {
//             "place":"UP", // down, sit 
//             "type": "ADT", //required
//             "citizenship": "ru", //required
//             "grazhdanstvo": "Россия",
//             "doctype": 'PS', //required
//             "docnum": '345635643',
//             "doc_expire_date": null,
//             "gender": 'm',
//             "firstname": 'Ivan',
//             "lastname": 'Mironov',
//             "middlename": 'Petrovich',
//             "imya": 'Иван',
//             "otchestvo": 'Петрович',
//             "familiya": 'Миронов',
//             "phone": '+79788410185',
//             "email": 'ivanmiron_92@bilet-on-line.ru'
//         },
//         {
//             "place":"UP", // down, sit 
//             "type": "CHD",
//             "citizenship": "ru",
//             "grazhdanstvo": "Россия",
//             "doctype": 'SR',
//             "docnum": '62456245',
//             "doc_expire_date": null,
//             "gender": 'm',
//             "firstname": 'Aleksey',
//             "lastname": 'Mironov',
//             "middlename": 'Ivanovich',
//             "imya": 'Алексей',
//             "otchestvo": 'Иванович',
//             "familiya": 'Миронов',
//             "phone": '+79788410185',
//             "email": 'ivanmiron_92@bilet-on-line.ru'
//         }
//     ],
//     aircompany: "SU",
//     gds_id: 9
// };
