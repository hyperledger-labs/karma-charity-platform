"use strict";
const AppSettings_1 = require("./src/AppSettings");
const AppModule_1 = require("./src/AppModule");
const settings = new AppSettings_1.AppSettings();
const config = AppModule_1.AppModule.getOrmConfig(settings);
module.exports = config;
