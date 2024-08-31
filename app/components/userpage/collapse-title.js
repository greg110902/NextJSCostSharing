export default function CollapseTitle({ text, amount }) {
  return (
    <div>
      <div className="flex justify-center">{text}</div>
      <div className="flex justify-center">{amount}</div>
    </div>
  );
}
