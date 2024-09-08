export default function NotAllSignedUp() {
  // Just a div which shows if not everyone is signed up, e.g
  // rows in house database != 7
  return (
    <div className="bordered rounded-lg bg-slate-100 text-black p-3 my-3">
      Not everyone in house signed up yet. Transactions disabled until everyone
      has signed up.
    </div>
  );
}
