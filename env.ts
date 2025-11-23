import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),

    PRIVY_APP_SECRET: z.string().min(1),
    PRIVY_QUORUM_PRIV_KEY: z.string().min(1),
    PAYMASTER_PRIV_KEY: z.string().min(1),
  },

  client: {
    NEXT_PUBLIC_PRIVY_APP_ID: z.string().min(1),
    NEXT_PUBLIC_PRIVY_CLIENT_ID: z.string().min(1),
    NEXT_PUBLIC_RPC_URL: z.url().min(1),
    NEXT_PUBLIC_RPC_WS_URL: z.url().min(1),
    NEXT_PUBLIC_PRIVY_QUORUM_ID: z.string().min(1),
  },

  runtimeEnv: {
    // Server
    NODE_ENV: process.env.NODE_ENV,
    PRIVY_APP_SECRET: process.env.PRIVY_APP_SECRET,
    PRIVY_QUORUM_PRIV_KEY: process.env.PRIVY_QUORUM_PRIV_KEY,
    PAYMASTER_PRIV_KEY: process.env.PAYMASTER_PRIV_KEY,

    // Client
    NEXT_PUBLIC_PRIVY_APP_ID: process.env.NEXT_PUBLIC_PRIVY_APP_ID,
    NEXT_PUBLIC_PRIVY_CLIENT_ID: process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID,
    NEXT_PUBLIC_RPC_URL: process.env.NEXT_PUBLIC_RPC_URL,
    NEXT_PUBLIC_RPC_WS_URL: process.env.NEXT_PUBLIC_RPC_WS_URL,
    NEXT_PUBLIC_PRIVY_QUORUM_ID: process.env.NEXT_PUBLIC_PRIVY_QUORUM_ID,
  },

  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
