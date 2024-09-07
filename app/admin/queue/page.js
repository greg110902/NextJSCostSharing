"use client";

import { useState, useEffect } from "react";
import supabase from "../../utils/supabase";
import Card from "../../components/admin/AdminQueueCard";
import { useUser } from "@clerk/nextjs";

export default function QueuePage() {
  const [payments, setPayments] = useState([]);
  const [paymentsLoading, setPaymentsLoading] = useState(true);
  const [all, setAll] = useState(true);

  const { isSignedIn, user } = useUser();

  const client = supabase();

  useEffect(() => {
    const fetchPayments = async () => {
      const { data } = await client.from("payments").select();

      setPayments(data);
      setPaymentsLoading(false);
    };

    if (paymentsLoading) {
      fetchPayments();
    }
  });

  let queue = [];

  if (!paymentsLoading) {
    if (all) {
      payments.forEach((payment) => {
        queue.push(payment);
      });
    } else {
      payments.forEach((payment) => {
        if (payment.new === true) {
          queue.push(payment);
        }
      });
    }
    console.log("QUEUE", queue);
    if (isSignedIn && user.publicMetadata.role === "admin") {
      return (
        <div className="flex flex-wrap justify-center ">
          <input type="checkbox" className="toggle" />
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
      return <>You do not have permission to view this page.</>;
    }
  } else {
    return <div>Loading...</div>;
  }
}

export const runtime = "edge";
