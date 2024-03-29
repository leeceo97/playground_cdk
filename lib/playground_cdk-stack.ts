import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class PlaygroundCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new cdk.aws_s3.Bucket(this, 'MyfirstBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      versioned: true,
      bucketName: 'my-first-bucket',
    });
  }
}
