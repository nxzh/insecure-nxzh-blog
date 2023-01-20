# Welcome to my insecure S3 static website hosting CDK TypeScript project

This project is doing the same thing as this [tutorial](https://docs.aws.amazon.com/AmazonS3/latest/userguide/website-hosting-custom-domain-walkthrough.html), but with CDK.

It demonstrates a CDK app with an instance of a stack (`InsecureNxzhBlogStack`)
which will deploy a static website in S3. 

The `cdk.json` file tells the CDK Toolkit how to execute this app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk boostrap` need to bootstrap once before deploy
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template

## Outcome

The outcome of this project is a site which can be access from this [link](http://nxzh.dev.s3-website-ap-northeast-1.amazonaws.com/)
