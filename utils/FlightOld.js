const dateformat = require('dateformat');
const Tools = require('../Tools');
const Passengers = require('../Passengers');


module.exports = class Flight {
    constructor(generalFlightObj) {
        // generalFlightObj.oneway
        // generalFlightObj.return
        // generalFlightObj.service
        // generalFlightObj.passengers
        // generalFlightObj.key
        this.flightData = generalFlightObj;
        if (this.flightData.key === undefined) {
            this.flightData.key = "4697ebff-468d-30ab-068a-e9b004fe233d"; // HARDCODE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        }
        // this.passengers = input.passengers;
        // this.filghtPassengers = [];
        this.daysBeforeFlight = 0;
    }

    generateFlightPassengers() {
        var passengers = new Passengers();

        this.flightData.passengers.forEach(function (pasengerData) {
            passengers.add(pasengerData);
        });

        passengers.passengers.forEach(function (passenger) {
            if (passenger.payer_name !== undefined) {
                passengers.passengers.payer_name = passenger.firstname + passenger.middlename;
                passengers.passengers.payer_phone = passenger.payer_phone;
                passengers.passengers.payer_email = passenger.payer_email;
            }
        });

        // set the parent for kids
        passengers.setParent();

        // rename passengers with equal names
        renameDuplicatePassengers(passengers.passengers);

        this.flightData.passengers = passengers.passengers;
    }

    generateSearchInput() {
        this.searchInput = {};
        var _self = this;
        var voyages = [this.flightData.oneway, this.flightData.return];
        var adt = 0;
        var chd = 0;
        var inf = 0;
        var total = 0;
        var service_classes = ['A', 'E', 'E', 'E', 'E', 'E', 'B'];

        this.flightData.passengers.forEach(function (pasenger) {
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

        this.searchInput.key = this.flightData.key;
        this.searchInput.adt = adt;
        this.searchInput.chd = chd;
        this.searchInput.inf = inf;
        this.searchInput.count = "0"; // HARDCODE
        this.searchInput.lang = "ru"; // HARDCODE

        if (this.flightData.service === undefined) {
            this.searchInput.service_class = Tools.randomFromArray(service_classes);
        } else {
            this.searchInput.service_class = this.flightData.service;
        }

        var voyageCounter = 0;
        voyages.forEach(function (voyage) {
            if (voyage !== undefined) {
                _self.searchInput['destinations[' + voyageCounter + '][departure]'] = voyage.departure;
                _self.searchInput['destinations[' + voyageCounter + '][arrival]'] = voyage.arrival;
                if (voyage.date === undefined) {
                    // FIXME: return date should depends from forward date
                    _self.daysBeforeFlight = Tools.randomInt(60, 80);
                    var randomDate = new Date();
                    randomDate.setDate(this.daysBeforeFlight);
                    // _self.searchInput['rawdate'] = randomDate;
                    _self.searchInput['destinations[' + voyageCounter + '][date]'] = dateformat(randomDate, 'dd-mm-yyyy');
                } else {
                    _self.searchInput['destinations[' + voyageCounter + '][date]'] = dateformat(voyage.date, 'dd-mm-yyyy');
                }
                voyageCounter++;
            }
        });
    }
};

var renameDuplicatePassengers = function (PeopleArray) {
    var passengers = new Passengers();
    for (var i = 0; i <= PeopleArray.length; i++) {
        var index = findDuplicatePassengers(PeopleArray);
        if (index !== 0) {
            continue;
        } else {
            PeopleArray[index] = passengers.newName(PeopleArray[index]);
            renameDuplicatePassengers(PeopleArray);
        }
    }
};

var findDuplicatePassengers = function (PeopleArray) {
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

/*
generalFlightObject = {
    oneway: {
        departure: "MOW",
        departureCity: "Москва",
        arrival: "LED",
        arrivalCity: "Симферополь",
        date: new Date()
    },
    return: {
        departure: "MOW",
        departureCity: "Москва",
        arrival: "LED",
        arrivalCity: "Симферополь",
        date: new Date()
    },
    passengers: [
        {
            "type": "ADT",
            "citizenship": "ru",
            "grazhdanstvo": "Россия",
            "doctype": 'PS',
            "docnum": '345635643',
            "doc_expire_date": null,
            "gender": 'm',
            "firstname": 'Ivan',
            "lastname": 'Mironov',
            "middlename": 'Petrovich',
            "imya": 'Иван',
            "otchestvo": 'Петрович',
            "familiya": 'Миронов',
            "phone": '+79788410185',
            "email": 'ivanmiron_92@bilet-on-line.ru'
        },
        {
            "type": "CHD",
            "citizenship": "ru",
            "grazhdanstvo": "Россия",
            "doctype": 'SR',
            "docnum": '62456245',
            "doc_expire_date": null,
            "gender": 'm',
            "firstname": 'Aleksey',
            "lastname": 'Mironov',
            "middlename": 'Ivanovich',
            "imya": 'Алексей',
            "otchestvo": 'Иванович',
            "familiya": 'Миронов',
            "phone": '+79788410185',
            "email": 'ivanmiron_92@bilet-on-line.ru'
        }
    ],
    aircompany: "SU",
    gds_id: 9
};
*/