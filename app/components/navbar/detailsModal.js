"use client";

export default function DetailsModal() {
  return (
    <div className="mx-5">
      <button
        className="btn text-white bg-slate-500"
        onClick={() => document.getElementById("my_modal_2").showModal()}
      >
        View bank details
      </button>
      <dialog id="my_modal_2" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Monzo details:</h3>
          <p className="py-2">Sort code: 04-00-03</p>
          <p className="py-2">Account number: 38210828</p>
          <p className="py-2">Name: Greg Humphreys</p>
          <p className="py-2">Click outside to close</p>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}
