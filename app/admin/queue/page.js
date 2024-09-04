"use client";

import { useState, useEffect } from "react";
import supabase from "../../utils/supabase";
import Card from "../../components/admin/AdminQueueCard";
import { useUser } from "@clerk/nextjs";

export default function QueuePage({ params }) {
  const [payments, setPayments] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [paymentsLoading, setPaymentsLoading] = useState(true);
  const [withdrawalsLoading, setWithdrawalsLoading] = useState(true);

  const userID = params.user;
  const { isSignedIn, user } = useUser();

  const client = supabase();

  useEffect(() => {
    const fetchPayments = async () => {
      const { data } = await client.from("payments").select().eq("type", true);

      setPayments(data);
      setPaymentsLoading(false);
    };
    const fetchWithdrawals = async () => {
      const { data } = await client.from("payments").select().eq("type", false);

      setWithdrawals(data);
      setWithdrawalsLoading(false);
    };

    if (withdrawalsLoading && paymentsLoading) {
      fetchPayments();
      fetchWithdrawals();
    }
  });

  if (!withdrawalsLoading && !paymentsLoading) {
    let queue = [];
    if (payments != null) {
      payments.forEach((payment) => {
        queue.push(payment);
      });
    }

    if (withdrawals != null) {
      withdrawals.forEach((withdrawal) => {
        queue.push(withdrawal);
      });
    }

    console.log("queue", queue);

    queue.sort((a, b) => {
      if (a.created_at < b.created_at) {
        return -1;
      }
      if (a.created_at < b.created_at) {
        return 1;
      }
      return 0;
    });

    if (isSignedIn && user.publicMetadata.role === "admin") {
      return (
        <div className="flex flex-wrap justify-center ">
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
