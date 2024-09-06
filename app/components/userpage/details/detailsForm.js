import DetailsModal from "../../../components/navbar/detailsModal";
import supabase from "../../../utils/supabase";

async function onSubmit(user) {
  const accName = document.getElementById("accName").value;
  const accNo = document.getElementById("accNo").value;
  const sortCode = document.getElementById("sortCode").value;

  console.log("accName", accName);
  console.log("accNo", accNo);
  console.log("sort_code", sortCode);
  console.log(user.id);

  const client = supabase();

  const { error } = await client
    .from("users")
    .update({ account_name: accName, account_no: accNo, sort_code: sortCode })
    .eq("id", user.id);

  location.reload();
}

export default function DetailsForm({ user, userData }) {
  function Edit() {
    userData = undefined;
    const nameInput = document.getElementById("accName");
    const noInput = document.getElementById("accNo");
    const codeInput = document.getElementById("sortCode");

    nameInput.disabled = false;
    noInput.disabled = false;
    codeInput.disabled = false;
  }

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
