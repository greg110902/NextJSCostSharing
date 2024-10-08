import supabase from "../../utils/supabase";
import { useEffect, useState } from "react";

export default function PayerForm({ currentID }) {
  // Initialise states
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Runs on page refresh
    const getUsers = async () => {
      const client = supabase();
      const { data } = await client.from("users").select();
      setUsers(await data);
      setLoading(false);
    };
    if (loading) {
      getUsers();
    }
  }, []);

  // Run when the users have loaded
  if (!loading) {
    return (
      <div>
        {/* Map the users in the database to a label with their first
        name and a checkbox which is tied to their user ID */}
        {users.map((user) => {
          return (
            <div className="align-middle">
              <label className="text-black align-middle">
                {user["firstName"]}
              </label>
              <input
                type="checkbox"
                id={user["id"]}
                defaultChecked={currentID === user["id"]}
                name="payerCheckbox"
                className="checkbox bg-slate-200 align-middle mx-3"
              ></input>
            </div>
          );
        })}
      </div>
    );
  }
}
