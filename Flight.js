var dateFormat = require('dateformat');
var Tools = require('./Tools.js');
var Passengers = require('./Passengers.js');


module.exports = class Fligth {
    constructor(inputData) {
        this.input = inputData || undefined;
        if (this.input !== undefined) {
            this.voyages = this.input.voyages;
            this.passengers = this.input.passengers;
            this.filghtPassengers = [];
            this.searchInput = {};
            this.daysBeforeFlight = 0;
            this.key = this.input.key || "4697ebff-468d-30ab-068a-e9b004fe233d"; // HARDCODE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        } else {
            this.key = "4697ebff-468d-30ab-068a-e9b004fe233d"; // HARDCODE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        }
    }

    /**
     * generate input for search
     */
    generateSearchInput() {
        var _self = this;
        var input = this.input;
        var key = this.key;
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
        if (!_self.voyages) {
            _self.voyages = [];
            _self.voyages.push(_self.input.oneway);
            if (_self.input.return) {
                _self.voyages.push(_self.input.return);
            }
        }
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
    }

    /**
     * searchs for duplicate passengers and return index of the passenger if found or returns "0"
     */
    findDuplicatePassengers(PeopleArray) {
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
    }

    /**
     * rename duplicate passenger and call a method for checking all passengers
     */
    renameDuplicatePassengers(PeopleArray) {
        var _self = this;
        var passengers = new Passengers();
        for (var i = 0; i <= PeopleArray.length; i++) {
            var index = _self.findDuplicatePassengers(PeopleArray);
            if (index !== 0) {
                continue;
            } else {
                PeopleArray[index] = passengers.newName(PeopleArray[index]);
                _self.renameDuplicatePassengers(PeopleArray);
            }
        }
    }

    generatePassengers() {
        var _self = this;
        var input = this.input;
        var passengers = new Passengers();
        _self.passengers.forEach(function (pasengerData) {
            passengers.add(pasengerData);
        });

        // set the parent for kids
        passengers.setParent();

        // rename passengers with equal names
        this.renameDuplicatePassengers(passengers.passengers);

        var bookPassengers = [];
        var passengersCounter = 0;

        _self.filghtPassengers = passengers.passengers;

        passengers.passengers.forEach(function (passenger) {
            if (passenger.payer_name !== undefined) {
                bookPassengers.payer_name = passenger.firstname + passenger.middlename;
                bookPassengers.payer_phone = passenger.payer_phone;
                bookPassengers.payer_email = passenger.payer_email;
            }
            var parsedDate = passenger.birthday.split('-');
            var newBirthday = new Date(Date.parse(parsedDate[1] + '-' + parsedDate[0] + '-' + parsedDate[2]));
            newBirthday.setDate(_self.daysBeforeFlight);
            // console.log(passenger.birthday + ' -> ' + dateFormat(newBirthday, 'dd-mm-yyyy') + ' / ' + _self.daysBeforeFlight)
            bookPassengers["passengers[" + passengersCounter + "][birthday]"] = dateFormat(newBirthday, 'dd-mm-yyyy');
            var nomerdocum = passenger.docnum;

            if (input.gds_id != 4 && input.aircompany != 'WZ') {
                passenger.docnum = Tools.translit(passenger.docnum);
            }
            bookPassengers["passengers[" + passengersCounter + "][docnum]"] = passenger.docnum;
            bookPassengers["passengers[" + passengersCounter + "][nomerdocum]"] = nomerdocum;
            bookPassengers["passengers[" + passengersCounter + "][type]"] = passenger.type;
            bookPassengers["passengers[" + passengersCounter + "][firstname]"] = passenger.firstname + passenger.middlename;
            bookPassengers["passengers[" + passengersCounter + "][lastname]"] = passenger.lastname;
            bookPassengers["passengers[" + passengersCounter + "][gender]"] = passenger.gender;
            bookPassengers["passengers[" + passengersCounter + "][citizenship]"] = passenger.citizenship;
            bookPassengers["passengers[" + passengersCounter + "][doctype]"] = passenger.doctype;
            bookPassengers["passengers[" + passengersCounter + "][doc_expire_date]"] = dateFormat(passenger.doc_expire_date, 'dd-mm-yyyy');
            bookPassengers["passengers[" + passengersCounter + "][imya]"] = passenger.imya;
            bookPassengers["passengers[" + passengersCounter + "][familiya]"] = passenger.familiya;
            bookPassengers["passengers[" + passengersCounter + "][otchestvo]"] = passenger.otchestvo;
            bookPassengers["passengers[" + passengersCounter + "][fname]"] = passenger.firstname;
            bookPassengers["passengers[" + passengersCounter + "][lname]"] = passenger.lastname;
            bookPassengers["passengers[" + passengersCounter + "][mname]"] = passenger.middlename;
            passengersCounter++;
        });
        // console.log(bookPassengers)
        return bookPassengers;
    }

    generateFlightPassengers(generalFlightObject) {
        var passengers = new Passengers();

        generalFlightObject.passengers.forEach(function (pasengerData) {
            passengers.add(pasengerData);
        });

        passengers.passengers.forEach(function (passenger) {
            if (passenger.payer_name !== undefined) {
                passengers.passengers.payer_name = passenger.firstname + passenger.middlename;
                passengers.passengers.payer_phone = passenger.payer_phone;
                passengers.passengers.payer_email = passenger.payer_email;
            }
        });

        // rename passengers with equal names
        this.renameDuplicatePassengers(passengers.passengers);

        // set the parent for kids
        passengers.setParent();

        return passengers.passengers;
    }
};