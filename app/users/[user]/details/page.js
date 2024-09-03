"use client";

import DetailsModal from "../../../components/navbar/detailsModal";
import { useUser } from "@clerk/nextjs";
import DetailsForm from "../../../components/userpage/details/detailsForm";
import { useEffect, useState } from "react";
import supabase from "../../../utils/supabase";

export default function Page() {
  const [userData, setUserData] = useState([]);
  const [userLoading, setUserLoading] = useState(true);

  const client = supabase();

  const { isSignedIn, user } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await client
        .from("users")
        .select("account_no, sort_code, account_name")
        .eq("id", user.id);
      setUserData(data);
      setUserLoading(false);
    };
    if (userLoading && isSignedIn) {
      fetchData();
    }
  });

  if (!userLoading) {
    return (
      <div className="my-5">
        <div className="flex justify-center">
          <DetailsModal />
        </div>

        <DetailsForm user={user} userData={userData[0]} />
      </div>
    );
  } else {
    return <>Loading...</>;
  }
}
