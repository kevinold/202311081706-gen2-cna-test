import { defineBackend } from "@aws-amplify/backend";
import * as s3 from "aws-cdk-lib/aws-s3";
import { auth } from "./auth/resource.js";
import { CustomNotifications } from "./custom/CustomNotifications/resource.js";
import { data } from "./data/resource.js";

const backend = defineBackend({
  auth,
  data,
});

// add tags to the user pool
backend.resources.auth.resources.cfnResources.cfnUserPool.addPropertyOverride(
  "UserPoolTags",
  {
    "userpool-tag-1": "userpool-tag-value-1",
    "userpool-tag-2": "userpool-tag-value-2",
  }
);

// override userpool password policies
backend.resources.auth.resources.cfnResources.cfnUserPool.addPropertyOverride(
  "Policies",
  {
    PasswordPolicy: {
      MinimumLength: 10,
      RequireLowercase: true,
      RequireNumbers: true,
      RequireSymbols: true,
      RequireUppercase: true,
      TemporaryPasswordValidityDays: 20,
    },
  }
);

// create the bucket and its stack
const bucketStack = backend.createStack("BucketStack");
const bucket = new s3.Bucket(bucketStack, "Bucket", {
  blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
});

//new LambdaInAVpcStack(backend.getStack("LambdaInAVpcStack"), "LambdaInAVpc");

//new BackupStack(backend.getStack('BackupStack'),
// 'Backup', { database: backend.resources.data.resources.database })

new CustomNotifications(
  backend.createStack("CustomNotifications"),
  "CustomNotifications",
  {
    sourceAddress: "sender@example.com",
  }
);

// new ApiLambdaCrudDynamoDBStack(
//   backend.getStack("ApiLambdaCrudDynamoDBStack"),
//   "ApiLambdaCrudDynamoDBExample"
// );
