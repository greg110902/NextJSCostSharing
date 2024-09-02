import CollapseTitle from "./collapse-title";
import Chart from "./transactionPieChart";

export default function Card({ text, amount }) {
  return (
    <div className="flex justify-center">
      <div className="align-middle border rounded-lg bg-slate-200 w-1/2 m-5 shadow-lg">
        <div className="flex justify-center text-black">{text}</div>
        <div className="flex justify-center text-black">{amount}</div>
      </div>
    </div>
  );
}
