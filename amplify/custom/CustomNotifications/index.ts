import { SNSEvent } from "aws-lambda";
import AWS from "aws-sdk";

// Initialize AWS SDK clients
const sns = new AWS.SNS();
const ses = new AWS.SES();

// Lambda handler
export const handler = async (event: SNSEvent) => {
  // Get message content
  const message = event.Records[0].Sns.Message;

  // Log received message
  console.log("Received SNS message:", message);

  // Publish message to another SNS topic
  await publishMessage(message);

  // Send email
  await sendEmail(message);

  return { status: "success" };
};

// Publish to SNS
const publishMessage = async (msg: string) => {
  const params = {
    TopicArn: process.env.topicArn,
    Message: msg,
  };

  await sns.publish(params).promise();
};

// Send email via SES
const sendEmail = async (msg: string) => {
  const params = {
    Source: process.env.sourceAddress,
    Destination: {
      ToAddresses: [process.env.recipientAddress],
    },
    Message: {
      Body: {
        Text: { Data: msg },
      },
      Subject: { Data: process.env.emailSubject },
    },
  };

  await ses.sendEmail(params).promise();
};
