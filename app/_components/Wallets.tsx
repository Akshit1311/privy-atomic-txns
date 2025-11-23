"use client";
import { useWallets } from "@privy-io/react-auth/solana";
import { createClient } from "../_kit/client";
import { address, airdropFactory, lamports, Lamports } from "@solana/kit";
import { useEffect, useState } from "react";
import Button from "./Button";
import SendMoney from "./SendMoney";

const Wallets = () => {
  const { wallets, ready } = useWallets();
  console.log({ wallets });

  const [balance, setBalance] = useState<Lamports | undefined>(undefined);

  useEffect(() => {
    if (!ready) return;
    (async () => {
      try {
        const client = createClient();
        const account = address(wallets[0].address);
        const { value: bal } = await client.rpc.getBalance(account).send();
        console.log({ bal });

        setBalance(bal);
      } catch (err) {
        console.log({ err });
      }
    })();
  }, [ready, wallets]);

  // only works on solana local instance
  const airdropTokenToWallet = async (addr: string) => {
    try {
      const client = createClient();
      const airdrop = airdropFactory(client);
      await airdrop({
        recipientAddress: address(addr),
        lamports: lamports(BigInt("1000000000")),
        commitment: "confirmed",
      });
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <div className="border border-zinc-800 absolute right-1 top-1">
      {wallets.map((wallet) => (
        <div
          key={wallet.address}
          className="border border-zinc-800 p-2 bg-emerald-700 rounded-lg"
        >
          <div>{wallet.address}</div>
          <div>Balance: {balance?.toString()}</div>
          <Button onClick={() => airdropTokenToWallet(wallet.address)}>
            Airdrop
          </Button>
        </div>
      ))}

      <div>
        <SendMoney />
      </div>
    </div>
  );
};

export default Wallets;
