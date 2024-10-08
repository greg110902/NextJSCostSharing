import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import DetailsModal from "./detailsModal";

export default async function Drawer({ content }) {
  const user = await currentUser();
  return (
    <div className="drawer z-10">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <div className="navbar bg-base-300 w-full">
          <div className="flex-none lg:hidden">
            <label
              htmlFor="my-drawer-3"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-6 w-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <div className="mx-2 flex-1 px-2">54 Belmont Road Finances</div>
          <div className="hidden flex-none lg:block">
            <ul className="menu menu-horizontal">
              {/* Navbar menu content */}
              <li>
                <a href="/">Transactions list</a>
              </li>
              <li>
                <a href={`/users/${await user.id}`}>User</a>
              </li>
              <li>
                <a href={`/users/${await user.id}/details`}>Details</a>
              </li>
              {/* Only see the admin queue if the user is an admin */}
              {(await user.publicMetadata.role) === "admin" ? (
                <li>
                  <a href={`/admin/queue`}>Admin queue</a>
                </li>
              ) : (
                <></>
              )}
            </ul>
          </div>
          <UserButton />
        </div>
        {/* Page content */}
        {content}
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-3"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 min-h-full w-80 p-4">
          {/* Sidebar content */}
          <li>
            <a href="/">Transactions list</a>
          </li>
          <li>
            <a href={`/users/${await user.id}`}>User</a>
          </li>
          <li>
            <a href={`/users/${await user.id}/details`}>Details</a>
          </li>
          {/* Only see the admin queue if the user is an admin */}
          {(await user.publicMetadata.role) === "admin" ? (
            <li>
              <a href={`/admin/queue`}>Admin queue</a>
            </li>
          ) : (
            <></>
          )}
        </ul>
      </div>
    </div>
  );
}
