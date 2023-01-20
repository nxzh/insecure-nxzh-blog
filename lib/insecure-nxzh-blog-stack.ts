import {Stack, StackProps} from 'aws-cdk-lib';
import {RedirectProtocol} from 'aws-cdk-lib/aws-s3';
import {Construct} from 'constructs';
import config from '../config/config.json'
import {DomainBucket} from "./domain-bucket";
import {SubDomainW3Bucket} from "./subdomain-www-bucket";
import * as rt53 from 'aws-cdk-lib/aws-route53'
import {RecordTarget} from 'aws-cdk-lib/aws-route53'
import * as s3Deploy from "aws-cdk-lib/aws-s3-deployment";
import {BucketWebsiteTarget} from "aws-cdk-lib/aws-route53-targets";

export class InsecureNxzhBlogStack extends Stack {

    DomainBucketId: string = 'BucketForMyDomain'
    SubDomainBucketId: string = 'BucketForSubDomainW3'
    DeployWebsiteToBucket: string = 'DeployWebsite'
    HostedZoneForDomain: string = 'HostedZoneForDomain'
    DomainARecordId: string = 'Route53ARecordForDomain'
    SubDomainW3ARecordId: string = 'Route53ARecordForSubDomainW3'

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);
        const domainBucket = this.createBucketForDomain();
        this.createBucketForSubDomainOfWww();
        this.deployHostContentsToDomainBucket(domainBucket);
        this.registerHostedZoneForSites(domainBucket);
    }

    private deployHostContentsToDomainBucket(domainBucket: DomainBucket) {
        new s3Deploy.BucketDeployment(this, this.DeployWebsiteToBucket, {
            sources: [s3Deploy.Source.asset(config.contentPath)],
            destinationBucket: domainBucket.bucket,
        })
    }

    private createBucketForSubDomainOfWww() {
        if (config.subdomainWww) {
            new SubDomainW3Bucket(this, this.SubDomainBucketId, {
                bucketName: config.subdomainWww,
                redirectHostname: config.domainName,
                protocol: RedirectProtocol.HTTP
            })
        }
    }

    private createBucketForDomain() {
        return new DomainBucket(this, this.DomainBucketId, {
            bucketName: config.domainName,
            indexPageName: config.indexPageName
        })
    }

    private registerHostedZoneForSites(domainBucket: DomainBucket) {
        if (config.ifRegisterHostedZone) {
            const zone = new rt53.HostedZone(this, this.HostedZoneForDomain, {
                zoneName: config.domainName
            });
            new rt53.ARecord(this, this.DomainARecordId, {
                zone: zone,
                deleteExisting: true,
                recordName: config.domainName,
                target: RecordTarget.fromAlias(new BucketWebsiteTarget(domainBucket.bucket))
            });
            if (config.subdomainWww) {
                new rt53.ARecord(this, this.SubDomainW3ARecordId, {
                    zone: zone,
                    deleteExisting: true,
                    recordName: config.subdomainWww,
                    target: RecordTarget.fromAlias(new BucketWebsiteTarget(domainBucket.bucket))
                })
            }
        }
    }
}
