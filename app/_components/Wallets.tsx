"use client";
import { useWallets } from "@privy-io/react-auth/solana";

const Wallets = () => {
  const { wallets } = useWallets();
  console.log({ wallets });

  return (
    <div className="border border-zinc-800 absolute right-1 top-1">
      {wallets.map((wallet, i) => (
        <div key={wallet.address}>
          {i}: {wallet.address}
        </div>
      ))}
    </div>
  );
};

export default Wallets;
