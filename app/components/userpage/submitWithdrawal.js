import supabase from "../../utils/supabase";

async function onSubmit(user) {
  const client = supabase();
  const id = user.id;
  const amount = document.getElementById("amount").value;

  const { error } = await client
    .from("withdrawals")
    .insert({ amount: amount, status: "Pending", author: id });
}

export default function SubmitPayment({ user }) {
  return (
    <div className="my-4">
      <div className="flex justify-center">
        <label htmlFor="modal_2" className="btn">
          Withdraw funds
        </label>
      </div>

      <input type="checkbox" id="modal_2" className="modal-toggle" />
      <div className="modal bg-slate-100" role="dialog">
        <div className="modal-box bg-slate-100">
          <h3 className="font-bold text-lg">Submit withdraw funds request</h3>
          <p>
            Will not take effect until marked as &quot;Accepted&quot;. May be
            rejected due to low house funds. Withdrawals are first come first
            serve.
          </p>
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
              <button className="btn" htmlFor="modal_2" type="submit">
                Submit
              </button>
            </div>
          </form>
        </div>
        <label className="modal-backdrop" htmlFor="modal_2"></label>
      </div>
    </div>
  );
}
