import supabase from "../../utils/supabase";

async function onSubmit(user) {
  const client = supabase();
  const id = user.id;
  const amount = document.getElementById("amount").value;

  const { error } = await client
    .from("payments")
    .insert({ amount: amount, status: "Pending", author: id, type: true });
}

export default function SubmitPayment({ user, users }) {
  return (
    <div className="my-4">
      <div className="flex justify-center">
        <label htmlFor="modal_1" className="btn">
          Submit payment
        </label>
      </div>

      <input type="checkbox" id="modal_1" className="modal-toggle" />
      <div className="modal bg-slate-100" role="dialog">
        <div className="modal-box bg-slate-100">
          <h3 className="font-bold text-lg">Pay into house fund</h3>
          <form id="transactionForm" onSubmit={() => onSubmit(user)}>
            <div className="m-1">
              <label className="m-1 text-black">Author</label>
              <input
                id="author"
                disabled
                className="bg-slate-300 rounded flex flex-1 float-right"
                defaultValue={user.firstName}
              ></input>
            </div>
            <div className="m-1">
              <label className="m-1 text-black">Amount</label>
              <input
                type="number"
                min={1}
                step={0.01}
                id="amount"
                className="bg-slate-300 text-black rounded float-right"
              ></input>
            </div>
            <div className="modal-action">
              <button className="btn" htmlFor="modal_1" type="submit">
                Submit
              </button>
            </div>
          </form>
        </div>
        <label className="modal-backdrop" htmlFor="modal_1"></label>
      </div>
    </div>
  );
}
