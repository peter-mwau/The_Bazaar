import { createThirdwebClient } from "thirdweb";

export const client = createThirdwebClient({
  clientId:
    import.meta.env.VITE_THIRDWEB_CLIENT_ID ||
    "ef04abf4ded4b15ad944e44a6d3b2e55",
});
