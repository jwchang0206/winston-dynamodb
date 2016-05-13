# DynamoDB Transport for Winston

A DynamoDB transport for [winston][0].

## Usage
```javascript
  var winston = require('winston');
  
  require('winston-dynamodb').DynamoDB;
  
  winston.add(winston.transports.DynamoDB, options);
```

## Options

```
accessKeyId     : your AWS access key id
secretAccessKey : your AWS secret access key
region          : the region where the domain is hosted
useEnvironment  : use process.env values for AWS access, secret, & region
tableName       : DynamoDB table name
dynamoDoc       : if this is set to true, the *meta* parameter will be stored as a subobject using DynamoDB's DocumentClient rather than as a JSON string.
```

## Prerequisite

Make a table with `tableName`

The table schema depends on how you intend to use it.

#### Simplest

The table should have

- hash key: (String) level
- range key: (String) timestamp

> Note: Timestamp has a millisecond resolution. So whether this key setup will work depends on how many log messages you expect.
>
> That is, the uniqueness of level + timestamp means max: 1 log message of a given level per millisecond.

It is nice to have it as a range key for queries.

#### More Robust

To ensure you can log as many messages as you like, alternatively use:

- hash key: (String) id <small>(Will be a uuid)</small>
- range key: (String) timestamp

Using the id as hash ensures that all log items will have unique keys and be included.

## Region

Available Regions

- us-east-1
- us-west-1
- us-west-2
- eu-west-1
- ap-northeast-1
- ap-southeast-1
- ap-southeast-2
- sa-east-1

## AWS Credentials

All of these options are values that you can find from your Amazon Web Services account: 'accessKeyId', 'secretAccessKey' and 'awsAccountId'.

Alternatively, pass in useEnvironment: true and the process.env values will be used.
> (Functions in AWS Lambda environment and works with default AWS Credentials Global Configuration .config in other node environments.)  

## Installation

``` bash
  $ npm install winston
  $ npm install winston-dynamodb
```

#### Author: [JeongWoo Chang](http://twitter.com/inspiredjw)

[0]: https://github.com/winstonjs/winston