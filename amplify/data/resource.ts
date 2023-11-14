import { a, defineData, type ClientSchema } from "@aws-amplify/backend";

const schema = a.schema({
  Todo: a
    .model({
      name: a.string(),
      description: a
        .string()
        .authorization([a.allow.public("iam").to(["read"])]),
    })
    .authorization([a.allow.public("iam").to(["read"]), a.allow.owner()]),
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

export const data = defineData({ schema });
