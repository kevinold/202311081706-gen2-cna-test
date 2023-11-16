import { defineAuth } from "@aws-amplify/backend";

export const auth = defineAuth({
  loginWith: {
    email: {
      verificationEmailStyle: "CODE",
      verificationEmailBody: (code: string) =>
        `Welcome! Your verification code is ${code}.`,
      verificationEmailSubject: "Welcome! Here is your verification code",
    },
  },
});
