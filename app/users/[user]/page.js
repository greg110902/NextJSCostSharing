"use client";

import supabase from "../../utils/supabase";
import { useState, useEffect } from "react";
import Card from "../.././components/userpage/card";

export default function UserPage({ params }) {
  const [owing, setOwing] = useState([]);
  const [owed, setOwed] = useState([]);
  const [owingLoading, setOwingLoading] = useState(true);
  const [owedLoading, setOwedLoading] = useState(true);

  const userID = params.user;
  console.log(userID);

  const client = supabase();

  function add(array) {
    return array.reduce((a, b) => a + b, 0);
  }

  useEffect(() => {
    const fetchOwing = async () => {
      const { data } = await client
        .from("transactions")
        .select()
        .overlaps("affecting", [userID]);
      //.contains("affecting", [userID]);
      setOwing(await data);
      setOwingLoading(false);
    };
    const fetchOwed = async () => {
      const { data } = await client
        .from("transactions")
        .select()
        .eq("author", userID);
      //.eq("author", userID);
      setOwed(await data);
      setOwedLoading(false);
    };
    if (owedLoading && owingLoading) {
      fetchOwing();
      fetchOwed();
    }
  }, []);

  let owedArray = [];
  let owingArray = [];

  owed.forEach((element) => {
    const affectedPeople = element.affecting.length;
    owedArray.push((element.amount * affectedPeople) / (affectedPeople + 1));
  });

  owing.forEach((element) => {
    const affectedPeople = element.affecting.length;
    owingArray.push(element.amount / (affectedPeople + 1));
  });

  console.log(owed);
  if (!owingLoading && !owedLoading) {
    return (
      <div>
        <Card text="You are owed:" amount={add(owedArray)} />
        <Card text="You owe:" amount={add(owingArray)} />
        <Card
          text="Available to withdraw:"
          amount={add(owedArray) - add(owingArray)}
        />
      </div>
    );
  } else {
    return <>Loading...</>;
  }
}

export const runtime = "edge";
