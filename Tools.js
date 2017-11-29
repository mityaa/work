// var extend = require('util')._extend;


// var Tools = function () { };
class Tools {
    static cloneObj(sourceObj) {
        return JSON.parse(JSON.stringify(sourceObj));
    }

    static formatApiErrorStack(string) {
        return string.replace(/\[90m/g, '').replace(/\[39m/g, '');
    }

    static randomInt(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    static randomFromArray(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    static randomDateForward(minDaysForward, maxDaysForward) {
        var date = new Date();
        date.setDate(date.getDate() + Tools.randomInt(minDaysForward, maxDaysForward));
        return date;
    }

    static zeroPad(num, places) {
        var zero = places - num.toString().length + 1;
        return Array(+(zero > 0 && zero)).join("0") + num;
    }

    static translit(str) {
        var newstr = '';
        var rus = ['А', 'а', 'Б', 'б', 'В', 'в', 'Г', 'г', 'Д', 'д', 'Е', 'е', 'Ё', 'ё', 'Ж', 'ж', 'З', 'з', 'И', 'и', 'Й', 'й', 'К', 'к', 'Л', 'л', 'М', 'м', 'Н', 'н', 'О', 'о', 'П', 'п', 'Р', 'р', 'С', 'с', 'Т', 'т', 'У', 'у', 'Ф', 'ф', 'Х', 'х', 'Ц', 'ц', 'Ч', 'ч', 'Ш', 'ш', 'Щ', 'щ', 'Ъ', 'ъ', 'Ы', 'ы', 'Ь', 'ь', 'Э', 'э', 'Ю', 'ю', 'Я', 'я'];
        var eng = ['A', 'a', 'B', 'b', 'V', 'v', 'G', 'g', 'D', 'd', 'E', 'e', 'E', 'e', 'Zh', 'zh', 'Z', 'z', 'I', 'i', 'J', 'j', 'K', 'k', 'L', 'l', 'M', 'm', 'N', 'n', 'O', 'o', 'P', 'p', 'R', 'r', 'S', 's', 'T', 't', 'U', 'u', 'F', 'f', 'H', 'h', 'C', 'c', 'Ch', 'ch', 'Sh', 'sh', 'Sch', 'sch', "", "", 'Y', 'y', "", "", 'E', 'e', 'Yu', 'yu', 'Ya', 'ya'];
        for (var i = 0, len = str.length; i < len; i++) {
            // console.log(rus.indexOf(str[i]))
            if (rus.indexOf(str[i]) != -1) {
                newstr = newstr + eng[rus.indexOf(str[i])].toUpperCase();
            } else {
                newstr = newstr + str[i].toUpperCase(); // protection from incorrect generation
            }
        }
        return newstr;
    }

    static getDoctype(doctype) {
        var documentType;
        switch (doctype) {
            case 'PS':
                documentType = 'Паспорт РФ';
                break;
            case 'PSP':
                documentType = 'Загран. паспорт';
                break;
            case 'SR':
                documentType = 'Свидетельство о рождении';
                break;
            default:
                documentType = undefined;
                break;
        }
        return documentType;
    }

    static getGrazhdanstvo(citizenship) {
        var grazhdanstvo;
        switch (citizenship) {
            case 'RU':
                grazhdanstvo = 'Россия';
                break;
            case 'UZ':
                grazhdanstvo = 'Узбекистан';
                break;
            case 'TJ':
                grazhdanstvo = 'Таджикистан';
                break;
            case 'KG':
                grazhdanstvo = 'Киргизия';
                break;
            default:
                grazhdanstvo = 'Россия';
                break;
        }
        return grazhdanstvo;
    }

    static runDriver(webdriver, browser) {
        browser = browser || 'chrome';
        var chromeCapabilities = webdriver.Capabilities.chrome();
        var chromeOptions = {
            'args': ['--disable-fill-on-account-select', '--no-sandbox']
        };
        chromeCapabilities.set('chromeOptions', chromeOptions);
        var driver = new webdriver.Builder()
            .forBrowser(browser)
            .withCapabilities(chromeCapabilities)
            .build();
        return driver;
    }
}

Tools.month = [
    { id: 1, en: "January", ru: "Январь" },
    { id: 2, en: "February", ru: "Февраль" },
    { id: 3, en: "March", ru: "Март" },
    { id: 4, en: "April", ru: "Апрель" },
    { id: 5, en: "May", ru: "Май" },
    { id: 6, en: "June", ru: "Июнь" },
    { id: 7, en: "July", ru: "Июль" },
    { id: 8, en: "August", ru: "Август" },
    { id: 9, en: "September", ru: "Сентябрь" },
    { id: 10, en: "October", ru: "Октябрь" },
    { id: 11, en: "November", ru: "Ноябрь" },
    { id: 12, en: "December", ru: "Декабрь" },
];

module.exports = Tools;