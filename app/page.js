"use client";

import Card from "./components/transactions/Card";
import { useEffect, useState } from "react";
import supabase from "./utils/supabase";
import PayerForm from "./components/transaction/payerForm";
import { SignedIn, useUser } from "@clerk/nextjs";
//import { currentUser } from "@clerk/nextjs";

function newID(transactions) {
  var IDs = [];
  transactions.map((transaction) => {
    IDs.push(transaction["id"]);
  });

  return Math.max(...IDs) + 1;
}

async function addUser(user, client) {
  const { error } = await client
    .from("users")
    .upsert({ id: String(user.id), firstName: user.firstName })
    .select();
  console.log(await error);
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

  const { isSignedIn, user } = useUser();

  const client = supabase();

  if (isSignedIn) {
    console.log("ADDING USER", user.firstName);
    addUser(user, client);
  }

  useEffect(() => {
    const fetchTransactions = async () => {
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
  } else if (isSignedIn) {
    return (
      <div>
        <div className="flex justify-center">
          <label htmlFor="my_modal_7" className="btn">
            Submit transaction
          </label>
        </div>

        <input type="checkbox" id="my_modal_7" className="modal-toggle" />
        <div className="modal bg-slate-100" role="dialog">
          <div className="modal-box bg-slate-100">
            <h3 className="font-bold text-lg">Add transaction</h3>
            <form
              id="transactionForm"
              onSubmit={() => submitForm(transactions, everyoneChecked)}
            >
              <div className="m-1">
                <label className="m-1 text-black">Author</label>
                <input
                  id="author"
                  disabled
                  className="bg-slate-300 rounded"
                  defaultValue={user.firstName}
                ></input>
              </div>
              <div className="m-1">
                <label className="m-1 text-black">Title</label>
                <input id="title" className="bg-slate-300 rounded"></input>
              </div>
              <div className="m-1">
                <label className="m-1 text-black">Amount</label>
                <input
                  type="number"
                  id="amount"
                  className="bg-slate-300 rounded"
                ></input>
              </div>
              <div className="m-1">
                <label className=" text-black">Everyone paying</label>
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

        <div>
          <h1>Hello, {user?.firstName}</h1>
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
export const runtime = "edge";
