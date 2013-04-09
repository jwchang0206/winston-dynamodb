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
tableName       : DynamoDB table name
```

## Prerequisite

Make a table with `tableName`

The table should have

- hash key: (String) level
- range key: (String) timestamp

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

## Installation

``` bash
  $ npm install winston
  $ npm install winston-dynamodb
```

#### Author: [JeongWoo Chang](http://twitter.com/inspiredjw)

[0]: https://github.com/flatiron/winston