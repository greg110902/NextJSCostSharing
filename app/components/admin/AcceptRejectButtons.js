import supabase from "../../utils/supabase";
import { useRouter } from "next/navigation";

async function Accept(id) {
  const client = supabase();

  const { error } = await client
    .from("payments")
    .update({ status: "Accepted", new: false })
    .eq("id", id);

  location.reload();
}

async function Reject(id) {
  const client = supabase();

  const { error } = await client
    .from("payments")
    .update({ status: "Rejected", new: false })
    .eq("id", id);

  location.reload();
}

export default function AcceptRejectButtons({ id }) {
  return (
    <div>
      <button className="btn bg-green-600" onClick={() => Accept(id)}>
        Accept
      </button>
      <button className="btn bg-red-600" onClick={() => Reject(id)}>
        Reject
      </button>
    </div>
  );
}
