"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var winston = require('winston');
var AWS = require('aws-sdk');
var uuid = require('node-uuid');
var _ = require('lodash');
var os = require('os');
var hostname = os.hostname();
function datify(timestamp) {
    var dateTS = new Date(timestamp);
    var date = {
        year: dateTS.getFullYear(),
        month: dateTS.getMonth() + 1,
        day: dateTS.getDate(),
        hour: dateTS.getHours(),
        minute: dateTS.getMinutes(),
        second: dateTS.getSeconds(),
        millisecond: dateTS.getMilliseconds()
    };
    var keys = _.without(Object.keys(date), "year", "month", "day");
    var len = keys.length;
    for (var i = 0; i < len; i++) {
        var key = keys[i];
        if (date[key] < 10) {
            date[key] = "0" + date[key];
        }
    }
    return date.year + "-" + date.month + "-" + date.day + " " + date.hour + ":" + date.minute + ":" + date.second + "." + date.millisecond;
}
var DynamoDB = (function (_super) {
    __extends(DynamoDB, _super);
    function DynamoDB(options) {
        _super.call(this, options);
        if (options == null) {
            options = {};
        }
        this.regions = ["us-east-1", "us-west-1", "us-west-2", "eu-west-1", "eu-central-1", "ap-northeast-1", "ap-northeast-2", "ap-southeast-1", "ap-southeast-2", "sa-east-1"];
        if (options.useEnvironment) {
            options.accessKeyId = process.env.AWS_ACCESS_KEY_ID;
            options.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
            options.region = process.env.AWS_REGION;
        }
        if (options.accessKeyId == null) {
            throw new Error("need accessKeyId");
        }
        if (options.secretAccessKey == null) {
            throw new Error("need secretAccessKey");
        }
        if (options.region == null) {
            throw new Error("need region");
        }
        if (this.regions.indexOf(options.region) < 0) {
            throw new Error("unavailable region given");
        }
        if (options.tableName == null) {
            throw new Error("need tableName");
        }
        if (!options.useEnvironment) {
            AWS.config.update({
                accessKeyId: options.accessKeyId,
                secretAccessKey: options.secretAccessKey,
                region: options.region
            });
        }
        this.name = "dynamodb";
        this.level = options.level || "info";
        this.db = new AWS.DynamoDB();
        this.AWS = AWS;
        this.region = options.region;
        this.tableName = options.tableName;
        this.dynamoDoc = options.dynamoDoc;
    }
    DynamoDB.prototype.log = function (level, msg, meta, callback) {
        var dynamoDocClient, params;
        var putCallback = function (_this) {
            return function (err, data) {
                if (err) {
                    _this.emit("error", err);
                    if (callback) {
                        return callback(err, null);
                    }
                }
                else {
                    _this.emit("logged");
                    if (callback) {
                        return callback(null, "logged");
                    }
                }
            };
        };
        putCallback(this);
        if (this.dynamoDoc === true) {
            params = {
                TableName: this.tableName,
                Item: {
                    id: uuid.v4(),
                    level: level,
                    timestamp: datify(Date.now()),
                    msg: msg,
                    hostname: hostname
                }
            };
            if (!_.isEmpty(meta)) {
                params.Item.meta = meta;
            }
            dynamoDocClient = new this.AWS.DynamoDB.DocumentClient({
                service: this.db
            });
            return dynamoDocClient.put(params, putCallback);
        }
        else {
            params = {
                TableName: this.tableName,
                Item: {
                    id: {
                        "S": uuid.v4()
                    },
                    level: {
                        "S": level
                    },
                    timestamp: {
                        "S": datify(Date.now())
                    },
                    msg: {
                        "S": msg
                    },
                    hostname: {
                        "S": hostname
                    }
                }
            };
            if (!_.isEmpty(meta)) {
                params.Item.meta = {
                    "S": JSON.stringify(meta)
                };
            }
            return this.db.putItem(params, putCallback);
        }
    };
    return DynamoDB;
}(winston.Transport));
exports.DynamoDB = DynamoDB;
