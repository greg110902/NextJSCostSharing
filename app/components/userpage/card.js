import CollapseTitle from "./collapse-title";
import Chart from "./transactionPieChart";

export default function Card({ text, amount }) {
  return (
    <div className="flex justify-center">
      <div
        tabIndex={0}
        className="collapse bordered w-1/2 m-5 bg-slate-300 justify-center"
      >
        <div className="collapse-title">
          <CollapseTitle text={text} amount={amount} />
        </div>

        <div className="collapse-content flex justify-center"> </div>
      </div>
    </div>
  );
}
