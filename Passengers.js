var fs = require('fs');
var moment = require('moment');
var dateFormat = require('dateformat');
var Tools = require('./Tools');


module.exports = class Passengers {
    constructor() {
        this.passengers = [];

        this.gender = ['M', 'F', 'M', 'F', 'M', 'F', 'M', 'F', 'M', 'F'];

        // MEN 
        this.menFirstName = {
            // RU: ['Дмитрий', 'Константин', 'Андрей', 'Вадим', 'Михаил', 'Анатолий', 'Валерий', 'Владимир', 'Иван', 'Сергей', 'Александр', 'Василий', 'Петр', 'Максим', 'Виктор', 'Виталий', 'Геннадий', 'Алексей', 'Денис', 'Николай'],
            RU: fs.readFileSync('./dictionaries/man_ru.txt').toString().split("\n"),
            UZ: ['Абдулла', 'Арслан', 'Батыр', 'Искандер', 'Каримм', 'Маджид', 'Рустам', 'Тахир', 'Темир', 'Турдым', 'Ульмас', 'Урман', 'Фархад', 'Юсуф'],
            TJ: ['Абдулла', 'Арслан', 'Батыр', 'Искандер', 'Каримм', 'Маджид', 'Рустам', 'Тахир', 'Темир', 'Турдым', 'Ульмас', 'Урман', 'Фархад', 'Юсуф'],
            KG: ['Абдулла', 'Арслан', 'Батыр', 'Искандер', 'Каримм', 'Маджид', 'Рустам', 'Тахир', 'Темир', 'Турдым', 'Ульмас', 'Урман', 'Фархад', 'Юсуф'],
        };

        this.menMiddleName = {
            RU: ['Дмитриевич', 'Константинович', 'Андреевич', 'Вадимович', 'Михайлович', 'Анатольевич', 'Валериевич', 'Владимирович', 'Иванович', 'Сергеевич', 'Александрович', 'Васильевич', 'Петрович', 'Максимович', 'Викторович', 'Виталиевич', 'Геннадиевич', 'Алексеевич', 'Денисович', 'Николаевич'],
            UZ: ['Арсланович', 'Батырович', 'Искандерович', 'Кариммович', 'Маджидович', 'Рустамович', 'Тахирович', 'Темирович', 'Турдымович', 'Ульмасович', 'Урманович', 'Фархадович', 'Юсуфович'],
            TJ: ['Арсланович', 'Батырович', 'Искандерович', 'Кариммович', 'Маджидович', 'Рустамович', 'Тахирович', 'Темирович', 'Турдымович', 'Ульмасович', 'Урманович', 'Фархадович', 'Юсуфович'],
            KG: ['Арсланович', 'Батырович', 'Искандерович', 'Кариммович', 'Маджидович', 'Рустамович', 'Тахирович', 'Темирович', 'Турдымович', 'Ульмасович', 'Урманович', 'Фархадович', 'Юсуфович'],
        };

        this.menLastName = {
            RU: ['Соболев', 'Смирнов', 'Иванов', 'Петров', 'Сидоров', 'Кузнецов', 'Соколов', 'Лебедев', 'Козлов', 'Новиков', 'Волков', 'Антонов', 'Белов', 'Баранов', 'Беляков', 'Архипов', 'Быков', 'Васильев', 'Герасимов', 'Дорофеев', 'Жданов', 'Зайцев', 'Исаев', 'Карпов', 'Макаров', 'Пахомов', 'Самойлов', 'Фёдоров', 'Цветков'],
            UZ: ['Угланов', 'Алымов', 'Наркисов', 'Рашидов', 'Саидов', 'Абдурахманов', 'Ниязов', 'Юсупов', 'Мухамеджанов', 'Акрамов', 'Ниязметов'],
            TJ: ['Угланов', 'Алымов', 'Наркисов', 'Рашидов', 'Саидов', 'Абдурахманов', 'Ниязов', 'Юсупов', 'Мухамеджанов', 'Акрамов', 'Ниязметов'],
            KG: ['Угланов', 'Алымов', 'Наркисов', 'Рашидов', 'Саидов', 'Абдурахманов', 'Ниязов', 'Юсупов', 'Мухамеджанов', 'Акрамов', 'Ниязметов'],
        };

        // WOMEN 
        this.womenFirstName = {
            // RU: ['Анастасия', 'Мария', 'Анна', 'Светлана', 'Татьяна', 'Елизавета', 'Алевтина', 'Марина', 'Елена', 'Александра', 'Ольга', 'Ирина', 'Альбина', 'Ксения', 'Вера', 'Надежда', 'Любовь', 'Галина', 'Диана', 'Евгения', 'Инна', 'Лилия', 'Наталья', 'София', 'Тамара', 'Валентина', 'Эльвира'],
            RU: fs.readFileSync('./dictionaries/woman_ru.txt').toString().split("\n"),
            UZ: ['Асмира', 'Гульнара', 'Динора', 'Зилола', 'Нилуфар', 'Фархунда', 'Дильбар', 'Зухра', 'Интизора', 'Нафиса', 'Нигора', 'Олма', 'Нилуфар'],
            TJ: ['Асмира', 'Гульнара', 'Динора', 'Зилола', 'Нилуфар', 'Фархунда', 'Дильбар', 'Зухра', 'Интизора', 'Нафиса', 'Нигора', 'Олма', 'Нилуфар'],
            KG: ['Асмира', 'Гульнара', 'Динора', 'Зилола', 'Нилуфар', 'Фархунда', 'Дильбар', 'Зухра', 'Интизора', 'Нафиса', 'Нигора', 'Олма', 'Нилуфар'],
        };

        this.womenMiddleName = {
            RU: ['Дмитриевна', 'Константиновна', 'Андреевна', 'Вадимовна', 'Михайловна', 'Анатольевна', 'Валерьевна', 'Владимировна', 'Ивановна', 'Сергеевна', 'Александровна', 'Васильевна', 'Петровна', 'Максимовна', 'Викторовна', 'Витальевна', 'Геннадьевна', 'Алексеевна', 'Денисовна', 'Николаевна'],
            UZ: ['Арслановна', 'Батыровна', 'Искандеровна', 'Кариммовна', 'Маджидовна', 'Рустамовна', 'Тахировнач', 'Темировна', 'Турдымовна', 'Ульмасовна', 'Урмановна', 'Фархадовна', 'Юсуфовна'],
            TJ: ['Арслановна', 'Батыровна', 'Искандеровна', 'Кариммовна', 'Маджидовна', 'Рустамовна', 'Тахировнач', 'Темировна', 'Турдымовна', 'Ульмасовна', 'Урмановна', 'Фархадовна', 'Юсуфовна'],
            KG: ['Арслановна', 'Батыровна', 'Искандеровна', 'Кариммовна', 'Маджидовна', 'Рустамовна', 'Тахировнач', 'Темировна', 'Турдымовна', 'Ульмасовна', 'Урмановна', 'Фархадовна', 'Юсуфовна'],
        };

        this.womenLastName = {
            RU: ['Соболева', 'Смирнова', 'Иванова', 'Петрова', 'Сидорова', 'Кузнецова', 'Соколова', 'Лебедева', 'Козлова', 'Новикова', 'Волкова', 'Антонова', 'Белова', 'Баранова', 'Белякова', 'Архипова', 'Быкова', 'Васильева', 'Герасимова', 'Дорофеева', 'Жданова', 'Зайцева', 'Исаева', 'Карпова', 'Макарова', 'Пахомова', 'Самойлова', 'Фёдорова', 'Цветкова'],
            UZ: ['Угланова', 'Алымова', 'Наркисова', 'Рашидова', 'Саидова', 'Абдурахманова', 'Ниязова', 'Юсупова', 'Мухамеджанова', 'Акрамова', 'Ниязметова'],
            TJ: ['Угланова', 'Алымова', 'Наркисова', 'Рашидова', 'Саидова', 'Абдурахманова', 'Ниязова', 'Юсупова', 'Мухамеджанова', 'Акрамова', 'Ниязметова'],
            KG: ['Угланова', 'Алымова', 'Наркисова', 'Рашидова', 'Саидова', 'Абдурахманова', 'Ниязова', 'Юсупова', 'Мухамеджанова', 'Акрамова', 'Ниязметова'],
        };

        this.mobileOperators = ['925', '926', '985', '964', '963', '495', '916', '915', '906', '905', '977', '903'];
        this.emailServises = ['mail.bilet-on-line.ru', 'delivery.bilet-on-line.ru', 'tickets.bilet-on-line.ru', 'orders.bilet-on-line.ru', 'avia.bilet-on-line.ru'];

        this.pasportCityCode = ['45', '46', '40', '45', '46', '40', '45', '46', '40'];
        this.pasportYear = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '00', '01', '02', '03', '04', '05', '06', '07', '08', '09'];
        this.rusZagranCode = ['53', '60', '61', '62', '63', '64', '70', '71', '72'];
        this.latinForSR = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
        this.cyrillicForSR = ['АА', 'АК', 'КО', 'ТИ', 'ПО', 'РО', 'АА', 'АК', 'КО', 'ТИ', 'ПО', 'РО'];
    }

    newName(passenger) {
        var oldname = passenger.imya;
        while (oldname == passenger.imya) {
            var firstname = undefined;
            if (passenger.gender == 'M') {
                firstname = Tools.randomFromArray(this.menFirstName[passenger.citizenship]);
            } else {
                firstname = Tools.randomFromArray(this.womenFirstName[passenger.citizenship]);
            }
            passenger.imya = firstname;
            passenger.firstname = Tools.translit(firstname);
        }
        return passenger;
    }

    add(inputPassenger) {
        var now = new Date();
        var passenger = {};

        passenger.type = inputPassenger.type;
        passenger.citizenship = inputPassenger.citizenship.toUpperCase();
        passenger.grazhdanstvo = inputPassenger.grazhdanstvo;
        passenger.doctype = inputPassenger.doctype;

        // citizen RU, UZ, TJ, KG 

        // PASSENGER CREATION 
        passenger.gender = Tools.randomFromArray(this.gender);

        var firstname = '', lastname = '', middlename = '';
        if (passenger.gender == 'M') {
            firstname = Tools.randomFromArray(this.menFirstName[passenger.citizenship]);
            middlename = Tools.randomFromArray(this.menMiddleName[passenger.citizenship]);
            lastname = Tools.randomFromArray(this.menLastName[passenger.citizenship]);
        } else {
            firstname = Tools.randomFromArray(this.womenFirstName[passenger.citizenship]);
            middlename = Tools.randomFromArray(this.womenMiddleName[passenger.citizenship]);
            lastname = Tools.randomFromArray(this.womenLastName[passenger.citizenship]);
        }
        passenger.firstname = Tools.translit(firstname);
        passenger.imya = firstname;
        passenger.middlename = Tools.translit(middlename);
        passenger.otchestvo = middlename;
        passenger.lastname = Tools.translit(lastname);
        passenger.familiya = lastname;

        // infant: 0-2, child:2-12, adult:12+ (but with PASSPORT only after 14)
        switch (passenger.type) {
            case 'ADT':
                let adultBirthday = now;
                adultBirthday.setYear(adultBirthday.getFullYear() - Tools.randomInt(14, 40));
                adultBirthday.setDate(adultBirthday.getDate() - Tools.randomInt(1, 20));
                passenger.birthdate = adultBirthday;
                passenger.birthday = dateFormat(adultBirthday, 'dd-mm-yyyy');
                passenger.age = moment.duration(new Date() - passenger.birthdate).years();
                break;
            case 'ADT16+':
                passenger.type = 'ADT';
                let adult16Birthday = now;
                adult16Birthday.setYear(adult16Birthday.getFullYear() - Tools.randomInt(16, 40));
                adult16Birthday.setDate(adult16Birthday.getDate() - Tools.randomInt(1, 20));
                passenger.birthdate = adult16Birthday;
                passenger.birthday = dateFormat(adult16Birthday, 'dd-mm-yyyy');
                passenger.age = moment.duration(new Date() - passenger.birthdate).years();
                break;
            case 'CHD':
                var childBirthday = now;
                childBirthday.setYear(childBirthday.getFullYear() - Tools.randomInt(2, 12));
                childBirthday.setDate(childBirthday.getDate() - Tools.randomInt(1, 20));
                passenger.birthdate = childBirthday;
                passenger.birthday = dateFormat(childBirthday, 'dd-mm-yyyy');
                passenger.age = moment.duration(new Date() - passenger.birthdate).years();
                break;
            case 'INF':
                var infantBirthday = now;
                infantBirthday.setYear(infantBirthday.getFullYear() - Tools.randomInt(1, 2));
                infantBirthday.setDate(infantBirthday.getDate() - Tools.randomInt(1, 20));
                passenger.birthdate = infantBirthday;
                passenger.birthday = dateFormat(infantBirthday, 'dd-mm-yyyy');
                passenger.age = moment.duration(new Date() - passenger.birthdate).years();
                break;
            default:
                break;
        }

        switch (passenger.doctype) {
            // паспорт
            case 'PS':
                passenger.docnum = Tools.randomFromArray(this.pasportCityCode) + Tools.randomFromArray(this.pasportYear) + Tools.zeroPad(Tools.randomInt(6553, 999990), 6);
                break;
            // паспорт
            case 'C':
                passenger.docnum = Tools.randomFromArray(this.pasportCityCode) + Tools.randomFromArray(this.pasportYear) + Tools.zeroPad(Tools.randomInt(6553, 999990), 6);
                break;
            // загранпаспорт
            case 'PSP':
                passenger.docnum = Tools.randomFromArray(this.rusZagranCode) + Tools.zeroPad(Tools.randomInt(8000000, 8999999), 7);
                break;
            case 'NP':
                passenger.docnum = 'AA' + Tools.zeroPad(Tools.randomInt(8000000, 8999999), 7);
                break;
            // св-во о рождении
            case 'SR':
                // passenger['docnum'] = Tools.randomFromArray(this.latinForSR) + Tools.translit(Tools.randomFromArray(this.cyrillicForSR)) + Tools.zeroPad(Tools.randomInt(500000, 599999), 6) 
                passenger.docnum = Tools.randomFromArray(this.latinForSR) + (Tools.randomFromArray(this.cyrillicForSR)) + Tools.zeroPad(Tools.randomInt(500000, 599999), 6);
                break;
            default:
                break;
        }

        var expDate = new Date();
        expDate.setDate(Tools.randomInt(1000, 3000));
        passenger.doc_expire_date = expDate;

        if (passenger.type == 'ADT') {
            passenger.payer_name = passenger.firstname;
            passenger.payer_phone = "+7" + Tools.randomFromArray(this.mobileOperators) + Tools.zeroPad(Tools.randomInt(2560, 6553600), 7);
            var mail = passenger.firstname.substring(0, 1) + Tools.randomFromArray(['', '-', '_', '.', '', '-', '_', '.', '', '-', '_', '.']) + passenger.lastname + Tools.randomFromArray(['', '-', '_', '.', '', '-', '_', '.', '', '-', '_', '.']) + passenger.birthday.substring(6, 10);
            passenger.payer_email = mail.replace("'", '').toLowerCase() + "@" + Tools.randomFromArray(this.emailServises);
        }

        this.passengers.push(passenger);
    }

    setParent() {
        var parent = this.passengers.find(function (passenger) {
            return passenger.type == 'ADT';
        });
        this.passengers.forEach(function (passenger) {
            if (passenger.type == 'CHD' || passenger.type == 'INF') {
                if (parent.gender == 'M') {
                    if (passenger.gender == 'M') {
                        passenger.otchestvo = parent.imya + 'ович';
                        passenger.familiya = parent.familiya;
                        passenger.lastname = parent.lastname;
                    } else {
                        passenger.otchestvo = parent.imya + 'овна';
                        passenger.familiya = parent.familiya + 'а';
                        passenger.lastname = parent.lastname + 'A';
                    }
                } else {
                    if (passenger.gender == 'M') {
                        passenger.lastname = parent.lastname.substring(0, parent.lastname.length - 1);
                        passenger.familiya = parent.familiya.substring(0, parent.familiya.length - 1);
                    } else {
                        passenger.lastname = parent.lastname;
                        passenger.familiya = parent.familiya;
                    }
                }
                passenger.middlename = Tools.translit(passenger.otchestvo);
            }
        });
    }
};