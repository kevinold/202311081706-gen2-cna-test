import { Runtime } from "aws-cdk-lib/aws-lambda";
import {
  NodejsFunction,
  NodejsFunctionProps,
} from "aws-cdk-lib/aws-lambda-nodejs";
import * as sns from "aws-cdk-lib/aws-sns";
import * as subs from "aws-cdk-lib/aws-sns-subscriptions";
import { Construct } from "constructs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export type Message = {
  subject: string;
  body: string;
  recipient: string;
};
interface CustomNotificationsProps {
  sourceAddress: string;
}

export class CustomNotifications extends Construct {
  constructor(scope: Construct, id: string, props: CustomNotificationsProps) {
    super(scope, id);

    const { sourceAddress } = props;

    // Create SNS topic
    const topic = new sns.Topic(this, "NotificationTopic");

    const nodeJsFunctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: [
          "@aws-sdk", // Use the 'aws-sdk' available in the Lambda runtime
        ],
      },
      runtime: Runtime.NODEJS_18_X,
      handler: "index.handler",
    };

    // Lambda to publish messages
    const publisher = new NodejsFunction(this, "Publisher", {
      entry: join(__dirname, "publisher.ts"),
      environment: {
        topicArn: topic.topicArn,
      },
      ...nodeJsFunctionProps,
    });

    // Lambda to process messages
    const emailer = new NodejsFunction(this, "Emailer", {
      entry: join(__dirname, "emailer.ts"),
      environment: {
        sourceAddress,
      },
      ...nodeJsFunctionProps,
    });

    // Subscribe emailer lambda to SNS topic
    topic.addSubscription(new subs.LambdaSubscription(emailer));

    // Allow publisher to publish to SNS topic
    topic.grantPublish(publisher);
  }
}
