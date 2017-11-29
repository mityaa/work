var Flight = require('./utils/Flight');


var flight = new Flight({
    trip: {
        departure: "MOW",
        departureCity: "Москва",
        arrival: "SIP",
        arrivalCity: "Симферополь",
        date: new Date(),
        returnDate: new Date()
    },
    passengers: [
        {
            "type": "ADT",
            "citizenship": "ru",
            "grazhdanstvo": "Россия",
            "doctype": 'PS'
        },
        {
            "type": "CHD",
            "citizenship": "ru",
            "grazhdanstvo": "Россия",
            "doctype": 'SR',
        }
    ]
});

console.log(flight);