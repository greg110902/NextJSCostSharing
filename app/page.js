"use client";

import Card from "./components/transactions/Card";
import { useEffect, useState } from "react";
import supabase from "./utils/supabase";

function getTransactions() {}

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const client = supabase();

  useEffect(() => {
    const fetchTransactions = async () => {
      const { data } = await client.from("transactions").select();
      setTransactions(await data);
      setLoading(false);
    };
    if (loading) {
      fetchTransactions();
    }
  }, []);

  console.log("Transactions", transactions);

  if (loading) {
    return <div>Loading...</div>;
  } else {
    return (
      <div>
        <h1>Transactions</h1>
        <div>
          {transactions.map((transaction) => {
            return (
              <Card
                transactionID={transaction["id"]}
                author={transaction["author"]}
                affected={transaction["affecting"]}
                amount={transaction["amount"]}
                title={transaction["title"]}
                date={transaction["created_at"]}
              />
            );
          })}
        </div>
        <div>{JSON.stringify(transactions)}</div>
      </div>
    );
  }
}
