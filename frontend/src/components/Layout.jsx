import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import TripProgress from "./TripProgress";

function Layout() {
  return (
    <div className="bg-white text-zinc-950 min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <TripProgress />
          <main className="overflow-y-auto bg-gray-50 flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default Layout;
