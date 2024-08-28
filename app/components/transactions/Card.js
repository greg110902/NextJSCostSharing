export default function Card({
  transactionID,
  author,
  affected,
  amount,
  title,
  date,
}) {
  return (
    <div className="card bg-base-100 w-3/4 shadow-xl m-10 hover:bg-gray-100 hover:scale-105 flex justify-center">
      <div className="card-body">
        <h2 className="card-title flex justify-center">{title}</h2>
        <div>Submitted by: {author}</div>
        <div>Amount: £{amount}</div>
        <div>On: {date}</div>
      </div>
    </div>
  );
}
