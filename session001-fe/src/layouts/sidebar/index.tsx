import { Link, useLocation } from "react-router-dom";
import {
  GitFork,
  Rocket,
  BarChart2,
  CheckSquare,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";

export const SideBar = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const navItems = [
    { icon: GitFork, label: "Complex Agents", href: "/complex-agents" },
    { icon: Rocket, label: "Deployments", href: "#" },
    { icon: BarChart2, label: "Analytics & Cost", href: "#" },
    { icon: CheckSquare, label: "Compliance", href: "#" },
    { icon: FileText, label: "Templates", href: "#" },
    { icon: Settings, label: "Settings", href: "#" },
  ];

  const isActive = (href: string) => {
    if (href === "/complex-agents") {
      return pathname === "/complex-agents";
    }
    if (href === "#") return false;
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 bg-card text-foreground p-6 flex flex-col justify-between border-r border-border md:flex">
      <div className="flex flex-col gap-10">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-foreground rounded-full" />
          <h1 className="text-xl font-bold text-foreground">Citrus65</h1>
        </div>
        <nav>
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? "bg-active text-active-foreground font-semibold"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-indigo-50 hover:text-indigo-700">
        <LogOut className="h-5 w-5" />
        Logout
      </button>
    </aside>
  );
};
