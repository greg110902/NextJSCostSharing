"use client";

import DetailsModal from "../../../components/navbar/detailsModal";
import { useUser } from "@clerk/nextjs";
import DetailsForm from "../../../components/userpage/details/detailsForm";
import { useEffect, useState } from "react";
import supabase from "../../../utils/supabase";

export default function Page() {
  // Initialise user data and user data loading states
  const [userData, setUserData] = useState([]);
  const [userLoading, setUserLoading] = useState(true);

  // Initialise database client
  const client = supabase();

  // Get the current user
  const { isSignedIn, user } = useUser();

  // UseEffect runs on page refresh
  useEffect(() => {
    const fetchData = async () => {
      // Select the account details from the user with id = user.id
      const { data } = await client
        .from("users")
        .select("account_no, sort_code, account_name")
        .eq("id", user.id);

      // Set the user data variable to the received data and set loading to false
      setUserData(data);
      setUserLoading(false);
    };
    // Run if the user hasn't been loaded but is signed in
    if (userLoading && isSignedIn) {
      fetchData();
    }
  });

  if (!userLoading) {
    // Return when the user details have been loaded
    return (
      <div className="my-5">
        <div className="flex justify-center">
          {/* Return an info box with the monzo account details */}
          <DetailsModal />
        </div>

        {/* Form for the user to input their details. If they already have
        entered their details, then the form will be already filled out */}
        <DetailsForm user={user} userData={userData[0]} />
      </div>
    );
  } else {
    {
      /* Return loading if the page is still loading. */
    }
    return <>Loading...</>;
  }
}

export const runtime = "edge";
