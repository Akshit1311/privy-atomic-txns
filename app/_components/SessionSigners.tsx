"use client";

import React from "react";

// Important!
import { useWallets } from "@privy-io/react-auth/solana";
import Button from "./Button";
import { env } from "@/env";
import { usePrivy, useSessionSigners } from "@privy-io/react-auth";

const SessionSigners = () => {
  const { wallets } = useWallets();

  const { addSessionSigners } = useSessionSigners();

  const { user } = usePrivy();

  const walletsWithSessionSigners = user?.linkedAccounts.filter(
    (account) =>
      account.type === "wallet" && "id" in account && account.delegated
  );

  return (
    <div>
      <div className="border border-amber-300 p-2 rounded-lg">
        <div>Signers:</div>
        {walletsWithSessionSigners?.map((account, i) => (
          <div key={`wallet-${i}`}>{JSON.stringify(account)}</div>
        ))}
      </div>
      <Button
        onClick={() => {
          addSessionSigners({
            address: wallets[0].address,
            signers: [
              {
                signerId: env.NEXT_PUBLIC_PRIVY_QUORUM_ID,
              },
            ],
          });
        }}
      >
        Add Session Signer
      </Button>
    </div>
  );
};

export default SessionSigners;
