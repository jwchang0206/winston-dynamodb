import * as winston from 'winston';
import * as AWS from 'aws-sdk';
export interface DynamoDBTransportOptions {
    useEnvironment?: boolean;
    accessKeyId?: string;
    secretAccessKey?: string;
    region?: string;
    tableName: string;
    level: string;
    dynamoDoc: AWS.DynamoDB.DocumentClient;
}
export interface DynamoDBTransportInstance extends winston.TransportInstance {
    new (options?: DynamoDBTransportOptions): DynamoDBTransportInstance;
}
export declare class DynamoDB extends winston.Transport {
    regions: string[];
    name: string;
    level: string;
    db: any;
    AWS: any;
    region: string;
    tableName: string;
    dynamoDoc: any;
    new(options?: DynamoDBTransportOptions): DynamoDBTransportInstance;
    log(level: any, msg: any, meta: any, callback: any): any;
}
declare module "winston" {
    interface Transports {
        DynamoDB: DynamoDB;
    }
}
