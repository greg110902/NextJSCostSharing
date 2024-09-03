"use client";

import supabase from "../../utils/supabase";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Card from "../.././components/userpage/card";
import {
  getOwedUsers,
  getOwingUsers,
  getUserBalances,
} from "../../components/userpage/getOwedUsers";
import OwedOwingCharts from "../../components/userpage/pieCharts";
import SubmitPayment from "../../components/userpage/submitPayment";
import { useGetPayments, useGetUserPayments } from "../../utils/payments";
import SubmitWithdrawal from "../../components/userpage/submitWithdrawal";

export default function UserPage({ params }) {
  const [transactions, setTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);

  const userID = params.user;
  console.log(userID);

  const { isSignedIn, user } = useUser();

  const client = supabase();

  function add(array) {
    return array.reduce((a, b) => a + b, 0);
  }

  useEffect(() => {
    const fetchTransactions = async () => {
      const { data } = await client.from("transactions").select();
      //.contains("affecting", [userID]);
      setTransactions(await data);
      setTransactionsLoading(false);
    };
    const fetchUsers = async () => {
      const { data } = await client.from("users").select();
      setUsers(await data);
      setUsersLoading(false);
    };
    if (transactionsLoading && usersLoading) {
      fetchUsers();
      fetchTransactions();
    }
  }, []);
  let userPayments = useGetPayments();

  if (!transactionsLoading && !usersLoading) {
    let userBalances = getUserBalances(transactions, users);

    console.log("transactions", transactions);
    console.log("balances ", userBalances);

    let currentUserBalance;
    userBalances.forEach((balance) => {
      if (balance.id === userID) {
        currentUserBalance = balance;
      }
    });

    userPayments.forEach((payment) => {
      userBalances.forEach((balance) => {
        if (balance.id === payment.author) {
          balance.balance += payment.amount;
        }
      });
    });

    if (isSignedIn) {
      if (user.id != userID) {
        return <>You are not allowed to access this page.</>;
      }

      return (
        <div className="justify-center">
          <Card
            text={
              currentUserBalance.balance >= 0
                ? "The house owes you:"
                : "You owe the house:"
            }
            amount={"£ " + Math.abs(currentUserBalance.balance)}
          />
          <div className="flex justify-center">
            <OwedOwingCharts userBalances={userBalances} users={users} />
          </div>
          <SubmitPayment user={user} users={users}></SubmitPayment>
          {currentUserBalance.balance >= 0 ? (
            <SubmitWithdrawal user={user} />
          ) : (
            <></>
          )}
        </div>
      );
    } else {
      return <>Loading...</>;
    }
  }
}

export const runtime = "edge";
