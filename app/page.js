"use client";

import Image from "next/image";
import Card from "./components/transactions/Card";
import { useEffect, useState } from "react";

function getTransactions() {}

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      const { data } = await fetch(
        "https://gettransactions.gwgh1g21.workers.dev/"
      );
      setTransactions(await data);
      setLoading(false);
    };
    if (loading) {
      fetchTransactions();
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Transactions</h1>
      <div>
        <Card
          transactionID={1}
          author={"Greg"}
          affected={"Alivia"}
          amount={100}
          title={"Condoms"}
          date={"28/08/2024"}
        />
        <Card
          transactionID={1}
          author={"Greg"}
          affected={"Harry"}
          amount={100}
          title={"Peppers"}
          date={"28/08/2024"}
        />
      </div>
      <div>{JSON.stringify(transactions)}</div>
    </div>
  );
}
