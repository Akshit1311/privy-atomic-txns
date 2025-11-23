"use client";

import { env } from "@/env";
import { PrivyProvider } from "@privy-io/react-auth";
import { createSolanaRpc, createSolanaRpcSubscriptions } from "@solana/kit";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={env.NEXT_PUBLIC_PRIVY_APP_ID}
      clientId={env.NEXT_PUBLIC_PRIVY_CLIENT_ID}
      config={{
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          solana: {
            createOnLogin: "all-users",
          },
          ethereum: {
            createOnLogin: "off",
          },
        },

        solana: {
          rpcs: {
            // "solana:mainnet": {
            //   rpc: createSolanaRpc("https://api.mainnet-beta.solana.com"),
            //   rpcSubscriptions: createSolanaRpcSubscriptions(
            //     "wss://api.mainnet-beta.solana.com"
            //   ),
            // },
            "solana:devnet": {
              rpc: createSolanaRpc("https://api.devnet.solana.com"),
              rpcSubscriptions: createSolanaRpcSubscriptions(
                "wss://api.devnet.solana.com"
              ),
            },
          },
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
