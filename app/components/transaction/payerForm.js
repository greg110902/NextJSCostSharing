import supabase from "../../utils/supabase";
import { useEffect, useState } from "react";

export default function PayerForm({ currentID }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  if (!loading) {
    return (
      <div>
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
