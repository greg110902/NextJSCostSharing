import { SignedIn } from "@clerk/nextjs";
import NavButton from "./NavButton";
import { UserButton } from "@clerk/nextjs";

export default function NavBar() {
  return (
    <div className="flex bg-slate-800 p-5">
      <SignedIn>
        <NavButton name="Transactions" loc="/transactions" />
        <NavButton name="Create" loc="/create" />
        <div className="flex flex-1 flex-row-reverse">
          <UserButton />
        </div>
      </SignedIn>
    </div>
  );
}
