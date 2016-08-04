export declare class DynamoDB {
    regions: string[];
    name: string;
    level: string;
    db: any;
    AWS: any;
    region: string;
    tableName: string;
    dynamoDoc: any;
    constructor(options: any);
    log(level: any, msg: any, meta: any, callback: any): any;
}
