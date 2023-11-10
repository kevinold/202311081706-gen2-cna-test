// publisher Lambda
import { SNS } from "aws-sdk";
import { Message } from "./CustomNotifications";

const topic = new SNS();

export const handler = async (event: any) => {
  try {
    const message: Message = {
      subject: "Hello",
      body: "World",
      recipient: "user@example.com",
    };

    // Publish message to SNS
    await topic.publish(message).promise();
  } catch (err) {
    console.error(err);
    throw err;
  }
};
