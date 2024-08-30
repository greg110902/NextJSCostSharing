import { SignedIn } from "@clerk/nextjs";
import NavButton from "./NavButton";
import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

export default async function NavBar() {
  const user = await currentUser();
  return (
    <div className="flex bg-slate-800 p-5">
      <SignedIn>
        <NavButton name="Transactions" loc="/" />
        <NavButton name="User" loc={`/users/${user.id}`} />
        <div className="flex flex-1 flex-row-reverse">
          <UserButton />
        </div>
      </SignedIn>
    </div>
  );
}
