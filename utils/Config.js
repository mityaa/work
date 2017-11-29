var fs = require('fs');
var path = require('path');

function parseConfig() {
    var local = {},
        common = {},
        cfgPath;
    try {
        cfgPath = path.resolve(__dirname, '..', 'config.local.json');
        local = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
    } catch (err) { }
    cfgPath = path.resolve(__dirname, '..', 'config.json');
    common = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
    var obj = Object.assign(common, local);
    return obj;
}

module.exports = parseConfig();