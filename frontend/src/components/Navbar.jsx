import { NavLink } from "react-router-dom";
import { Plane } from "lucide-react";
import { mainNavItems } from "../config/navigation";

function Navbar() {
  return (
    <header className="bg-slate-900 shrink-0 text-white flex px-8 justify-between items-center h-16">
      <NavLink to="/" className="flex items-center gap-2">
        <div className="size-9 rounded-lg bg-blue-500 flex justify-center items-center">
          <Plane className="size-5 text-white" />
        </div>
        <span className="font-bold text-lg">AI Travel Planner</span>
      </NavLink>

      <nav className="flex items-center gap-1">
        {mainNavItems.map((item) => (
          <NavLink
            key={item.path + item.label}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              `font-medium rounded-lg text-sm leading-5 px-4 py-2 transition-colors ${
                isActive
                  ? "bg-blue-500 text-white font-semibold"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}

export default Navbar;
