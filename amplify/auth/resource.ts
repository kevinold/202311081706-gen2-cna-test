import { defineAuth } from "@aws-amplify/backend";

export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  // override: {
  //   userPool: {
  //     passwordPolicy: {
  //       temporaryPasswordValidityDays: 3,
  //     },
  //   },
  // },
});
