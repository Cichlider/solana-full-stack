import { useEffect, useState } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { program, counterPDA } from "../anchor/setup";
import type { CounterData } from "../anchor/setup";

export default function CounterState() {
  const { connection } = useConnection();
  const [counterData, setCounterData] = useState<CounterData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 使用类型断言告诉 TS program.account.counter 存在
    (program.account as any).counter
      .fetch(counterPDA)
      .then((data: any) => {
        setCounterData(data as CounterData);
        setError(null);
      })
      .catch((err: any) => {
        console.error("Fetch error:", err);
        setError("Failed to fetch counter");
      });

    const subscriptionId = connection.onAccountChange(
      counterPDA,
      (accountInfo) => {
        try {
          const decoded = program.coder.accounts.decode(
            "counter",
            accountInfo.data
          );
          setCounterData(decoded as CounterData);
        } catch (err: any) {
          console.error("Decode error:", err);
        }
      }
    );

    return () => {
      connection.removeAccountChangeListener(subscriptionId);
    };
  }, [connection]);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!counterData) return <p>Loading...</p>;

  return (
    <p className="text-lg">
      Count: {counterData.count.toString()}
    </p>
  );
}