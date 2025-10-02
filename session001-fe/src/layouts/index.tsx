import type React from "react";
import { SideBar } from "./sidebar";
import { Header } from "./header";
import { Outlet } from "react-router-dom";

export function AppLayout() {
  return (
    <div className="flex h-screen bg-background text-foreground">
      <SideBar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
