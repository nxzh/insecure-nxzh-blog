import {RemovalPolicy, StackProps} from "aws-cdk-lib";
import {Construct} from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import {Bucket, BucketEncryption} from "aws-cdk-lib/aws-s3";
import config from "../config/config.json";
import * as iam from "aws-cdk-lib/aws-iam";
import {Effect, PolicyStatement} from "aws-cdk-lib/aws-iam";

export interface DomainBucketProps extends StackProps {
    readonly bucketName: string;
    readonly indexPageName: string;
    readonly errorPageName?: string;
}

export class DomainBucket extends Construct {
    readonly bucket: Bucket;
    readonly logBucket: Bucket;
    constructor(scope: Construct, id: string, props: DomainBucketProps) {
        super(scope, id);
        const logBucketName = "log." + props.bucketName;
        const logBucketId = "Log" + id;
        const domainLogBucket = this.createLogBucket(logBucketId, logBucketName);
        const domainBucket = new s3.Bucket(this, id, {
            bucketName: props.bucketName,
            blockPublicAccess: {
                blockPublicAcls: false,
                blockPublicPolicy: false,
                ignorePublicAcls: false,
                restrictPublicBuckets: false
            },
            serverAccessLogsBucket: domainLogBucket,
            websiteIndexDocument: props.indexPageName,
            websiteErrorDocument: props.errorPageName,
            encryption: BucketEncryption.S3_MANAGED,
            removalPolicy: RemovalPolicy.DESTROY,
            autoDeleteObjects: true,

        })
        domainBucket.addToResourcePolicy(new PolicyStatement({
            sid: "PublicReadGetObject",
            principals: [new iam.AnyPrincipal()],
            effect: Effect.ALLOW,
            actions: ["s3:GetObject"],
            resources: ["arn:aws:s3:::" + config.domainName + "/*"]
        }));
        this.bucket = domainBucket;
        this.logBucket = domainLogBucket;
    }

    private createLogBucket(id: string, bucketName: string) {
        return new s3.Bucket(this, id, {
            bucketName: bucketName,
            encryption: BucketEncryption.S3_MANAGED,
            removalPolicy: RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
        })
    }
}