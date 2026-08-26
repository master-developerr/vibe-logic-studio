const clerkDomain = process.env.CLERK_JWT_ISSUER_DOMAIN || "https://simple-insect-61.clerk.accounts.dev";
// Normalize: always ensure trailing slash for Convex JWT domain matching
const normalizedDomain = clerkDomain.replace(/\/+$/, "") + "/";

const authConfig = {
  providers: [
    {
      domain: normalizedDomain,
      applicationID: "convex",
    },
  ],
};

export default authConfig;
