import { NextRequest, NextResponse } from "next/server";
import { PrivyClient } from "@privy-io/node";
import { env } from "@/env";
import {
  address,
  addSignersToTransactionMessage,
  appendTransactionMessageInstructions,
  compileTransaction,
  createNoopSigner,
  createSignerFromKeyPair,
  createTransactionMessage,
  getTransactionEncoder,
  pipe,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
} from "@solana/kit";
import { getTransferSolInstruction } from "@solana-program/system";
import {
  getTransferInstruction,
  findAssociatedTokenPda,
  getCreateAssociatedTokenIdempotentInstructionAsync,
  TOKEN_PROGRAM_ADDRESS,
  type TransferInstruction,
} from "@solana-program/token";
import type { Instruction } from "@solana/kit";
import { createClient } from "@/app/_kit/client";

import { partiallySignTransaction } from "@solana/kit";
import { createKeyPairFromPrivateKeyBytes } from "@solana/kit";
import bs58 from "bs58";

const privyClient = new PrivyClient({
  appId: env.NEXT_PUBLIC_PRIVY_APP_ID,
  appSecret: env.PRIVY_APP_SECRET,
});

const convertPrivKeyTo32 = () => {
  const decoded = bs58.decode(env.PAYMASTER_PRIV_KEY); // Uint8Array

  let privateKeyBytes: Uint8Array;
  if (decoded.length === 64) {
    // first 32 bytes are the private key
    privateKeyBytes = decoded.slice(0, 32);
  } else if (decoded.length === 32) {
    privateKeyBytes = decoded;
  } else {
    throw new Error(`unexpected key length: ${decoded.length}`);
  }

  return privateKeyBytes;
};

const POST = async (req: NextRequest) => {
  const {
    walletAddress,
    tokenMint,
    amount,
    decimals = 9, // Default to 9 decimals (like SOL)
  } = await req.json();

  const LAMPORTS_PER_SOL = 1_000_000_000;
  const amountLamports = amount
    ? Math.floor(amount * Math.pow(10, decimals))
    : Math.floor(LAMPORTS_PER_SOL * 0.1); // Default: 0.1 SOL

  const to1 = "4nebkckkHA8fB6htBQbCRbwiSwNQ7uXP1T1EQf7Wc3My";
  const to2 = "262WK4x2eiA17y36tWgoieT4HPPL7vU7PmPZMPgXjDWQ";

  // create paymaster keypair + signer
  const paymasterKeyPair = await createKeyPairFromPrivateKeyBytes(
    convertPrivKeyTo32()
  );
  const paymasterSigner = await createSignerFromKeyPair(paymasterKeyPair);

  const client = createClient();

  let transferInstruction1: Instruction | TransferInstruction;
  let transferInstruction2: Instruction | TransferInstruction;
  const instructions: Instruction[] = [];

  if (tokenMint) {
    // SPL Token transfer
    const mintAddress = address(tokenMint);
    const walletAddr = address(walletAddress);

    // Derive source ATA (sender's token account)
    const [sourceATA] = await findAssociatedTokenPda({
      owner: walletAddr,
      mint: mintAddress,
      tokenProgram: TOKEN_PROGRAM_ADDRESS,
    });

    // Derive destination ATAs and create them if needed
    const [dest1ATA] = await findAssociatedTokenPda({
      owner: address(to1),
      mint: mintAddress,
      tokenProgram: TOKEN_PROGRAM_ADDRESS,
    });
    const [dest2ATA] = await findAssociatedTokenPda({
      owner: address(to2),
      mint: mintAddress,
      tokenProgram: TOKEN_PROGRAM_ADDRESS,
    });

    console.log({ dest1ATA, dest2ATA });

    // Create destination ATAs if they don't exist (idempotent - won't fail if exists)
    // The paymaster will pay for account creation
    const createATA1Instruction =
      await getCreateAssociatedTokenIdempotentInstructionAsync({
        payer: paymasterSigner,
        owner: address(to1),
        mint: mintAddress,
      });
    const createATA2Instruction =
      await getCreateAssociatedTokenIdempotentInstructionAsync({
        payer: paymasterSigner,
        owner: address(to2),
        mint: mintAddress,
      });

    instructions.push(createATA1Instruction, createATA2Instruction);

    // Create transfer instructions
    transferInstruction1 = getTransferInstruction({
      source: sourceATA,
      destination: dest1ATA,
      authority: createNoopSigner(walletAddr), // user-signed
      amount: amountLamports,
    });

    transferInstruction2 = getTransferInstruction({
      source: sourceATA,
      destination: dest2ATA,
      authority: createNoopSigner(walletAddr), // user-signed
      amount: amountLamports,
    });
  } else {
    // Native SOL transfer (existing behavior)
    transferInstruction1 = getTransferSolInstruction({
      amount: amountLamports,
      destination: address(to1),
      source: createNoopSigner(address(walletAddress)), // user-signed
    });
    transferInstruction2 = getTransferSolInstruction({
      amount: amountLamports,
      destination: address(to2),
      source: createNoopSigner(address(walletAddress)), // user-signed
    });
  }

  // create a noop signer for the wallet address (will be signed by Privy later)
  const walletNoopSigner = createNoopSigner(address(walletAddress));

  // Get fresh blockhash right before building transaction to minimize expiration risk
  // Using finalized commitment for longer validity period (up to ~150 slots vs ~60 for confirmed)
  const { value: latestBlockhash } = await client.rpc
    .getLatestBlockhash({ commitment: "finalized" })
    .send();

  // Build all instructions array (ATA creation instructions + transfer instructions)
  const allInstructions = [
    ...instructions,
    transferInstruction1,
    transferInstruction2,
  ];

  // create the transaction message, set paymaster as fee payer, set lifetime, append instructions
  // Then add wallet signer to ensure it's included as a required signer before compilation
  const transaction = pipe(
    createTransactionMessage({ version: 0 }),
    (tx) => setTransactionMessageFeePayerSigner(paymasterSigner, tx), // pay the fee
    (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
    (tx) => appendTransactionMessageInstructions(allInstructions, tx),
    (tx) => addSignersToTransactionMessage([walletNoopSigner], tx), // add wallet as required signer after instructions
    (tx) => compileTransaction(tx)
  );

  // PARTIAL SIGN: sign only with paymaster keypair so we include the fee-payer signature
  // Use partiallySignTransaction to allow missing signatures (wallet will be signed by Privy)
  const partiallySigned = await partiallySignTransaction(
    [paymasterKeyPair],
    transaction
  );

  // encode the partially-signed tx bytes
  const encoded = getTransactionEncoder().encode(partiallySigned);

  // Send to Privy to sign the remaining required signatures (the wallet keys) and broadcast.
  // Make sure Privy is configured/authorized to sign on behalf of the user's wallet (the wallet id passed below).
  const res = await privyClient
    .wallets()
    .solana()
    .signAndSendTransaction("beshnarmht79p18zxfpw8ue1", {
      // your privy wallet id / session
      caip2: "solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1", // devnet
      transaction: new Uint8Array(encoded), // partially-signed tx
      authorization_context: {
        // Privy side: this must permit Privy to sign the wallet's signature(s).
        // You may need to include keys/other auth the Privy API expects for this wallet.
        authorization_private_keys: [env.PRIVY_QUORUM_PRIV_KEY],
      },
    });

  const transactionHash = res.hash;
  return NextResponse.json({ transactionHash });
};

export { POST };
