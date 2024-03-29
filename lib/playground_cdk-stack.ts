import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigw from 'aws-cdk-lib/aws-apigateway';

export class PlaygroundCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // S3 Bucket
    const bucket = new s3.Bucket(this, 'MyfirstBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      versioned: true,
      publicReadAccess: true,
      bucketName: 'my-first-bucket-6',
    });

    bucket.addLifecycleRule({
      expiration: cdk.Duration.days(7),
      enabled: true,
    })

    // Lambda Function
    const lambdaFunction = new lambda.Function(this, 'MyLambda', {
      runtime: lambda.Runtime.PYTHON_3_11,
      handler: 'lambda_function.lambda_handler',
      code: lambda.Code.fromAsset('/Users/mac/Desktop/playground_cdk/lib/lambda_code/my_first_lambda'),
      environment: {
        BUCKET_NAME: bucket.bucketName,
      },
      functionName: 'aws',
    });

    // Grant S3 permissions to the Lambda function
    bucket.grantReadWrite(lambdaFunction);

    // API Gateway
    const api = new apigw.RestApi(this, 'cdk-test-api');

    // Integration between API Gateway and Lambda Function
    const integration = new apigw.LambdaIntegration(lambdaFunction);
    const apiResource = api.root.addResource('myResource');
    apiResource.addMethod('GET', integration);

    // Output API Gateway URL
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
    });
  }
}
