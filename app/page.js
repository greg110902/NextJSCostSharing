"use client";

import Card from "./components/transactions/Card";
import { useEffect, useState } from "react";
import supabase from "./utils/supabase";

function submitTransaction() {}

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
        <div className="flex justify-center">
          <button
            className="btn flex justify-center m-5"
            onClick={() => document.getElementById("my_modal_2").showModal()}
          >
            Add transaction
          </button>
        </div>
        <dialog id="my_modal_2" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Add transaction</h3>
            <form onSubmit={submitTransaction()}>
              <label className="m-1">Author</label>
              <input></input>
              <label className="m-1">Title</label>
              <input></input>
              <label className="m-1">Amount</label>
              <input type="number"></input>
              <div className="flex justify-center">
                <button className="flex justify-center">Submit</button>
              </div>
            </form>
            <p className="py-4">Click outside to close</p>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
        <h1>Transactions</h1>
        <div className="flex justify-center">
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
