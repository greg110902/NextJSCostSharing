import supabase from "../../utils/supabase";
import UserDetailsUploaded from "../userpage/userDetailsUploaded";

export default function SubmitWithdrawal({ user, maxAmount }) {
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
          <UserDetailsUploaded user={user} maxAmount={maxAmount} />
        </div>
        <label className="modal-backdrop" htmlFor="modal_2"></label>
      </div>
    </div>
  );
}
