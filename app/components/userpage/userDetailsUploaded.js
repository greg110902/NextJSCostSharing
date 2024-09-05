"use client";
import supabase from "../../utils/supabase";
import { useState, useEffect } from "react";

async function getUserAccount(user) {
  const client = supabase();
  const id = user.id;

  const { data, error } = await client
    .from("users")
    .select("account_no")
    .eq("id", id);

  return await data[0];
}

async function onSubmit(user) {
  const client = supabase();
  const id = user.id;
  const amount = document.getElementById("withdrawal_amount").value;

  const { error } = await client
    .from("payments")
    .insert({ amount: amount, status: "Pending", author: id, type: false });
}

export default function UserDetailsUploaded({ user, maxAmount }) {
  const [userAccount, setUserAccount] = useState([]);
  const [userAccountLoading, setUserAccountLoading] = useState(true);

  useEffect(() => {
    const fetchAccount = async () => {
      const data = await getUserAccount(user);
      setUserAccount(data);
      setUserAccountLoading(false);
    };

    if (userAccountLoading) {
      fetchAccount();
    }
  });

  try {
    document
      .getElementById("submit")
      .addEventListener("click", function (event) {
        event.preventDefault();

        onSubmit(user);
        location.reload();
      });
  } catch {
    console.log("not loaded yet");
  }

  if (userAccount.account_no === null) {
    return (
      <div className="my-3 text-red-800">
        Upload your bank details to submit withdrawal requests.
      </div>
    );
  } else {
    return (
      <div>
        <form id="transactionForm" onSubmit={() => onSubmit(user)}>
          <div className="m-1">
            <label className="m-1 text-black">User</label>
            <input
              id="author"
              disabled
              className="bg-slate-300 rounded flex flex-1 float-right"
              defaultValue={user.firstName}
            ></input>
          </div>
          <div className="m-1">
            <label className="m-1 text-black">Amount</label>
            <input
              type="number"
              min={1}
              step={0.01}
              max={maxAmount}
              id="withdrawal_amount"
              className="bg-slate-300 text-black rounded float-right"
            ></input>
          </div>
          <div className="modal-action">
            <button className="btn" id="submit" htmlFor="modal_2" type="submit">
              Submit
            </button>
          </div>
        </form>
      </div>
    );
  }
}
