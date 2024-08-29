"use client";

function submitForm() {
  let author = document.getElementById("author").value;
  let title = document.getElementById("title").value;
  let amount = document.getElementById("amount").value;

  console.log("title", title);
}

export default function page() {
  return (
    <div>
      <label htmlFor="my_modal_7" className="btn">
        open modal
      </label>

      <input type="checkbox" id="my_modal_7" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add transaction</h3>
          <form id="transactionForm" onSubmit={() => submitForm()}>
            <div>
              <label className="m-1">Author</label>
              <input id="author"></input>
            </div>
            <div>
              <label className="m-1">Title</label>
              <input id="title"></input>
            </div>
            <div>
              <label className="m-1">Amount</label>
              <input type="number" id="amount"></input>
            </div>
            <div className="modal-action" onClick={console.log("working")}>
              <button className="btn" htmlFor="my_modal_7" type="submit">
                Submit
              </button>
            </div>
          </form>
        </div>
        <label className="modal-backdrop" htmlFor="my_modal_7"></label>
      </div>
    </div>
  );
}
