#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import {InsecureNxzhBlogStack} from '../lib/insecure-nxzh-blog-stack';

const app = new cdk.App();
new InsecureNxzhBlogStack(app, 'InsecureNxzhBlogStack', {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION
    }
});
