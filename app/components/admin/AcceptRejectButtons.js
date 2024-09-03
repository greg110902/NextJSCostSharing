import supabase from "../../utils/supabase";
import { useRouter } from "next/navigation";

async function Accept(id, router) {
  const client = supabase();

  const { error } = await client
    .from("payments")
    .update({ status: "Accepted" })
    .eq("id", id);

  location.reload();
}

async function Reject(id, router) {
  const client = supabase();

  const { error } = await client
    .from("payments")
    .update({ status: "Rejected" })
    .eq("id", id);

  location.reload();
}

export default function AcceptRejectButtons({ id }) {
  const router = useRouter();
  return (
    <div>
      <button className="btn bg-green-600" onClick={() => Accept(id, router)}>
        Accept
      </button>
      <button className="btn bg-red-600" onClick={() => Reject(id, router)}>
        Reject
      </button>
    </div>
  );
}
