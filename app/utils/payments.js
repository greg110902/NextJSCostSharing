"use client";

import { useState, useEffect } from "react";
import supabase from "./supabase";

export function useGetPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const client = supabase();

  useEffect(() => {
    const fetchPayments = async () => {
      const { data } = await client
        .from("payments")
        .select()
        .eq("type", true)
        .eq("status", "Accepted");
      setPayments(data);
      setLoading(false);
    };

    if (loading) {
      fetchPayments();
    }
  });

  return payments;
}

export function useGetWithdrawals() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);

  const client = supabase();

  useEffect(() => {
    const fetchWithdrawals = async () => {
      const { data } = await client
        .from("payments")
        .select()
        .eq("type", false)
        .eq("status", "Accepted");
      setWithdrawals(data);
      setLoading(false);
    };

    if (loading) {
      fetchWithdrawals();
    }
  });

  return withdrawals;
}

export function useGetUserPayments(userID) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const client = supabase();

  useEffect(() => {
    const fetchPayments = async () => {
      const { data } = await client
        .from("payments")
        .select()
        .eq("author", userID)
        .eq("type", true);
      setPayments(data);
      setLoading(false);
    };

    if (loading) {
      fetchPayments();
    }
  });

  if (!loading) {
    return payments;
  }
}
