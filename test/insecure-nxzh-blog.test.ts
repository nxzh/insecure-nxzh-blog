import * as cdk from 'aws-cdk-lib';
import {Template} from 'aws-cdk-lib/assertions';
import * as InsecureNxzhBlog from '../lib/insecure-nxzh-blog-stack';

test('SQS Queue and SNS Topic Created', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new InsecureNxzhBlog.InsecureNxzhBlogStack(app, 'MyTestStack');
    // THEN

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::S3::Bucket', {
        BucketName: 'nxzh.dev'
    })
});
