import { Program, AnchorProvider } from "@coral-xyz/anchor";
import { PublicKey, clusterApiUrl, Connection, Keypair } from "@solana/web3.js";
import { Buffer } from "buffer";
import BN from "bn.js";
import idl from "./idl.json";

// 确保 Buffer 全局可用
if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
}

export interface CounterData {
  count: BN;
  bump: number;
}

const programId = new PublicKey("HpjTvLKu963kUo3LcxKNmFVYgBHDMGgxyDWV3ZHPNZv2");
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

const wallet = {
  publicKey: Keypair.generate().publicKey,
  signTransaction: async (tx: any) => tx,
  signAllTransactions: async (txs: any) => txs,
};

const provider = new AnchorProvider(connection, wallet as any, {
  commitment: "confirmed",
});

// 使用 idl 中的 address 或手动指定
const idlWithAddress = {
  ...idl,
  address: programId.toString(),
};

export const program = new Program(idlWithAddress as any, provider);

export const [counterPDA] = PublicKey.findProgramAddressSync(
  [Buffer.from("counter")],
  programId
);