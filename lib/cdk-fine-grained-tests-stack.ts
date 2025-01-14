import * as cdk from 'aws-cdk-lib';
import { Policy, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Architecture, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';

export class CdkFineGrainedTestsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const myLogGroup = new LogGroup(
      this,
      'MyLogGroup',
      {
        logGroupName: `/aws/lambda/my-log-group`,
        retention: RetentionDays.ONE_WEEK,
      },
    );

    const myFunction = new NodejsFunction(this, 'MyFunction', {
      functionName: 'my-function',
      entry: 'src/handler.ts',
      handler: 'handler',
      timeout: cdk.Duration.seconds(30),
      runtime: Runtime.NODEJS_22_X,
      memorySize: 128,
      architecture: Architecture.ARM_64,
      logGroup: myLogGroup,
    });

    myFunction.role?.attachInlinePolicy(
      new Policy(this, 'MyPolicy', {
        statements: [
          new PolicyStatement({
            actions: ['s3:GetObject'],
            resources: ['arn:aws:s3:::my-bucket/*'],
          }),
        ],
      })
    )
  }
}
