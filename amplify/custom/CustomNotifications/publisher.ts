// publisher Lambda
import { SNS } from "aws-sdk";

const topic = new SNS();

export const handler = async (event: any) => {
  try {
    const { subject, body, recipient } = event;

    const message = {
      subject,
      body,
      recipient,
    };

    // Publish message to SNS
    await topic.publish(message).promise();
  } catch (err) {
    console.error(err);
    throw err;
  }
};
