import { createThirdwebClient } from "thirdweb";
import { getEnv } from "../config/env";

const clientId = getEnv("VITE_THIRDWEB_CLIENT_ID");

if (!clientId) {
  console.error(
    "Missing VITE_THIRDWEB_CLIENT_ID. Set it at build time or pass it as a container environment variable.",
  );
}

export const client = clientId ? createThirdwebClient({ clientId }) : null;
