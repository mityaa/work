

module.exports = class searchesCheck {

    constructor(mainKey, checkingKey) {
        this.mainKey = mainKey;
        this.checkingKey = checkingKey;
    }

    /**
     * Выдача количества рекомендаций по поиску двух ключей
     * @param {string} mainKeyCout главный ключ
     * @param {string} checkingKeyCout мета ключ
     */
    checkingRecommendCout(mainKeyCout, checkingKeyCout) {
        var table = '';
        if (mainKeyCout != checkingKeyCout) {
            table = `<br><font color= 'red'><br>Количество рекомендаций не совпадает: <br> ${this.mainKey} = ${mainKeyCout} <br> ${this.checkingKey} = ${checkingKeyCout}</font>`;
        } else {
            table = `<br><font color="green"> Количество рекомендаций при поиске пары ключей (${this.mainKey} - ${this.checkingKey}) совпадает</font>`;
        }
        return table;
    }

    /**
     * Получение массива уникальных авиакомпаний из ответа
     * @param {object} responseObject 
     */
    getUniqueAirCompanies(responseObject) {
        var companiesArr = [];
        var defaultArr = [];
        var i = responseObject.result.json.response.recommendations.length;
        responseObject.result.json.response.recommendations.forEach(function (element) {
            defaultArr.push(element.validating_supplier);
        });
        defaultArr.sort();
        while (i--) {
            if (defaultArr[i] === defaultArr[i - 1]) {
                defaultArr.splice(i, 1);
            }

        }
        for (i = 0; i < defaultArr.length; i++) {
            companiesArr.push(defaultArr[i]);
        }
        return companiesArr;
    }


    /**
     * Получение количества рекомендаций с конкретной авиакомпанией из поиска
     * @param {object} responseObject 
     * @param {string} uniqueCompany 
     */
    getCoutUniqueCompany(responseObject, uniqueCompany) {
        var cout = 0;
        for (var i = 0; i < responseObject.result.json.response.recommendations.length; i++) {
            if (responseObject.result.json.response.recommendations[i].validating_supplier === uniqueCompany) {
                cout++;
            }
        }
        return cout;
    }

    /**
     * Сравнение массивов результатов поиска по двм ключам
     * @param {object} companyResponseFirst 
     * @param {object} companyResponseSecond 
     */
    checkingCompanyCout(companyResponseFirst, companyResponseSecond) {
        var companyArrFirst = this.getUniqueAirCompanies(companyResponseFirst);
        var companyArrSecond = this.getUniqueAirCompanies(companyResponseSecond);
        var table = '<br><table>';
        var firstCount = companyArrFirst.length;
        var secondCount = companyArrSecond.length;
        var i, j;
        if (firstCount == secondCount) {
            for (i = 0; i < companyArrFirst.length; i++) {
                table += '<tr>';
                table += `<td>${companyArrFirst[i]}</td> <td>${this.getCoutUniqueCompany(companyResponseFirst, companyArrFirst[i])}</td>` +
                    `<td>${companyArrSecond[i]}</td>  <td>${this.getCoutUniqueCompany(companyResponseSecond, companyArrSecond[i])}</td>`;
                table += '</tr>';
            }
        } else if (firstCount > secondCount) {
            for (i = 0; i < secondCount; i++) {
                table += '<tr>';
                table += `<td>${companyArrFirst[i]}</td> <td>${this.getCoutUniqueCompany(companyResponseFirst, companyArrFirst[i])}</td>` +
                    `<td>${companyArrSecond[i]}</td>  <td>${this.getCoutUniqueCompany(companyResponseSecond, companyArrSecond[i])}</td>`;
                table += '</tr>';
            }
            for (j = firstCount - secondCount; j < firstCount; j++) {
                table += '<tr>';
                table += `<td>${companyArrFirst[j]}</td> <td>${this.getCoutUniqueCompany(companyResponseFirst, companyArrFirst[j])}</td>` +
                    `<td></td>  <td></td>`;
                table += '</tr>';
            }
        } else {
            for (i = 0; i < firstCount; i++) {
                table += '<tr>';
                table += `<td>${companyArrFirst[i]}</td> <td>${this.getCoutUniqueCompany(companyResponseFirst, companyArrFirst[i])}</td>` +
                    `<td>${companyArrSecond[i]}</td>  <td>${this.getCoutUniqueCompany(companyResponseSecond, companyArrSecond[i])}</td>`;
                table += '</tr>';
            }
            for (j = secondCount - firstCount; j < secondCount; j++) {
                table += '<tr>';
                table += `<td></td> <td></td>` +
                    `<td>${companyArrSecond[j]}</td>  <td>${this.getCoutUniqueCompany(companyResponseSecond, companyArrSecond[j])}</td>`;
                table += '</tr>';
            }
        }
        return table += '</table>';
    }

};