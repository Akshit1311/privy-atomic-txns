import { env } from "@/env";
import {
  Rpc,
  RpcSubscriptions,
  SolanaRpcApi,
  SolanaRpcSubscriptionsApi,
} from "@solana/kit";
import { createSolanaRpc, createSolanaRpcSubscriptions } from "@solana/kit";

export type Client = {
  rpc: Rpc<SolanaRpcApi>;
  rpcSubscriptions: RpcSubscriptions<SolanaRpcSubscriptionsApi>;
};

let client: Client | undefined;

export function createClient(): Client {
  if (!client) {
    client = {
      rpc: createSolanaRpc(env.NEXT_PUBLIC_RPC_URL),
      rpcSubscriptions: createSolanaRpcSubscriptions(
        env.NEXT_PUBLIC_RPC_WS_URL
      ),
    };
  }
  return client;
}
