"use client";

import supabase from "../../utils/supabase";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Card from "../.././components/userpage/card";
import { getUserBalances } from "../../components/userpage/getOwedUsers";
import OwedOwingCharts from "../../components/userpage/pieCharts";
import SubmitPayment from "../../components/userpage/submitPayment";
import { useGetPayments, useGetWithdrawals } from "../../utils/payments";
import SubmitWithdrawal from "../../components/userpage/submitWithdrawal";

export default function UserPage({ params }) {
  // Initialise transactions, users and loading states
  const [transactions, setTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);

  // Get the user ID from the slug
  const userID = params.user;

  // Get the current user
  const { isSignedIn, user } = useUser();

  // Initialise the database client
  const client = supabase();

  useEffect(() => {
    // Runs on page refresh
    const fetchTransactions = async () => {
      // Select all transactions from the database
      const { data } = await client.from("transactions").select();
      // Set transactions to the received data and the loading to false
      setTransactions(await data);
      setTransactionsLoading(false);
    };
    const fetchUsers = async () => {
      // Select the users in the database
      const { data } = await client.from("users").select();
      // Set users to the received data and the loading to false
      setUsers(await data);
      setUsersLoading(false);
    };
    if (transactionsLoading && usersLoading) {
      // Run if the transactions and users are loading
      fetchUsers();
      fetchTransactions();
    }
  }, []);

  // Get the user payments and withdrawals
  let userPayments = useGetPayments();
  let userWithdrawals = useGetWithdrawals();

  if (!transactionsLoading && !usersLoading) {
    // Run if the transactions and users have finished loading
    let userBalances = getUserBalances(transactions, users);

    let currentUserBalance;

    // Loop over each users' balance
    userBalances.forEach((balance) => {
      if (balance.id === userID) {
        // Get the current users' balance
        currentUserBalance = balance;
      }
    });

    // Loop over the payments
    userPayments.forEach((payment) => {
      // Loop over the balances (transactions)
      userBalances.forEach((balance) => {
        if (balance.id === payment.author && payment.status === "Accepted") {
          // If the user has made payments in, add this to their balance
          balance.balance += payment.amount;
        }
      });
    });

    // Loop over the withdrawals
    userWithdrawals.forEach((withdrawal) => {
      // Loop over the balances (transactions)
      userBalances.forEach((balance) => {
        if (
          balance.id === withdrawal.author &&
          withdrawal.status === "Accepted"
        ) {
          // If the user has made withdrawals out, subtract this from their balance
          balance.balance -= withdrawal.amount;
        }
      });
    });

    if (isSignedIn) {
      if (user.id != userID) {
        // If someone has pasted someone elses ID into their browser, show unauthorised
        return <>You are not allowed to access this page.</>;
      }

      return (
        <div className="justify-center">
          {/* Show whether the user is owed or owes, and how much */}
          <Card
            text={
              currentUserBalance.balance >= 0
                ? "The house owes you:"
                : "You owe the house:"
            }
            amount={"£ " + (Math.abs(currentUserBalance.balance)).toFixed(2)}
          />
          <div className="flex justify-center">
            {/* Pie charts showing how much the house owes and is owed */}
            <OwedOwingCharts userBalances={userBalances} users={users} />
          </div>
          {/* Button to submit a payment into the house fund */}
          <SubmitPayment user={user} users={users}></SubmitPayment>
          {/* Button to withdraw money from the house fund. Only shows
          if the user is owed more than they owe. */}
          {currentUserBalance.balance >= 0 ? (
            <SubmitWithdrawal
              user={user}
              maxAmount={currentUserBalance.balance}
            />
          ) : (
            <></>
          )}
          {/* Button to allow user to see their personal payment/withdrawal
          queue. */}
          <a
            className="btn flex justify-center mb-5"
            href={`/users/${userID}/queue`}
          >
            Payment/withdrawal queue
          </a>
        </div>
      );
    } else {
      // If the page is still loading show loading screen
      return <>Loading...</>;
    }
  }
}

export const runtime = "edge";
