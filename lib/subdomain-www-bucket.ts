import {RemovalPolicy, StackProps} from "aws-cdk-lib";
import {Construct} from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import {BucketEncryption, RedirectProtocol} from "aws-cdk-lib/aws-s3";

export interface SubDomainW3BucketProps extends StackProps {
    readonly bucketName: string;
    readonly redirectHostname: string;
    readonly protocol: RedirectProtocol
}

export class SubDomainW3Bucket extends Construct {

    constructor(scope: Construct, id: string, props: SubDomainW3BucketProps) {
        super(scope, id);
        new s3.Bucket(this, id, {
            bucketName: props.bucketName,
            encryption: BucketEncryption.S3_MANAGED,
            removalPolicy: RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
            websiteRedirect: {
                hostName: props.redirectHostname,
                protocol: RedirectProtocol.HTTP
            }
        })
    }
}
