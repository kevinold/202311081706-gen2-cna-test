// publisher Lambda
import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";

const client = new SNSClient({ region: process.env.AWS_REGION });

export const handler = async (event: any) => {
  try {
    const { subject, body, recipient } = event;

    const params = {
      TopicArn: process.env.topicArn,
      Message: JSON.stringify({
        subject,
        body,
        recipient,
      }),
    };

    const command = new PublishCommand(params);
    await client.send(command);
  } catch (err) {
    console.error(err);
    throw err;
  }
};
