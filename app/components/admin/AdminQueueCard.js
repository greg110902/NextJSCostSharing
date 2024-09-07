import { useEffect, useState } from "react";
import supabase from "../../utils/supabase";
import Badge from "../userpage/queue/Badge";
import { useUser } from "@clerk/nextjs";
import AcceptRejectButtons from "./AcceptRejectButtons";
import DeleteButton from "./deleteButton";

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function userIDToName(userID, users) {
  const u = users.map((user) => {
    if (user.id === userID) {
      return user.firstName;
    }
  });

  const filter = u.filter((us) => us);

  return filter[0];
}

export default function Card({ ID, author, amount, date, type, status }) {
  const [users, setUsers] = useState([]);

  const client = supabase();

  const { isSignedIn, user } = useUser();

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await client.from("users").select();
      setUsers(data);
    };

    fetchUsers();
  }, []);

  return (
    <div className="card bg-slate-100 w-3/4 shadow-xl m-10 hover:bg-gray-100 hover:scale-105 flex justify-center">
      <div className="card-body">
        <div className="card-title flex justify-center text-slate-900">
          <div>
            <div className="float-left">
              <Badge status={status} />
            </div>
            <DeleteButton id={ID} />
          </div>
          <div>{type === true ? "Payment" : "Withdrawal"}</div>
        </div>
        <div className="text-slate-900">
          Submitted by: {userIDToName(author, users)}
        </div>
        <div className="text-slate-900">Amount: £{amount}</div>
        <div className="text-slate-900">On: {date}</div>
      </div>
      <div className="flex justify-center">
        {isSignedIn && user.publicMetadata.role === "admin" ? (
          <AcceptRejectButtons id={ID} />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
