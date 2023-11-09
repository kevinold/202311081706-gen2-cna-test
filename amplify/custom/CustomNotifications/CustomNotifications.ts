import { CfnOutput } from 'aws-cdk-lib';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { EmailSubscription, LambdaSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';
import { Construct } from 'constructs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class CustomNotifications extends Construct {

  constructor(scope: Construct, id: string) {

    super(scope, id);

    const topic = new Topic(this, 'NotificationTopic');

    const lambda = new NodejsFunction(this, 'NotificationHandler', {
      runtime: Runtime.NODEJS_18_X,  
      handler: 'index.handler',
      entry: join(__dirname, 'index.js'),
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