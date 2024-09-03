"use client";

import { useState, useEffect } from "react";
import supabase from "./supabase";

export function useGetPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const client = supabase();

  useEffect(() => {
    const fetchPayments = async () => {
      const { data } = await client.from("payments").select().eq("type", true);
      setPayments(data);
      setLoading(false);
    };

    if (loading) {
      fetchPayments();
    }
  });

  return payments;
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
