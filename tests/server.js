"use strict";
const express = require("express");
const bodyParser = require('body-parser');
const featureSwitch = require("../index");
const app = express();
const config = {
    redis_server: "dev00-redis-shared.fcteoe.ng.0001.use1.cache.amazonaws.com",
    server: {
        host: "192.168.1.214:8080",
        port: 3000
    }
};
app.locals = {
    jtmgid_token: "e48c8caa-89a9-46ac-b2c6-0c3e5966201a",
    serviceId: 10031
};
//middleware
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
const server = app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + server.address().port);
});


featureSwitch.featureSwitchStart(app, config);