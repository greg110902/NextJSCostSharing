export default function Card({ text, amount }) {
  return (
    <div className="card bordered m-5 p-1 flex">
      <div className="card-body">
        <h1 className="card-title flex justify-center">{text}</h1>
        <div className="flex justify-center">{amount}</div>
      </div>
    </div>
  );
}
