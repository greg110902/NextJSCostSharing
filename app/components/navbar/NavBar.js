import NavButton from "./NavButton";

export default function NavBar() {
  return (
    <div className="flex bg-slate-800">
      <NavButton name="Transactions" loc="/transactions" />
      <NavButton name="Create" loc="/create" />
    </div>
  );
}
