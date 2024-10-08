"use client";

import Card from "./components/transactions/Card";
import { useEffect, useState } from "react";
import supabase from "./utils/supabase";
import PayerForm from "./components/transaction/payerForm";
import { useUser } from "@clerk/nextjs";
import NotAllSignedUp from "./components/transactions/notHouseSignedUp";

function userIDToName(userID, users) {
  // Converts an ID to their first name, as stored in the database

  const u = users.map((user) => {
    if (user.id === userID) {
      // if the user id matches a user id in the database, return the
      // first name corresponding to the id.
      return user.firstName;
    }
  });

  const filter = u.filter((us) => us);

  return filter[0];
}

async function addUser(user) {
  // Adds a new user to the users database, if their id doesn't
  // already exist.
  const client = supabase();
  const { error } = await client
    .from("users")
    .upsert({ id: String(user.id), firstName: user.firstName })
    .select();
}

async function submitForm(everyoneChecked, user, users) {
  // Get the relevant input field values
  let title = document.getElementById("title").value;
  let amount = document.getElementById("amount").value;

  // Initialise database client
  const client = supabase();

  // Initialise array to store users affected by a transaction
  let checked = [];

  if (!everyoneChecked) {
    // Runs if transaction only affects a subset of the house
    var payers = document.getElementsByName("payerCheckbox");
    for (const payer of payers) {
      // Loops over the user checkboxes on the form
      if (payer.checked) {
        // If the user is selected, add their ID to the checked array
        checked.push(payer.id);
      }
    }
  } else {
    // if everyone is selected
    let ids = [];
    users.forEach((element) => {
      // Add everyone's ID to the array
      ids.push(element.id);
    });
    checked = ids;
  }

  // Insert the transaction to the database
  const { error } = await client.from("transactions").insert({
    author: user.id,
    affecting: checked,
    amount: amount,
    title: title,
  });
  if (error) {
    console.log(error);
  }
  // Reload the page so it shows, as UseEffect runs on refresh
  location.reload();
}

export default function Home() {
  // Initialise states
  const [list, setTransactions] = useState([]);
  const [everyoneChecked, setEveryoneChecked] = useState(true);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [showValid, setShowValid] = useState(false);

  // Get the current user
  const { isSignedIn, user } = useUser();

  // Initialise the database client
  const client = supabase();

  const onChangeAll = (e) => {
    setShowAll(!e.target.checked);
  };
  const onChangeValid = (e) => {
    setShowValid(e.target.checked);
  };

  if (isSignedIn) {
    // Add the user everytime they open the page, because if they
    // already exist nothing will change
    addUser(user, client);
  }

  useEffect(() => {
    // Runs on refresh

    const fetchTransactions = async () => {
      // Select all of the transactions, ordered by creation date.
      const { data } = await client
        .from("transactions")
        .select()
        .order("created_at", { ascending: false });

      // Set transactions variable to received data and the loading to false
      setTransactions(await data);
      setLoading(false);
    };
    const fetchUsers = async () => {
      // Select all users on the database
      const { data } = await client.from("users").select();
      setUsers(await data);
    };
    if (loading) {
      fetchTransactions();
      fetchUsers();
    }
  }, []);

  if (loading) {
    // If the page is loading, show loading screen
    return <div>Loading...</div>;
  } else if (isSignedIn) {
    // If the user is signed in
    let transactions = [];
    list.forEach((transaction) => {
      if (showAll) {
        transactions.push(transaction);
      } else if (
        transaction.author === user.id ||
        transaction.affecting.includes(user.id)
      ) {
        transactions.push(transaction);
      }
    });
    return (
      <div>
        <div className="flex flex-col justify-center">
          {/* Show the submit transaction button if and only if the number of users in
          the database is 7, meaning that everyone has signed up. */}
          {users.length != 7 ? (
            <div className="flex bordered rounded-lg bg-slate-100 text-black p-3 my-3">
              Not all users signed up yet. Checking &quot;everyone&quot; will
              only affect:
              {users.map((user) => {
                return `${user.firstName} `;
              })}
            </div>
          ) : (
            <></>
          )}
          <div className="flex justify-between">
            <label id="modalButton" htmlFor="my_modal_7" className="btn">
              Submit transaction
            </label>
            <details className="dropdown dropdown-bottom dropdown-end">
              <summary className="btn m-1">Filters</summary>
              <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                <li>
                  <div>
                    <label>Only transactions which affect me?</label>
                    <input
                      type="checkbox"
                      className="toggle"
                      onChange={(e) => onChangeAll(e)}
                      defaultChecked
                    />
                  </div>
                  <div>
                    <label>Show invalid transactions?</label>
                    <input
                      type="checkbox"
                      className="toggle"
                      onChange={(e) => onChangeValid(e)}
                    />
                  </div>
                </li>
              </ul>
            </details>
          </div>
        </div>

        {/* Submit transaction form is hidden behind a modal, so a dialogue shows
        when they select "Submit Transaction" with the required form. Clicking outside
        of the modal hides the form.*/}
        <input type="checkbox" id="my_modal_7" className="modal-toggle" />
        <div className="modal bg-slate-100" role="dialog">
          <div className="modal-box bg-slate-100">
            <h3 className="font-bold text-lg">Add transaction</h3>
            <form
              id="transactionForm"
              onSubmit={(e) => {
                // Prevent the default action (because of iOS)
                e.preventDefault();
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
                  step={0.01}
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
                {/* Show an additional form if the user is selecting a subset of the house */}
                {!everyoneChecked ? <PayerForm currentID={user.id} /> : <></>}
              </div>
              <div className="modal-action">
                {/* Button submits the form and hides the modal. */}
                <button className="btn" type="submit" htmlFor="my_modal_7">
                  Submit
                </button>
              </div>
            </form>
          </div>
          {/* Hides the modal when someone clicks off of it */}
          <label className="modal-backdrop" htmlFor="my_modal_7"></label>
        </div>

        <div>
          {/* Greet the user */}
          <h1>Hello, {user?.firstName}</h1>
          <div className="flex justify-center flex-wrap">
            {/* Map over the transactions, show a card for each */}
            {transactions.map((transaction) => {
              const date = new Date(transaction["created_at"]).toLocaleString(
                "en-GB"
              );
              if (transaction.valid || showValid) {
                return (
                  <Card
                    transactionID={transaction["id"]}
                    author={userIDToName(transaction["author"], users)}
                    affected={transaction["affecting"]}
                    amount={transaction["amount"]}
                    title={transaction["title"]}
                    date={date}
                    userID={user.id}
                    authorID={transaction["author"]}
                    allChecked={
                      transaction["affecting"].length === 7 ? true : false
                    }
                    reportedBy={transaction["reportedBy"]}
                  />
                );
              }
            })}
          </div>
        </div>
      </div>
    );
  }
}
export const runtime = "edge";
