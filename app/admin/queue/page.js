"use client";

import { useState, useEffect } from "react";
import supabase from "../../utils/supabase";
import Card from "../../components/admin/AdminQueueCard";
import { useUser } from "@clerk/nextjs";

export default function QueuePage() {
  // Define the variable and loading states
  const [payments, setPayments] = useState([]);
  const [paymentsLoading, setPaymentsLoading] = useState(true);
  const [all, setAll] = useState(false);

  // Initialise the user
  const { isSignedIn, user } = useUser();

  // Initialise the database client
  const client = supabase();

  // UseEffect runs on page reload
  useEffect(() => {
    const fetchPayments = async () => {
      // Order and then select the payments
      const { data } = await client
        .from("payments")
        .select()
        .order("created_at", { ascending: false });

      // Set the data state and set the loading to false
      setPayments(data);
      setPaymentsLoading(false);
    };

    if (paymentsLoading) {
      fetchPayments();
    }
  });

  // Initialise queue array
  let queue = [];

  const onChange = (e) => {
    // When toggle is selected, change the variable which controls
    // whether all payments are visible to the toggle value
    setAll(e.target.checked);
  };

  // Run if the user is signed in and the user is an admin
  if (isSignedIn && user.publicMetadata.role === "admin") {
    // Run if the payments have finished loading
    if (!paymentsLoading) {
      // Run if the toggle is set to all
      if (all) {
        // Loop over all of the payments and add to the queue
        payments.forEach((payment) => {
          queue.push(payment);
        });
      } else {
        // If the toggle is not set to all, loop over all of the
        // payments and add those which have new=true
        payments.forEach((payment) => {
          if (payment.new === true) {
            queue.push(payment);
          }
        });
      }
      // Return the component
      return (
        <div className="flex flex-wrap justify-center ">
          <div className="flex">
            <label className="mx-5">Show all</label>
            {/* Create the all/only new payments toggle */}
            <input
              type="checkbox"
              className="toggle"
              onChange={(e) => {
                onChange(e);
              }}
            />
          </div>

          {/* Map over the payments in the queue. Generate a card for each. */}
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
      );
    } else {
      {
        /* if the user is not an admin, return not allowed */
      }
      return <>You do not have permission to view this page.</>;
    }
  } else {
    {
      /* If the page is still loading, return loading screen */
    }
    return <div>Loading...</div>;
  }
}

export const runtime = "edge";
