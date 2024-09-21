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
          <div className="dropdown">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="btn size-6"
              tabIndex={0}
              role="button"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
              />
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
              >
                <li>
                  <a>Item 1</a>
                </li>
                <li>
                  <a>Item 2</a>
                </li>
              </ul>
            </svg>
          </div>
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
