import { SignedIn } from "@clerk/nextjs";
import NavButton from "./NavButton";
import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import DetailsModal from "./detailsModal";
import Drawer from "./Drawer";

export default async function NavBar2() {
  const user = await currentUser();
  return (
    <div className="flex bg-slate-800 p-5">
      <SignedIn>
        <Drawer></Drawer>
        <div className="flex flex-1 flex-row-reverse">
          <UserButton />
          <DetailsModal />
        </div>
      </SignedIn>
    </div>
  );
}
