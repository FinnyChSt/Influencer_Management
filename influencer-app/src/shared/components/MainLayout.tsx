import { Link, Outlet, useLocation } from "react-router-dom";
import Button from "./Button";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import NotificationToast from "../../features/notifications/components/NotificationToast";

function MainLayout() {
  const location = useLocation();
  const isRootRoute = location.pathname === "/";
  return (
    <div className="app-container">
      <nav className="flex justify-between items-center mb-8 p-4 border-b border-neutral-200 rounded-lg shadow-md bg-[#424242]">
        <h1 className="text-4xl font-extrabold uppercase">
          Influencer Management
        </h1>
        <div className="flex gap-2.5">
          <Link to="/list">
            <Button type="button" variant="primary" children={"See All"} />
          </Link>
          <Link to="/list/create">
            <Button
              type="button"
              variant="primary"
              children={
                <div className="flex items-center gap-1">
                  <span>Add</span>
                  <PlusIcon className="h-4 w-4" />
                </div>
              }
            />
          </Link>
        </div>
      </nav>
      {isRootRoute ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <h2 className="text-3xl font-bold mb-4 text-black">
            Thank you for the opportunity!
          </h2>
        </div>
      ) : (
        <Outlet />
      )}

      <NotificationToast />
    </div>
  );
}

export default MainLayout;
