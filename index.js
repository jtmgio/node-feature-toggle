"use strict";
const request = require("request-promise");
const featuresSet = require("./features.json");
const _ = require("lodash");
const bluebird = require("bluebird");
const redis = require("redis");
const path = "/organization/v1/";
const expirationTime = 300; //5 minutes
//function scope
var redisClient;

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

module.exports = {
    featureSwitchStart,
};
/*
 **-------------------------------------------------------------------------------------
 ** METHOD NAME - featureSwitchStart
 **-------------------------------------------------------------------------------------
 */
function featureSwitchStart(app, config) {
    if (!_.has(redisClient, "connected") || redisClient.connected === false) {
        redisClient = redis.createClient({
            host: config.redis_server,
        });
    }
    app.route("/feature-switch/has-feature").post(
        getFeatureSwitches.bind({
            config,
        })
    );
}
/*
 **-------------------------------------------------------------------------------------
 ** METHOD NAME - getFeatureSwitches
 **-------------------------------------------------------------------------------------
 */
function getFeatureSwitches(req, res) {
    this.organizationEndPoint = `http://${
		this.config.server.host
	}${path}organization/${req.app.locals.service_id}`;
    this.jtmgid_token = req.app.locals.jtmgid_token;
    this.service_id = req.app.locals.service_id;
    this.redisKey = `app:ui:featureswitch:${req.app.locals.service_id}`;
    try {
        //try to see if there is a cache
        const redisPromise = checkCache(this.redisKey);
        redisPromise.then(ret => {
            if (ret) {
                //sendback cache
                res.json({
                    hasAccess: parseFeatures(ret, req.body.feature),
                });
                return;
            }
            //get from server
            const hasAccess = getFeaturesFromServer(this, req.body.feature).then(
                hasAccess => {
                    res.json({
                        hasAccess,
                    });
                }
            );
        });
    } catch (e) {
        res.json({
            hasAccess: false,
        });
    }
}
/*
 **-------------------------------------------------------------------------------------
 ** METHOD NAME - getFeaturesFromServer
 **-------------------------------------------------------------------------------------
 */
async function getFeaturesFromServer(config, feature) {
    try {
        //if no cache then get the feature set
        const ret = await request.get({
            url: config.organizationEndPoint,
            headers: requestHeaders(config.service_id, config.jtmgid_token),
        });
        const hasAccess = parseFeatures(ret, feature);
        redisClient.set(config.redisKey, ret, "EX", expirationTime);
        return hasAccess;
    } catch (e) {
        console.log(e);
        return false;
    }
}
/*
 **-------------------------------------------------------------------------------------
 ** METHOD NAME - parseFeatures
 **-------------------------------------------------------------------------------------
 */
function parseFeatures(features, requestedFeature) {
    const featureId = featuresSet[requestedFeature];
    let parsedFeatures = JSON.parse(features).features;
    return parsedFeatures.find(item => featureId === item) ? true : false;
}
/*
 **-------------------------------------------------------------------------------------
 ** METHOD NAME - checkCache
 **-------------------------------------------------------------------------------------
 */
function checkCache(redisKey) {
    return redisClient.getAsync(redisKey);
}
/*
 **-------------------------------------------------------------------------------------
 ** METHOD NAME - requestHeaders
 **-------------------------------------------------------------------------------------
 */
function requestHeaders(service_id, token) {
    return {
        "content-type": "application/json",
        accept: "application/json",
        "X-JTMG-Service-Id": service_id,
        authorization: `${token}`,
    };
}