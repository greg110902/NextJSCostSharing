"use client";

import supabase from "../../utils/supabase";
import { useState, useEffect } from "react";
import Card from "../.././components/userpage/card";
import {
  getOwedUsers,
  getOwingUsers,
  getUserBalances,
} from "../../components/userpage/getOwedUsers";
import OwedOwingCharts from "../../components/userpage/pieCharts";

export default function UserPage({ params }) {
  const [transactions, setTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);

  const userID = params.user;
  console.log(userID);

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

    console.log(currentUserBalance);

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
      </div>
    );
  } else {
    return <>Loading...</>;
  }
}

export const runtime = "edge";
