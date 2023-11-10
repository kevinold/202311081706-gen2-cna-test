// CDK construct
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
          "aws-sdk", // Use the 'aws-sdk' available in the Lambda runtime
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

/*import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Topic } from "aws-cdk-lib/aws-sns";
import {
  EmailSubscription,
  LambdaSubscription,
} from "aws-cdk-lib/aws-sns-subscriptions";
import { Construct } from "constructs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface CustomNotificationsProps {
  emailSubscription: string;
  sourceAddress: string;
  recipientAddress: string;
  emailSubject?: string;
}

export class CustomNotifications extends Construct {
  constructor(scope: Construct, id: string, props: CustomNotificationsProps) {
    const { emailSubscription, sourceAddress, recipientAddress, emailSubject } =
      props;

    super(scope, id);

    const topic = new Topic(this, "NotificationTopic");

    const lambda = new NodejsFunction(this, "NotificationHandler", {
      runtime: Runtime.NODEJS_18_X,
      handler: "index.handler",
      entry: join(__dirname, "index.ts"),
      functionName: "notificationHandler",
      bundling: {
        externalModules: [
          "aws-sdk", // Use the 'aws-sdk' available in the Lambda runtime
        ],
      },
      environment: {
        topicArn: topic.topicArn,
        recipientAddress,
        sourceAddress,
        emailSubject: emailSubject || "Notification email",
      },
    });

    topic.addSubscription(new LambdaSubscription(lambda));
    topic.addSubscription(new EmailSubscription(emailSubscription));
  }
}
*/
