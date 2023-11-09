import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource.js";
import { CustomNotifications } from "./custom/CustomNotifications/CustomNotifications.js";
import { ApiLambdaCrudDynamoDBStack } from "./custom/RestApi/index.js";
import { data } from "./data/resource.js";

const backend = defineBackend({
  auth,
  data,
});

//new BackupStack(backend.getStack('BackupStack'),
// 'Backup', { database: backend.resources.data.resources.database })

new CustomNotifications(
  backend.getStack("CustomNotifications"),
  "CustomNotifications",
  {
    emailSubscription: "email@example.com",
    sourceAddress: "sender@example.com",
    recipientAddress: "recipient@example.com",
  }
);

new ApiLambdaCrudDynamoDBStack(
  backend.getStack("ApiLambdaCrudDynamoDBStack"),
  "ApiLambdaCrudDynamoDBExample"
);
