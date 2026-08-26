export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN || "https://simple-insect-61.clerk.accounts.dev/",
      applicationID: "convex",
    },
  ],
};
