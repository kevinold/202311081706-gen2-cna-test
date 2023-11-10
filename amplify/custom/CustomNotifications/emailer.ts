// emailer Lambda
import { SNSEvent } from "@types/aws-lambda";
import { SNSHandler } from "aws-lambda";
import { SES, SNS } from "aws-sdk";
import { Message } from "./CustomNotifications";

const topic = new SNS();
const ses = new SES();

export const handler: SNSHandler = async (event: SNSEvent) => {
  try {
    for (const record of event.Records) {
      const message = JSON.parse(record.Sns.Message);

      // Send email with SES
      await sendEmail(message);

      // Delete message from SNS
      await topic
        .deleteMessage({
          TopicArn: record.Sns.TopicArn,
          ReceiptHandle: record.Sns.ReceiptHandle,
        })
        .promise();
    }
  } catch (err) {
    console.error(err);
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
    const result = await ses.sendEmail(params).promise();
    console.log(`Email sent to ${recipient}: ${result.MessageId}`);
  } catch (err) {
    console.error(`Error sending email to ${recipient}: ${err}`);
    throw err;
  }
};
