"use client";

import Card from "./components/transactions/Card";
import { useEffect, useState } from "react";
import supabase from "./utils/supabase";

function newID(transactions) {
  var IDs = [];
  transactions.map((transaction) => {
    IDs.push(transaction["id"]);
  });

  return Math.max(...IDs) + 1;
}

async function submitForm(transactions) {
  let author = document.getElementById("author").value;
  let title = document.getElementById("title").value;
  let amount = document.getElementById("amount").value;

  const client = supabase();

  console.log(newID(transactions));

  const { error } = await client.from("transactions").insert({
    id: newID(transactions),
    author: author,
    affecting: ["harry", "alex", "leo"],
    amount: amount,
    title: title,
  });

  console.log(await error);
}

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      const client = supabase();
      const { data } = await client
        .from("transactions")
        .select()
        .order("created_at", { ascending: false });
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
          <label htmlFor="my_modal_7" className="btn">
            Submit transaction
          </label>
        </div>

        <input type="checkbox" id="my_modal_7" className="modal-toggle" />
        <div className="modal" role="dialog">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Add transaction</h3>
            <form
              id="transactionForm"
              onSubmit={() => submitForm(transactions)}
            >
              <div>
                <label className="m-1">Author</label>
                <input id="author"></input>
              </div>
              <div>
                <label className="m-1">Title</label>
                <input id="title"></input>
              </div>
              <div>
                <label className="m-1">Amount</label>
                <input type="number" id="amount"></input>
              </div>
              <div className="modal-action" onClick={console.log("working")}>
                <button className="btn" htmlFor="my_modal_7" type="submit">
                  Submit
                </button>
              </div>
            </form>
          </div>
          <label className="modal-backdrop" htmlFor="my_modal_7"></label>
        </div>

        <h1>Transactions</h1>
        <div>
          <div className="flex justify-center flex-wrap">
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
        </div>
      </div>
    );
  }
}
