winston = require "winston"
util = require "util"
AWS = require "aws-sdk"
uuidV4 = require("node-uuid").v4
_ = require "lodash"
hostname = require("os").hostname()

# Return timestamp with YYYY-MM-DD HH:mm:ss
datify = (timestamp) ->
	date = new Date timestamp
	date = 
		year: date.getFullYear()
		month: date.getMonth() + 1
		day: date.getDate()

		hour: date.getHours()
		minute: date.getMinutes()
		second: date.getSeconds()

	keys = _.without Object.keys date, "year", "month", "day"
	date[key] = "0" + date[key] for key in keys when date[key] < 10
	"#{date.year}-#{date.month}-#{date.day} #{date.hour}:#{date.minute}:#{date.second}"

DynamoDB = exports.DynamoDB = (options = {}) ->
	regions = [
		"us-east-1"
		"us-west-1"
		"us-west-2"
		"eu-west-1"
		"ap-northeast-1"
		"ap-southeast-1"
		"ap-southeast-2"
		"sa-east-1"
	]

	unless options.accessKeyId?
		throw new Error "need accessKeyId"

	unless options.secretAccessKey?
		throw new Error "need secretAccessKey"

	unless options.region?
		throw new Error "need region"

	unless options.region in regions
		throw new Error "unavailable region given"

	unless options.tableName?
		throw new Error "need tableName"

	AWS.config.update
		accessKeyId: options.accessKeyId
		secretAccessKey: options.secretAccessKey
		region: options.region

	# Winston Options
	@.name = "dynamodb"
	@.level = options.level or "info"

	# DynamoDB Options=
	@.db = new AWS.DynamoDB()
	@.region = options.region
	
	# a-z, A-Z, 0-9, _ (underscore), - (hyphen) and . (period)
	@.tableName = options.tableName

util.inherits DynamoDB, winston.Transport

DynamoDB::log = (level, msg, meta, callback) ->
	# DynamoDB Options
	params =
		TableName: @.tableName
		Item:
			level:
				"S": level
			timestamp:
				"S": datify Date.now()
			msg:
				"S": msg
			hostname:
				"S": hostname

	params.Item.meta = "S": JSON.stringify meta if meta?
	
	@.db.putItem params, (err, data) =>
		if err
			@.emit "error", err

		else
			@.emit "logged"

	callback null, true

# Add DynamoDB to the transports by winston
winston.transports.DynamoDB = DynamoDB
