var fs = require('fs');
var path = require('path');
// var dateFormat = require('dateformat');
var ConfigParser = require('./ConfigParser.js');


var History = function () { };

History.newTestExecution = function (obj) {
    var historyPath = path.resolve(ConfigParser.getProperties().historyDir + obj.historyFile);

    try {
        fs.accessSync(historyPath);
    } catch (error) {
        fs.appendFileSync(historyPath, JSON.stringify({
            "title": "", // название для отображения в списке тестов
            "test": "",
            "env": "", // урл для отображения в списке тестов
            "failed": false, // статус теста
            "history": []
        })
        );
    }
    finally {
        var contents = fs.readFileSync(historyPath, 'utf8');
        var history = JSON.parse(contents);
        history.title = obj.title;
        history.failed = obj.testFailed;
        history.env = obj.env;
        history.run = obj.run;
        history.history.unshift({
            date: new Date().toString(),
            failed: obj.testFailed,
            link: obj.link
        });
        history.history = history.history.slice(0, 30); // keep last 30 test executions in history
        fs.writeFileSync(historyPath, JSON.stringify(history));
    }
};

module.exports = History;