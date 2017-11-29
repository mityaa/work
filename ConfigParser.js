var fs = require('fs');
var path = require('path');
// var objectMerge = require('object-merge');

module.exports = class ConfigParser {

    static getProperties() {
        var local = {},
            common = {},
            cfgPath;
        try {
            cfgPath = path.resolve(__dirname + path.sep + 'config.local.json');
            local = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
        } catch (err) { }
        cfgPath = path.resolve(__dirname + path.sep + 'config.json');
        common = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
        var obj = Object.assign(common, local);
        // var obj = objectMerge(common, local);
        return obj;
    }

};