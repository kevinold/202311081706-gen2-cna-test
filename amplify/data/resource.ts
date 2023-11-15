import { Func, a, defineData, type ClientSchema } from "@aws-amplify/backend";
import * as path from "path";
// type Todo
//   @model
//   @auth(rules: [
//     { allow: owner, provider: oidc, identityClaim: "user_id" },
//     { allow: private, provider: oidc },
//     { allow: group, provider: oidc, groupClaim: "user_groups" },
//   ]) {
//   content: String
// }

// const schema = a.schema({
//   Post: a
//     .model({
//       id: a.id(),
//       owner: a.string(),
//       postname: a.string(),
//       content: a.string(),
//     })
//     .authorization([
//       a.allow.owner().identityClaim("user_id"),
//       a.allow.specificGroups(["Moderator"]).withClaimIn("user_groups"),
//     ]),
// });

const schema = a.schema({
  Todo: a.model({
    name: a.string(),
    description: a.string().authorization([a.allow.public("iam").to(["read"])]),
  }),
  //.authorization([a.allow.public("iam").to(["read"]), a.allow.owner()]),
});

// export const data = defineData({
//   schema,
// authorizationModes: {
//   oidcAuthorizationMode: {
//     oidcProviderName: "oidc-provider-name",
//     oidcIssuerUrl: "https://example.com",
//     clientId: "client-id",
//     tokenExpiryFromAuthInSeconds: 300,
//     tokenExpireFromIssueInSeconds: 600,
//   },
//   //IAM Role names which are provided full r/w access to the API for models with IAM authorization.
//   allowListedRoleNames: ["arn:aws:iam::<account-id>:role/<role-name>"],
// },
//});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "API_KEY",
    lambdaAuthorizationMode: {
      function: Func.fromDir({
        name: "authorizer",
        codePath: path.join(".", "lambda-authorizer"),
      }),
    },
  },
});
