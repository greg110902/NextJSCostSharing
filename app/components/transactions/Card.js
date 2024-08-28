export default function Card({
  transactionID,
  author,
  affected,
  amount,
  title,
  date,
}) {
  return (
    <div className="card bg-slate-100 w-3/4 shadow-xl m-10 hover:bg-gray-100 hover:scale-105 flex justify-center">
      <div className="card-body">
        <h2 className="card-title flex justify-center text-slate-900">
          {title}
        </h2>
        <div className="text-slate-900">Submitted by: {author}</div>
        <div className="text-slate-900">Amount: £{amount}</div>
        <div className="text-slate-900">On: {date}</div>
      </div>
    </div>
  );
}
