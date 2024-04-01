import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigw from 'aws-cdk-lib/aws-apigateway';

export class PlaygroundCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // s3 설정
    const bucket = new s3.Bucket(this, 'MyfirstBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      bucketName: 'dashboard-for-research',
    });

    bucket.addLifecycleRule({
      expiration: cdk.Duration.days(7),
      enabled: true,
    });

    // lambda 설정
    const lambdaOne = new lambda.Function(this, 'CategoryOne', {
      runtime: lambda.Runtime.PYTHON_3_11,
      handler: 'lambda_function.lambda_handler',
      code: lambda.Code.fromAsset('/Users/mac/Desktop/playground_cdk/lambda/category_one'),
      environment: {
        BUCKET_NAME: bucket.bucketName,
      },
      timeout: cdk.Duration.seconds(30),
      memorySize: 1024,
      functionName: 'dashboard-for-research-one',
    });

    const lambdaTwo = new lambda.Function(this, 'CategoryTwo', {
      runtime: lambda.Runtime.PYTHON_3_11,
      handler: 'lambda_function.lambda_handler',
      code: lambda.Code.fromAsset('/Users/mac/Desktop/playground_cdk/lambda/category_two'),
      environment: {
        BUCKET_NAME: bucket.bucketName,
      },
      timeout: cdk.Duration.seconds(30),
      memorySize: 1024,
      functionName: 'dashboard-for-research-two',
    });

    const lambdaThree = new lambda.Function(this, 'CategoryThree', {
      runtime: lambda.Runtime.PYTHON_3_11,
      handler: 'lambda_function.lambda_handler',
      code: lambda.Code.fromAsset('/Users/mac/Desktop/playground_cdk/lambda/category_three'),
      environment: {
        BUCKET_NAME: bucket.bucketName,
      },
      timeout: cdk.Duration.seconds(30),
      memorySize: 1024,
      functionName: 'dashboard-for-research-three',
    });

    const lambdaFour = new lambda.Function(this, 'CategoryFour', {
      runtime: lambda.Runtime.PYTHON_3_11,
      handler: 'lambda_function.lambda_handler',
      code: lambda.Code.fromAsset('/Users/mac/Desktop/playground_cdk/lambda/category_four'),
      environment: {
        BUCKET_NAME: bucket.bucketName,
      },
      timeout: cdk.Duration.seconds(30),
      memorySize: 1024,
      functionName: 'dashboard-for-research-four',
    });

    const pandasLayerArn = 'arn:aws:lambda:ap-northeast-2:336392948345:layer:AWSSDKPandas-Python311:10';

    lambdaOne.addLayers(lambda.LayerVersion.fromLayerVersionArn(this, 'PandasLayerOne', pandasLayerArn));
    lambdaOne.addLayers(lambda.LayerVersion.fromLayerVersionArn(this, 'PlotlyLayerOne', 'arn:aws:lambda:ap-northeast-2:381491836300:layer:plotly:1'));
    lambdaTwo.addLayers(lambda.LayerVersion.fromLayerVersionArn(this, 'PandasLayerTwo', pandasLayerArn));
    lambdaTwo.addLayers(lambda.LayerVersion.fromLayerVersionArn(this, 'PlotlyLayerTwo', 'arn:aws:lambda:ap-northeast-2:381491836300:layer:plotly:1'));
    lambdaThree.addLayers(lambda.LayerVersion.fromLayerVersionArn(this, 'PandasLayerThree', pandasLayerArn));
    lambdaThree.addLayers(lambda.LayerVersion.fromLayerVersionArn(this, 'PlotlyLayerThree', 'arn:aws:lambda:ap-northeast-2:381491836300:layer:plotly:1'));
    lambdaFour.addLayers(lambda.LayerVersion.fromLayerVersionArn(this, 'PandasLayerFour', pandasLayerArn));
    lambdaFour.addLayers(lambda.LayerVersion.fromLayerVersionArn(this, 'PlotlyLayerFour', 'arn:aws:lambda:ap-northeast-2:381491836300:layer:plotly:1'));

    bucket.grantReadWrite(lambdaOne);
    bucket.grantReadWrite(lambdaTwo);
    bucket.grantReadWrite(lambdaThree);
    bucket.grantReadWrite(lambdaFour);

    const drawingRawDataBucket = s3.Bucket.fromBucketName(this, 'DrawingRawDataBucket', 'drawing-raw-data');
    const drawingHtmlBucket = s3.Bucket.fromBucketName(this, 'DrawingHtmlBucket', 'drawing-html');

    drawingRawDataBucket.grantReadWrite(lambdaOne);
    drawingRawDataBucket.grantReadWrite(lambdaTwo);
    drawingRawDataBucket.grantReadWrite(lambdaThree);
    drawingRawDataBucket.grantReadWrite(lambdaFour);

    drawingHtmlBucket.grantReadWrite(lambdaOne);
    drawingHtmlBucket.grantReadWrite(lambdaTwo);
    drawingHtmlBucket.grantReadWrite(lambdaThree);
    drawingHtmlBucket.grantReadWrite(lambdaFour);

    const api = new apigw.RestApi(this, 'dashboard-for-research-api', {
      restApiName: 'dashboard-for-research-api',
      endpointConfiguration: {
        types: [apigw.EndpointType.REGIONAL],
      },
    });

    const categoryOne = new apigw.LambdaIntegration(lambdaOne);
    const categoryTwo = new apigw.LambdaIntegration(lambdaTwo);
    const categoryThree = new apigw.LambdaIntegration(lambdaThree);
    const categoryFour = new apigw.LambdaIntegration(lambdaFour);

    const apiResourceOne = api.root.addResource('one');
    const apiResourceTwo = api.root.addResource('two');
    const apiResourceThree = api.root.addResource('three');
    const apiResourceFour = api.root.addResource('four');

    apiResourceOne.addMethod('ANY', categoryOne);
    apiResourceTwo.addMethod('ANY', categoryTwo);
    apiResourceThree.addMethod('ANY', categoryThree);
    apiResourceFour.addMethod('ANY', categoryFour);


    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
    });
  }
}
