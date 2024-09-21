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
        <div className="card-title flex justify-between">
          <h2 className="text-slate-900">{title}</h2>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
            />
          </svg>
        </div>
        <div className="text-slate-900">Submitted by: {author}</div>
        <div className="text-slate-900">Amount: £{amount}</div>
        <div className="text-slate-900">
          {" "}
          Affecting:{" "}
          {affected.map((person) => {
            return " " + userIDToName(person, users);
          })}
        </div>
        <div className="text-slate-900">On: {date}</div>
      </div>
    </div>
  );
}
