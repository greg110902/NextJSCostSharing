"use client";

import { useState, useEffect } from "react";
import supabase from "./supabase";

export function getPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const client = supabase();

  useEffect(() => {
    const fetchPayments = async () => {
      const { data } = await client.from("payments").select();
      setPayments(data);
      setLoading(false);
    };

    if (loading) {
      fetchPayments();
    }
  });

  return payments;
}

export function getUserPayments(userID) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const client = supabase();

  useEffect(() => {
    const fetchPayments = async () => {
      const { data } = await client
        .from("payments")
        .select()
        .eq("author", userID);
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
