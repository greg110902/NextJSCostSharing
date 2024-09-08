import supabase from "../../../utils/supabase";

async function onSubmit(user) {
  // Get form field values
  const accName = document.getElementById("accName").value;
  const accNo = document.getElementById("accNo").value;
  const sortCode = document.getElementById("sortCode").value;

  // Initialise database client
  const client = supabase();

  // Update the rows -- change if different, if the same then do nothing
  const { error } = await client
    .from("users")
    .update({ account_name: accName, account_no: accNo, sort_code: sortCode })
    .eq("id", user.id);

  location.reload();
}

export default function DetailsForm({ user, userData }) {
  function Edit() {
    // Runs when the user hits the "Edit" button
    // Clear the user data
    userData = undefined;

    // Get the HTML elements
    const nameInput = document.getElementById("accName");
    const noInput = document.getElementById("accNo");
    const codeInput = document.getElementById("sortCode");

    // Allow the user to edit the form fields
    nameInput.disabled = false;
    noInput.disabled = false;
    codeInput.disabled = false;
  }

  // Use the account name as an indicator as to whether the user has enterred their account details
  let dataLoaded = userData.account_name;

  console.log(userData);

  return (
    <div className="my-5">
      <div className="flex justify-center my-5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(user);
          }}
        >
          <div className="border rounded m-2 bg-slate-50">
            <label>Account name:</label>
            <input
              id="accName"
              className="flex flex-1 float-right text-black rounded bg-slate-200"
              defaultValue={
                dataLoaded != undefined ? userData.account_name : ""
              }
              disabled={dataLoaded != undefined ? true : false}
            />
          </div>
          <div className="border rounded m-2 bg-slate-50">
            <label>Sort code:</label>
            <input
              id="sortCode"
              className="flex flex-1 float-right text-black rounded bg-slate-200"
              defaultValue={dataLoaded != undefined ? userData.sort_code : ""}
              disabled={dataLoaded != undefined ? true : false}
            />
          </div>
          <div className="border rounded m-2 bg-slate-50">
            <label>Account number:</label>
            <input
              id="accNo"
              className="flex flex-1 float-right text-black rounded bg-slate-200"
              defaultValue={dataLoaded != undefined ? userData.account_no : ""}
              disabled={dataLoaded != undefined ? true : false}
            />
          </div>
          <div>
            <button className="btn" type="submit">
              Save
            </button>
            {dataLoaded ? (
              <button className="btn" type="button" onClick={() => Edit()}>
                Edit
              </button>
            ) : (
              <></>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
