var dirpath = process.cwd();
const PROPS = require(dirpath + '/utils/Config');

exports.getEnv = function (env, projectName) {
    var envUrl;
    var pathOfWay;

    switch (projectName.toLowerCase()) {
        case 'tua':
            pathOfWay = PROPS.endpoints.tua;
            break;
        case 'api4':
            pathOfWay = PROPS.endpoints.api4;
            break;
    }

    var title = env.branch;

    switch (title.toLowerCase()) {
        case 'master':
            envUrl = pathOfWay.master;
            break;
        case 'release':
            envUrl = pathOfWay.release;
            break;
        case 'dev':
            envUrl = pathOfWay.dev;
            break;
        case 'pre':
            envUrl = pathOfWay.pre;
            break;
        case 'deac':
            envUrl = pathOfWay.deac;
            break;
        default:
            envUrl = pathOfWay.dev;
            title = 'dev';
            break;
    }
    return {
        url: envUrl,
        title: title
    };
};