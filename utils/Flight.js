const Passengers = require('../Passengers');


module.exports = class Flight {
    constructor(generalFlightObj) {
        var _self = this;
        this.trip = generalFlightObj.trip;
        this.service = generalFlightObj.service || undefined;
        this.aircompany = generalFlightObj.aircompany || undefined;

        var passengers = new Passengers();

        // Generate data for each passenger
        generalFlightObj.passengers.forEach(function (pasengerData) {
            passengers.add(pasengerData);
        });

        // Set payer
        passengers.passengers.forEach(function (passenger) {
            if (passenger.type == 'ADT') {
                passengers.passengers.payer_name = passenger.firstname + passenger.middlename;
                passengers.passengers.payer_phone = passenger.payer_phone;
                passengers.passengers.payer_email = passenger.payer_email;
            }
        });

        // Set the parent for kids
        passengers.setParent();

        // Rename passengers with equal names
        renameDuplicatePassengers(passengers.passengers);

        this.passengers = passengers.passengers;

        // Count number of adults, children, infants etc.
        this.adt = 0;
        this.chd = 0;
        this.inf = 0;
        this.passengers.forEach(function (passenger) {
            switch (passenger.type) {
                case 'ADT':
                    _self.adt++;
                    break;
                case 'CHD':
                    _self.chd++;
                    break;
                case 'INF':
                    _self.inf++;
                    break;
                default:
                    break;
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
EXAMPLE OF FLIGHT OBJECT
generalFlightObject = {
    trip: {
        departure: "MOW",
        departureCity: "Москва",
        arrival: "SIP",
        arrivalCity: "Симферополь",
        date: new Date(),
        returnDate: new Date()
    },
    service: 'A',
    aircompany: "SU",
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
    ]
};
*/