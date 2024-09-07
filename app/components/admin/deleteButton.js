import supabase from "../../utils/supabase";

async function DeleteRequest(id) {
  const client = supabase();

  const { error } = await client.from("payments").delete().eq("id", id);
}

export default function DeleteButton({ id }) {
  return (
    <button
      className="btn btn-square btn-outline float-right"
      onClick={() => DeleteRequest(id)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  );
}
