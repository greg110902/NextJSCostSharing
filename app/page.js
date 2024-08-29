"use client";

import Card from "./components/transactions/Card";
import { useEffect, useState } from "react";
import supabase from "./utils/supabase";

function getTransactions() {}

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      const client = supabase();
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
        <button
          className="btn"
          onClick={() => document.getElementById("my_modal_2").showModal()}
        >
          open modal
        </button>
        <dialog id="my_modal_2" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Hello!</h3>
            <p className="py-4">Press ESC key or click outside to close</p>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
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
