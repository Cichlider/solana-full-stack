import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { program, counterPDA } from "../anchor/setup";

export default function IncrementButton() {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    if (!publicKey) {
      alert("Please connect your wallet first!");
      return;
    }

    setIsLoading(true);

    try {
      const transaction = await program.methods
        .increment()
        .accounts({
          counter: counterPDA,
        })
        .transaction();

      const signature = await sendTransaction(transaction, connection);
      
      await connection.confirmTransaction(signature, "confirmed");

      console.log(
        `✅ Success! View on explorer: https://explorer.solana.com/tx/${signature}?cluster=devnet`
      );
    } catch (error) {
      console.error("Transaction failed:", error);
      alert("Transaction failed! Check console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={!publicKey || isLoading}
      style={{
        padding: "10px 20px",
        fontSize: "16px",
        cursor: publicKey && !isLoading ? "pointer" : "not-allowed",
        opacity: publicKey && !isLoading ? 1 : 0.5,
      }}
    >
      {isLoading ? "Loading..." : "Increment"}
    </button>
  );
}