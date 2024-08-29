"use client";

import Card from "./components/transactions/Card";
import { useEffect, useState } from "react";
import supabase from "./utils/supabase";
import PayerForm from "./components/transaction/payerForm";

function newID(transactions) {
  var IDs = [];
  transactions.map((transaction) => {
    IDs.push(transaction["id"]);
  });

  return Math.max(...IDs) + 1;
}

async function submitForm(transactions, everyoneChecked) {
  let author = document.getElementById("author").value;
  let title = document.getElementById("title").value;
  let amount = document.getElementById("amount").value;

  const client = supabase();

  let checked = [];

  if (!everyoneChecked) {
    var payers = document.getElementsByName("payerCheckbox");
    for (const payer of payers) {
      if (payer.checked) {
        checked.push(payer.id);
      }
    }
  } else {
    checked = ["Everyone"];
  }

  const { error } = await client.from("transactions").insert({
    id: newID(transactions),
    author: author,
    affecting: checked,
    amount: amount,
    title: title,
  });
}

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [everyoneChecked, setEveryoneChecked] = useState(true);
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
              onSubmit={() => submitForm(transactions, everyoneChecked)}
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
              <div className="m-1">
                <label>Everyone paying</label>
                <input
                  type="checkbox"
                  defaultChecked={everyoneChecked}
                  onClick={() => setEveryoneChecked(!everyoneChecked)}
                  className="checkbox justify-center"
                />
                {!everyoneChecked ? <PayerForm /> : <></>}
              </div>
              <div className="modal-action">
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
export const runtime = "experimental-edge";
