"use client";

import React from "react";

import {
  pipe,
  createTransactionMessage,
  setTransactionMessageFeePayer,
  setTransactionMessageLifetimeUsingBlockhash,
  appendTransactionMessageInstructions,
  compileTransaction,
  createNoopSigner,
  createSolanaRpc,
  getTransactionEncoder,
  address,
  getBase58Decoder,
} from "@solana/kit";
import { getTransferSolInstruction } from "@solana-program/system";
import { useSignAndSendTransaction } from "@privy-io/react-auth/solana";

// Important!
import { useWallets } from "@privy-io/react-auth/solana";
import Button from "./Button";
import { env } from "@/env";
import { useSessionSigners } from "@privy-io/react-auth";

const SendMoney = () => {
  const { signAndSendTransaction } = useSignAndSendTransaction();

  const { wallets } = useWallets();

  const { addSessionSigners } = useSessionSigners();

  const sendMonies = async () => {
    const wallet = wallets[0];

    const to = "4nebkckkHA8fB6htBQbCRbwiSwNQ7uXP1T1EQf7Wc3My"; // Token Minter - Phantom

    if (!wallet) throw new Error("Wallet not found");

    const LAMPORTS_PER_SOL = 1_000_000_000;

    const transferInstruction = getTransferSolInstruction({
      amount: LAMPORTS_PER_SOL * 0.01,
      destination: address(to),
      source: createNoopSigner(address(wallet.address)),
    });

    const { getLatestBlockhash } = createSolanaRpc(env.NEXT_PUBLIC_RPC_URL);
    const { value: latestBlockhash } = await getLatestBlockhash().send();

    // Create transaction
    const transaction = pipe(
      createTransactionMessage({ version: 0 }),
      (tx) => setTransactionMessageFeePayer(address(wallet.address), tx),
      (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
      (tx) => appendTransactionMessageInstructions([transferInstruction], tx),
      (tx) => compileTransaction(tx)
    );
    const encodedTransaction = getTransactionEncoder().encode(transaction);

    // Sign the transaction
    const signedTransaction = await signAndSendTransaction({
      transaction: new Uint8Array(encodedTransaction),
      wallet,
      chain: "solana:devnet",

      options: {
        sponsor: true,
        uiOptions: {
          transactionInfo: {
            title: "Send Money",
          },
        },
      },
    });

    const sig = signedTransaction.signature;

    console.log({ signedTransaction, sig: getBase58Decoder().decode(sig) });
  };

  return (
    <div>
      SendMoney <Button onClick={sendMonies}>Send Money</Button>
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

export default SendMoney;
