import NavButton from "./NavButton";

export default function NavBar() {
  return (
    <div>
      <NavButton name="Transactions" loc="/transactions" />
      <NavButton name="Create" loc="/create" />
    </div>
  );
}
