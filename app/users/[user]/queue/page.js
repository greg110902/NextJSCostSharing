"use client";

import { useState, useEffect } from "react";
import supabase from "../../../utils/supabase";
import Card from "../../../components/userpage/queue/Card";

export default function QueuePage({ params }) {
  // Initialise the payments, withdrawals and loading states.
  // TODO: combine withdrawals and payments into one variable
  const [payments, setPayments] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [paymentsLoading, setPaymentsLoading] = useState(true);
  const [withdrawalsLoading, setWithdrawalsLoading] = useState(true);

  // Get the user ID from the url slug
  const userID = params.user;

  // Initialise database client
  const client = supabase();

  // UseEffect runs on page refresh
  useEffect(() => {
    const fetchPayments = async () => {
      // Select data from the database where it has been created by the user and is payment type
      const { data } = await client
        .from("payments")
        .select()
        .eq("author", userID)
        .eq("type", true);

      // Set payments to the received array and set the payments loading to false
      setPayments(data);
      setPaymentsLoading(false);
    };
    const fetchWithdrawals = async () => {
      // Select data from the database where it has been created by the user and is withdrawal type
      const { data } = await client
        .from("payments")
        .select()
        .eq("author", userID)
        .eq("type", false);

      // Set withdrawals to the received array and set the withdrawals loading to false
      setWithdrawals(data);
      setWithdrawalsLoading(false);
    };

    if (withdrawalsLoading && paymentsLoading) {
      // Run if the withdrawals and payments are loading.
      fetchPayments();
      fetchWithdrawals();
    }
  });

  if (!withdrawalsLoading && !paymentsLoading) {
    // Run when the withdrawals and payments have finished loading.
    // Initialise queue array
    let queue = [];

    // Run if there are any payments by the author in the database
    if (payments != null) {
      // Loop over the payments and add them to the queue.
      payments.forEach((payment) => {
        queue.push(payment);
      });
    }

    // Run if there are any withdrawals by the author in the database
    if (withdrawals != null) {
      withdrawals.forEach((withdrawal) => {
        // Loop over the withdrawals and add them to the queue.
        queue.push(withdrawal);
      });
    }

    // Sort the queue by date
    // TODO: in future, remove this, sort when requesting from the database client
    // using .order(...), and then use the type field to determine the type
    queue.sort((a, b) => {
      if (a.created_at < b.created_at) {
        return -1;
      }
      if (a.created_at < b.created_at) {
        return 1;
      }
      return 0;
    });

    return (
      <div>
        {/* Add a back to user button */}
        <a className="btn m-3" href={`/users/${userID}`}>
          Back
        </a>
        <div>
          <div className="flex flex-wrap justify-center ">
            {/* Map the payments and withdrawals in the queue 
            to cards. */}
            {queue.map((element) => {
              return (
                <Card
                  ID={element.id}
                  author={element.author}
                  amount={element.amount}
                  date={element.created_at}
                  type={element.type}
                  status={element.status}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  } else {
    // Return loading if the page is still loading
    return <div>Loading...</div>;
  }
}

export const runtime = "edge";
