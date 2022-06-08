//--------------------------------------------------------------------------
//
// 	Properties
//
//--------------------------------------------------------------------------

if (!process.env.SOURCE) {
    throw new Error(`Please use SOURCE env to set path to compiled project directory`);
}
if (!process.env.PORT) {
    throw new Error(`Please use PORT env to set port`);
}

let directory = `${__dirname}/${process.env.SOURCE}`;

//--------------------------------------------------------------------------
//
// 	Imports
//
//--------------------------------------------------------------------------

const express = require('express');
const https = require('https');
const _ = require('lodash');
const fs = require('fs');

//--------------------------------------------------------------------------
//
// 	Update config
//
//--------------------------------------------------------------------------

let path = `${directory}/config.json`;
let config = JSON.parse(fs.readFileSync(path, 'utf8'));
let isChanged = false;
let envKeys = ['API_URL', 'USER'];
for (let key of envKeys) {
    let value = process.env[key];
    key = _.camelCase(key);
    if (_.isNil(value)) {
        delete config[key];
        continue;
    }
    config[key] = value;
    isChanged = true;
}

console.log(`Application config:`);
console.log(config);

if (isChanged) {
    fs.writeFileSync(path, JSON.stringify(config, null, 4), 'utf8');
}

//--------------------------------------------------------------------------
//
// 	Run Application
//
//--------------------------------------------------------------------------

let application = express();
application.use(express.static(directory));
application.all('/*', (request, response, next) => response.sendFile(`${directory}/index.html`));

var port = process.env.PORT;
application.listen(port);

console.log(`Application started on "${port}" port`);

var httpsPort = process.env.HTTPS_PORT;
if (!process.env.HTTPS_PORT) {
    console.warn(`Please use HTTPS_PORT env to set port for https`);
    return;
}

let certDirectory = `${__dirname}/cert`;
let options = {
    key: fs.readFileSync(`${certDirectory}/privkey.pem`),
    cert: fs.readFileSync(`${certDirectory}/fullchain.pem`)
};
https.createServer(options, application).listen(httpsPort);
console.log(`Application https started on "${httpsPort}" port`);
