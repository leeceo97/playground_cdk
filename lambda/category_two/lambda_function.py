import boto3
import json
import plotly.graph_objects as go
import plotly.express as px
import pandas as pd
import base64


# S3 클라이언트 생성
s3 = boto3.client('s3')
# global request_data

"""
global_data = 
{
    "data" : ["13M0101","13M0105","13M0305"],
    "category": ["ingre_product"],
    "date": ["2023-03-02","2024-03-02"]
}
"""

def lambda_handler(event, context):
    # 접근할 bucket_name
    source_bucket_name = 'drawing-raw-data'
    
    #불러올 데이터 
    source_file_key = 'train.csv' #사용할 데이터로 변경
    
    # html 저장 bucket_name
    target_bucket_name = 'drawing-html'

    #외부 호출 api 파라미터    
    encoded_data = event['body']
    
    #HTTP
    # global_data = base64.b64decode(encoded_data).decode('utf-8', errors='replace')
    # global_data = json.loads(global_data)
    
    #REST API
    global_data = json.loads(encoded_data)
    
    #테스트용
    # print(event)
    # global_data =(event)
    
    #파라미터로부터 S3접근
    response = s3.get_object(Bucket=source_bucket_name, Key=source_file_key)

    # S3의 파일 내용 읽기
    # print('response: ',response)
    # print("response['Body']: ",response['Body'])
    df = pd.read_csv(response['Body'],index_col=0)
    # print(df)
    
    # 파일 이름(경로지정)
    filename = '_'.join(global_data["data"])  + "X" + '_'.join(global_data["date"])+ "X" + "drawing2"
    
    # filename = "testcase1"
    print(filename)
    
    #그림 그리는코드
    fig = px.scatter(df, x='연간소득',y="대출금액",color='대출목적')
    
    
    
    # html 떨구는 코드
    html_content = fig.to_html()
    s3.put_object(Bucket=target_bucket_name, Key=f'{filename}.html', Body=html_content.encode('utf-8'))
    

    return {'statusCode': 200}