"use client";

import Card from "./components/transactions/Card";
import { useEffect, useState } from "react";
import supabase from "./utils/supabase";
import PayerForm from "./components/transaction/payerForm";
import { SignedIn, useUser } from "@clerk/nextjs";
import NotAllSignedUp from "./components/transactions/notHouseSignedUp";
import { useRouter } from "next/navigation";
//import { currentUser } from "@clerk/nextjs";

function userIDToName(userID, users) {
  const u = users.map((user) => {
    if (user.id === userID) {
      return user.firstName;
    }
  });

  const filter = u.filter((us) => us);

  return filter[0];
}

async function addUser(user) {
  const client = supabase();
  const { error } = await client
    .from("users")
    .upsert({ id: String(user.id), firstName: user.firstName })
    .select();
}

async function submitForm(everyoneChecked, user, users) {
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
    let ids = [];
    users.forEach((element) => {
      ids.push(element.id);
    });
    console.log(ids);
    checked = ids;
  }
  const { error } = await client.from("transactions").insert({
    author: user.id,
    affecting: checked,
    amount: amount,
    title: title,
  });
  if (error) {
    console.log(error);
  }
  location.reload();
}

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [everyoneChecked, setEveryoneChecked] = useState(true);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const { isSignedIn, user } = useUser();

  const client = supabase();

  if (isSignedIn) {
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
    const fetchUsers = async () => {
      const { data } = await client.from("users").select();
      setUsers(await data);
    };
    if (loading) {
      fetchTransactions();
      fetchUsers();
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  } else if (isSignedIn) {
    return (
      <div>
        <div className="flex justify-center">
          {users.length > 7 ? (
            <NotAllSignedUp />
          ) : (
            <label id="modalButton" htmlFor="my_modal_7" className="btn">
              Submit transaction
            </label>
          )}
        </div>

        <input type="checkbox" id="my_modal_7" className="modal-toggle" />
        <div className="modal bg-slate-100" role="dialog">
          <div className="modal-box bg-slate-100">
            <h3 className="font-bold text-lg">Add transaction</h3>
            <form
              id="transactionForm"
              onSubmit={(e) => {
                e.preventDefault;
                submitForm(everyoneChecked, user, users);
              }}
            >
              <div className="m-1">
                <label className="m-1 text-black">Author</label>
                <input
                  id="author"
                  disabled
                  className="bg-slate-300 rounded flex flex-1 float-right"
                  defaultValue={user.firstName}
                ></input>
              </div>
              <div className="m-1">
                <label className="m-1 text-black">Title</label>
                <input
                  id="title"
                  className="bg-slate-300 text-black rounded float-right"
                ></input>
              </div>
              <div className="m-1">
                <label className="m-1 text-black">Amount</label>
                <input
                  type="number"
                  id="amount"
                  className="bg-slate-300 text-black rounded float-right"
                ></input>
              </div>
              <div className="m-1">
                <label className=" text-black">Everyone paying</label>
                <input
                  type="checkbox"
                  defaultChecked={everyoneChecked}
                  onClick={() => setEveryoneChecked(!everyoneChecked)}
                  className="checkbox align-middle mx-3"
                />
                {!everyoneChecked ? <PayerForm currentID={user.id} /> : <></>}
              </div>
              <div className="modal-action">
                <button className="btn" type="submit" htmlFor="my_modal_7">
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
                  author={userIDToName(transaction["author"], users)}
                  affected={transaction["affecting"]}
                  amount={transaction["amount"]}
                  title={transaction["title"]}
                  date={Date(transaction["created_at"]).toLocaleString(
                    "en-uk",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
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
