"use client";

import React from "react";
import { LayoutDashboard, FolderKanban, Users, LogOut, CheckSquare } from "lucide-react";
import { Profile } from "@/types";
import { getInitials } from "@/lib/utils";

interface SidebarProps {
  currentUser: Profile | null;
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
  onLogout?: () => void;
}

export function Sidebar({
  currentUser,
  activeTab = "board",
  onSelectTab,
  onLogout,
}: SidebarProps) {
  const navItems = [
    { id: "board", label: "Board", icon: LayoutDashboard },
    { id: "projects", label: "Projects", icon: FolderKanban },
    { id: "team", label: "Team", icon: Users },
  ];

  return (
    <aside className="w-64 border-r border-neutral-200/80 bg-neutral-50/50 flex flex-col justify-between shrink-0 h-screen select-none">
      <div>
        {/* Workspace Brand */}
        <div className="h-14 px-5 flex items-center gap-2.5 border-b border-neutral-200/80">
          <div className="h-7 w-7 rounded-md bg-neutral-900 flex items-center justify-center text-white shadow-xs">
            <CheckSquare className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-tight text-neutral-900 leading-tight">
              TaskFlow
            </h1>
            <p className="text-[10px] text-neutral-500 font-medium leading-none">Engineering Workspace</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="p-3 space-y-1">
          <div className="px-2 py-1 text-[11px] font-medium text-neutral-400 uppercase tracking-wider">
            Workspace
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab?.(item.id)}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-neutral-200/70 text-neutral-900 font-semibold"
                    : "text-neutral-650 hover:bg-neutral-100 hover:text-neutral-900"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-neutral-900" : "text-neutral-500"}`} />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* User Section & Logout */}
      <div className="p-3 border-t border-neutral-200/80">
        <div className="flex items-center justify-between p-2 rounded-md bg-white border border-neutral-200 shadow-2xs">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="h-7 w-7 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs font-semibold shrink-0">
              {currentUser ? getInitials(currentUser.fullName) : "AR"}
            </div>
            <div className="truncate">
              <p className="text-xs font-medium text-neutral-900 truncate">
                {currentUser?.fullName || "Aayushi Rajesh"}
              </p>
              <p className="text-[10px] text-neutral-500 truncate">
                {currentUser?.email || "aayushi@example.com"}
              </p>
            </div>
          </div>
          <button
            onClick={onLogout}
            title="Sign out"
            className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-neutral-100 rounded transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
