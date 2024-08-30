import supabase from "../../utils/supabase";
import { useEffect, useState } from "react";

export default function PayerForm() {
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
    console.log(users);
    return (
      <div>
        {users.map((user) => {
          return (
            <div>
              <label>{user["firstName"]}</label>
              <input
                type="checkbox"
                id={user["id"]}
                name="payerCheckbox"
              ></input>
            </div>
          );
        })}
      </div>
    );
  }
}
