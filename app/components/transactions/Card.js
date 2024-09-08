import { useEffect, useState } from "react";
import supabase from "../../utils/supabase";

function userIDToName(userID, users) {
  // Looks up the ID and returns their first name
  const u = users.map((user) => {
    if (user.id === userID) {
      return user.firstName;
    }
  });

  const filter = u.filter((us) => us);

  return filter[0];
}

export default function Card({
  transactionID,
  author,
  affected,
  amount,
  title,
  date,
}) {
  // Initialise states
  const [users, setUsers] = useState([]);

  // Initialise database client
  const client = supabase();

  useEffect(() => {
    // Runs on page refresh
    const fetchUsers = async () => {
      const { data } = await client.from("users").select();
      setUsers(data);
    };

    fetchUsers();
  }, []);

  return (
    <div className="card bg-slate-100 w-3/4 shadow-xl m-10 hover:bg-gray-100 hover:scale-105 flex justify-center">
      {/* Returns a DaisyUI card component which shows transaction details */}
      <div className="card-body">
        <h2 className="card-title flex justify-center text-slate-900">
          {title}
        </h2>
        <div className="text-slate-900">Submitted by: {author}</div>
        <div className="text-slate-900">Amount: £{amount}</div>
        <div className="text-slate-900">
          {" "}
          Affecting:{" "}
          {affected.map((person) => {
            return userIDToName(person, users);
          })}
        </div>
        <div className="text-slate-900">On: {date}</div>
      </div>
    </div>
  );
}
