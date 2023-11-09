import { CfnOutput } from 'aws-cdk-lib';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { EmailSubscription, LambdaSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';
import { Construct } from 'constructs';

export class CustomNotifications extends Construct {

  constructor(scope: Construct, id: string) {

    super(scope, id);

    const topic = new Topic(this, 'NotificationTopic');

    const lambda = new Function(this, 'NotificationHandler', {
      runtime: Runtime.NODEJS_18_X,  
      handler: 'index.handler',
      code: Code.fromAsset('custom/CustomNotifications/index.js'),
      functionName: 'notificationHandler',
    });

    topic.addSubscription(new LambdaSubscription(lambda));
    
    topic.addSubscription(new EmailSubscription('email@domain.com'));

    // output ARN
    new CfnOutput(this, 'snsTopicARN', {
        value: topic.topicArn,
        description: 'The SNS notification-topic ARN'
    })

  }

}