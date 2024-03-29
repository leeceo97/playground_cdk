import boto3
import json

def lambda_handler(event, context):
    s3_client = boto3.client('s3')
    bucket_name = 'my-first-bucket-6'
    file_key = 'example.txt'
    text_data = 'Hello, this is a text file stored in S3!'
    s3_client.put_object(Bucket=bucket_name, Key=file_key, Body=text_data)
    
    return {
        'statusCode': 200,
        'body': json.dumps('Text file saved successfully')
    }