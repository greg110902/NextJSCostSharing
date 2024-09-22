"use client";

import { useEffect, useState } from "react";
import supabase from "../../utils/supabase";
import EditPayerForm from "../transaction/editPayerForm";

function userIDToName(userID, users) {
  // Looks up the ID and returns their first name
  const u = users.map((user) => {
    if (user.id === userID) {
      return user.firstName;
    }
  });

  const filter = u.filter((us) => us);

  return filter[0];
}

async function reportTransaction(transactionID, userID, report, affected) {
  const client = supabase();

  let newReport;

  if (report === null) {
    newReport = [userID];
  } else {
    newReport = report;
    newReport.push(userID);
  }

  const { error } = await client
    .from("transactions")
    .update({ reportedBy: newReport })
    .eq("id", transactionID);

  if (affected.length === 7) {
    if (newReport.length === 4) {
      const { error } = await client
        .from("transactions")
        .update({ valid: false })
        .eq("id", transactionID);
    }
  } else {
    if (newReport.length === affected.length) {
      const { error } = await client
        .from("transactions")
        .update({ valid: false })
        .eq("id", transactionID);
    }
  }

  location.reload();
}

async function cancelReport(transactionID, userID, report, affected) {
  let newReport = [];

  report.forEach((user) => {
    if (user != userID) {
      newReport.push(user);
    }
  });

  const client = supabase();

  const { error } = await client
    .from("transactions")
    .update({ reportedBy: newReport })
    .eq("id", transactionID);

  if (affected.length === 7) {
    if (newReport.length != 4) {
      const { error } = await client
        .from("transactions")
        .update({ valid: true })
        .eq("id", transactionID);
    }
  } else {
    if (newReport.length != affected.length) {
      const { error } = await client
        .from("transactions")
        .update({ valid: true })
        .eq("id", transactionID);
    }
  }

  location.reload();
}

async function deleteTransaction(transactionID) {
  const client = supabase();

  const { error } = await client
    .from("transactions")
    .delete()
    .eq("id", transactionID);

  location.reload();
}

async function submitForm(userID, users, transactionID) {
  // Get the relevant input field values
  let title = document.getElementById("edit-title").value;
  let amount = Number(document.getElementById("edit-amount").value);
  let everyoneChecked = document.getElementById("edit-allchecked").checked;

  // Initialise database client
  const client = supabase();

  // Initialise array to store users affected by a transaction
  let checked = [];

  if (!everyoneChecked) {
    // Runs if transaction only affects a subset of the house
    var payers = document.getElementsByName(`payerCheckbox-${transactionID}`);
    for (const payer of payers) {
      // Loops over the user checkboxes on the form
      if (payer.checked) {
        // If the user is selected, add their ID to the checked array
        checked.push(payer.id);
        console.log("pushing", payer.id);
      }
    }
  } else if (everyoneChecked) {
    // if everyone is selected
    let ids = [];
    users.forEach((element) => {
      // Add everyone's ID to the array
      console.log("user", element.firstName);
      ids.push(element.id);
    });
    checked = ids;
  }

  console.log("after code", checked);

  // Insert the transaction to the database
  const { error } = await client
    .from("transactions")
    .update({
      author: userID,
      affecting: checked,
      amount: amount,
      title: title,
    })
    .eq("id", transactionID);
  if (error) {
    console.log(error);
  }
  // Reload the page so it shows, as UseEffect runs on refresh
  location.reload();
}

export default function Card({
  transactionID,
  author,
  authorID,
  affected,
  amount,
  title,
  date,
  userID,
  allChecked,
  reportedBy,
}) {
  // Initialise states
  const [users, setUsers] = useState([]);
  const [everyoneChecked, setEveryoneChecked] = useState(allChecked);

  // Initialise database client
  const client = supabase();

  useEffect(() => {
    // Runs on page refresh
    const fetchUsers = async () => {
      const { data } = await client.from("users").select();
      setUsers(data);
    };

    fetchUsers();
  }, []);

  console.log("affecting", affected);

  let reports;
  if (reportedBy === null) {
    reports = [];
  } else {
    reports = reportedBy;
  }

  return (
    <div>
      <dialog id="delete_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">This action cannot be undone.</h3>
          <p className="py-4">Confirm delete or click away to close.</p>
          <div className="flex justify-center">
            <button
              className="btn"
              onClick={(e) => {
                e.preventDefault();
                deleteTransaction(transactionID);
              }}
            >
              Delete
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>Delete</button>
        </form>
      </dialog>

      <dialog id="report_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Report transaction</h3>
          <p className="py-4">
            Reporting a transaction only takes effect when 4 users in the house
            agree, or for smaller transactions when everyone affected agrees.
            Click off of the box to cancel.
          </p>
          <div className="flex justify-center">
            <button
              className="btn"
              onClick={(e) => {
                e.preventDefault();
                reportTransaction(transactionID, userID, reportedBy, affected);
              }}
            >
              Report
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>Report</button>
        </form>
      </dialog>

      <dialog id="cancel_report_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Cancel report</h3>
          <p className="py-4">
            Reporting a transaction only takes effect when 4 users in the house
            agree. Click off of the box to cancel.
          </p>
          <div className="flex justify-center">
            <button
              className="btn"
              onClick={(e) => {
                e.preventDefault();
                cancelReport(transactionID, userID, reportedBy, affected);
              }}
            >
              Report
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>Report</button>
        </form>
      </dialog>

      <dialog id="edit_modal" className="modal">
        <div className="modal-box bg-slate-100">
          <h3 className="font-bold text-lg">Add transaction</h3>
          <form
            id="transactionForm"
            onSubmit={(e) => {
              // Prevent the default action (because of iOS)
              e.preventDefault();
              submitForm(userID, users, transactionID);
            }}
          >
            <div className="m-1">
              <label className="m-1 text-black">Author</label>
              <input
                id="edit-author"
                disabled
                className="bg-slate-300 rounded flex flex-1 float-right"
                defaultValue={author}
              ></input>
            </div>
            <div className="m-1">
              <label className="m-1 text-black">Title</label>
              <input
                id="edit-title"
                className="bg-slate-300 text-black rounded float-right"
                defaultValue={title}
              ></input>
            </div>
            <div className="m-1">
              <label className="m-1 text-black">Amount</label>
              <input
                type="number"
                step={0.01}
                id="edit-amount"
                className="bg-slate-300 text-black rounded float-right"
                defaultValue={amount}
              ></input>
            </div>
            <div className="m-1">
              <label className=" text-black">Everyone paying</label>
              <input
                type="checkbox"
                id="edit-allchecked"
                defaultChecked={everyoneChecked}
                onClick={() => setEveryoneChecked(!everyoneChecked)}
                className="checkbox align-middle mx-3"
              />
              {/* Show an additional form if the user is selecting a subset of the house */}
              {!everyoneChecked ? (
                <EditPayerForm
                  currentID={authorID}
                  affecting={affected}
                  transactionID={transactionID}
                />
              ) : (
                <></>
              )}
            </div>
            <div className="modal-action">
              {/* Button submits the form and hides the modal. */}
              <button className="btn" type="submit" htmlFor="my_modal_7">
                Submit
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      <div className="card bg-slate-100 w-3/4 shadow-xl m-10 hover:bg-gray-100 hover:scale-105 flex justify-center">
        {/* Returns a DaisyUI card component which shows transaction details */}
        <div className="card-body">
          <div className="card-title flex justify-between">
            <h2 className="text-slate-900">{title}</h2>
            <div className="dropdown dropdown-right">
              <div
                tabIndex={0}
                role="button"
                className="btn rounded-full m-1 bg-transparent"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                  tabIndex={0}
                  role="button"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
                  />
                </svg>
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-transparent border-transparent z-[1] p-2 w-auto"
              >
                {!reports.includes(userID) ? (
                  <li>
                    <a
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById("report_modal").showModal();
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5"
                        />
                      </svg>
                    </a>
                  </li>
                ) : (
                  <li>
                    <a
                      onClick={(e) => {
                        e.preventDefault();
                        document
                          .getElementById("cancel_report_modal")
                          .showModal();
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-6"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 2.25a.75.75 0 0 1 .75.75v.54l1.838-.46a9.75 9.75 0 0 1 6.725.738l.108.054A8.25 8.25 0 0 0 18 4.524l3.11-.732a.75.75 0 0 1 .917.81 47.784 47.784 0 0 0 .005 10.337.75.75 0 0 1-.574.812l-3.114.733a9.75 9.75 0 0 1-6.594-.77l-.108-.054a8.25 8.25 0 0 0-5.69-.625l-2.202.55V21a.75.75 0 0 1-1.5 0V3A.75.75 0 0 1 3 2.25Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                  </li>
                )}

                {userID === authorID ? (
                  <li>
                    <a
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById("delete_modal").showModal();
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                    </a>
                  </li>
                ) : (
                  <></>
                )}
                {userID === authorID ? (
                  <li>
                    <a
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById("edit_modal").showModal();
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                        />
                      </svg>
                    </a>
                  </li>
                ) : (
                  <></>
                )}
              </ul>
            </div>
          </div>
          <div className="text-slate-900">Submitted by: {author}</div>
          <div className="text-slate-900">Amount: £{amount}</div>
          <div className="text-slate-900">
            {" "}
            Affecting:{" "}
            {affected.map((person) => {
              return " " + userIDToName(person, users);
            })}
          </div>
          <div className="text-slate-900">On: {date}</div>
        </div>
      </div>
    </div>
  );
}
