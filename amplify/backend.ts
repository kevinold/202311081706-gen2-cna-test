import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource.js";
import { CustomNotifications } from "./custom/CustomNotifications/CustomNotifications.js";
import { LambdaInAVpcStack } from "./custom/LambdaInAVpcStack/index.js";
import { data } from "./data/resource.js";

const backend = defineBackend({
  auth,
  data,
});

new LambdaInAVpcStack(backend.getStack("LambdaInAVpcStack"), "LambdaInAVpc");

//new BackupStack(backend.getStack('BackupStack'),
// 'Backup', { database: backend.resources.data.resources.database })

new CustomNotifications(
  backend.getStack("CustomNotifications"),
  "CustomNotifications",
  {
    sourceAddress: "sender@example.com",
  }
);

// new ApiLambdaCrudDynamoDBStack(
//   backend.getStack("ApiLambdaCrudDynamoDBStack"),
//   "ApiLambdaCrudDynamoDBExample"
// );
