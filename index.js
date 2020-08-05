const fs = require('fs');
const version1 = require('./configuration_parsers/version1');


let rawdata = fs.readFileSync("config.json");
let configuration = JSON.parse(rawdata);

switch (configuration['cfg-version']) {
    case 1:
        version1.parse(configuration);
        break;
    default:
        console.log("Error: Configuration version not supported")
}

