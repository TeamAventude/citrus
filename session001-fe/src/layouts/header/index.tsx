import { Search, User } from "lucide-react";
import { ThemeToggle } from "components/shared";

export function Header() {
  return (
    <header className="flex justify-end items-center gap-4 p-3 border-b border-border">
      <div className="relative w-full max-w-xs">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="search"
          placeholder="Search"
          className="bg-gray-100 border border-gray-300 pl-10 rounded-lg h-10 w-full text-sm text-gray-700 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none"
        />
      </div>
      <ThemeToggle />
      <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center">
        <User className="h-5 w-5 text-indigo-600" />
      </div>
    </header>
  );
}
