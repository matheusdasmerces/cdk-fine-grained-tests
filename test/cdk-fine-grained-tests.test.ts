import { Template } from 'aws-cdk-lib/assertions';
import { App } from 'aws-cdk-lib';
import { CdkFineGrainedTestsStack } from '../lib/cdk-fine-grained-tests-stack';
import { AWS_RESOURCE_TYPES } from './aws-resource-types';

describe('MyFunction Fine-Grained Tests', () => {
  const app = new App();
  const stack = new CdkFineGrainedTestsStack(app, 'CdkFineGrainedTestsStack', {});

  const template = Template.fromStack(stack);

  it('should have created a lambda function with default configuration', () => {
    template.hasResourceProperties(AWS_RESOURCE_TYPES.LAMBDA, {
      FunctionName: 'my-function',
      Handler: 'index.handler',
      Runtime: 'nodejs22.x',
      Architectures: ['arm64'],
      Timeout: 30,
      MemorySize: 128,
    });
  });

  it('should have created a log group with the correct retention policy', () => {
    template.hasResourceProperties(AWS_RESOURCE_TYPES.LOG_GROUP, {
      LogGroupName: '/aws/lambda/my-log-group',
      RetentionInDays: 7,
    });
  });

  it('should have created a iam service role with the lambda basic execution role', () => {
    template.hasResourceProperties(AWS_RESOURCE_TYPES.ROLE, {
      ManagedPolicyArns: [
        {
          'Fn::Join': [
            '',
            [
              'arn:',
              { Ref: 'AWS::Partition' },
              ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
            ],
          ],
        },
      ],
    });
  });

  it('should have created a iam policy with the correct permissions', () => {
    template.hasResourceProperties(AWS_RESOURCE_TYPES.POLICY, {
      PolicyDocument: {
        Statement: [
          {
            Action: 's3:GetObject',
            Effect: 'Allow',
            Resource: 'arn:aws:s3:::my-bucket/*',
          },
        ],
      },
    });
  });
});
