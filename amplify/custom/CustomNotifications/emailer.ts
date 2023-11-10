// emailer Lambda
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { DeleteMessageCommand, SNSClient } from "@aws-sdk/client-sns";
import type { SNSEvent } from "aws-lambda";
import { Message } from "./resource";

const sesClient = new SESClient({ region: process.env.AWS_REGION });
const snsClient = new SNSClient({ region: process.env.AWS_REGION });

export const handler = async (event: SNSEvent) => {
  for (const record of event.Records) {
    const message = JSON.parse(record.Sns.Message);

    await sendEmail(message);

    await deleteMsg(record.Sns.ReceiptHandle, record.Sns.TopicArn);
  }
};

const sendEmail = async (msg: Message) => {
  const { recipient, subject, body } = msg;

  const params = {
    Source: process.env.sourceAddress,
    Destination: {
      ToAddresses: [recipient],
    },
    Message: {
      Body: {
        Text: { Data: body },
      },
      Subject: { Data: subject },
    },
  };

  try {
    const command = new SendEmailCommand(params);
    const result = await sesClient.send(command);
    console.log(`Email sent to ${recipient}: ${result.MessageId}`);
  } catch (err) {
    console.error(`Error sending email to ${recipient}: ${err}`);
    throw err;
  }
};

const deleteMsg = async (receiptHandle: string, topicArn: string) => {
  const command = new DeleteMessageCommand({
    ReceiptHandle: receiptHandle,
    TopicArn: topicArn,
  });

  try {
    await snsClient.send(command);
  } catch (err) {
    console.error("Error deleting message", err);
  }
};
