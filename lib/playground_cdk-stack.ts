import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigw from 'aws-cdk-lib/aws-apigateway';

export class PlaygroundCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'MyfirstBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      // publicReadAccess: true,
      // accessControl: s3.BucketAccessControl.PUBLIC_READ,
      bucketName: 'cdk-test-bteucket',
    });

    bucket.addLifecycleRule({
      expiration: cdk.Duration.days(7),
      enabled: true,
    })

    const lambdaFunction = new lambda.Function(this, 'MyLambda', {
      runtime: lambda.Runtime.PYTHON_3_11,
      handler: 'lambda_function.lambda_handler',
      code: lambda.Code.fromAsset('/Users/mac/Desktop/playground_cdk/lib/lambda_code/my_first_lambda'),
      environment: {
        BUCKET_NAME: bucket.bucketName,
      },
      functionName: 'cdk_test',
    });

    bucket.grantReadWrite(lambdaFunction);

    const api = new apigw.RestApi(this, 'cdk-test-api');

    const integration = new apigw.LambdaIntegration(lambdaFunction);
    const apiResource = api.root.addResource('myResource');
    apiResource.addMethod('GET', integration);

    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
    });
  }
}
