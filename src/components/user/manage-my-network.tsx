"use client";

import {
  Users as ConnectionsIcon,
  UserCheck as FollowingIcon,
  UsersRound as GroupsIcon,
  Calendar as EventsIcon,
  Building2 as PagesIcon,
  Newspaper as NewslettersIcon,
} from "lucide-react";
import { IUser } from "@/types";
import { useRouter } from "next/navigation";
export default function ManageMyNetwork({ user }: { user: IUser | null }) {
  // Connections va Followers/Following sonini aniqlash
  const connectionsCount = user?.connections?.length || 0;
  // Dynamic or static count mapping
  const networkItems = [
    {
      id: "connections",
      label: "Connections",
      icon: ConnectionsIcon,
      count: connectionsCount,
      route: "/network/connections",
    },
    {
      id: "following-followers",
      label: "Following & followers",
      icon: FollowingIcon,
      count: null,
      route: "",
    },
    {
      id: "groups",
      label: "Groups",
      icon: GroupsIcon,
      count: null,
      route: "",
    },
    {
      id: "events",
      label: "Events",
      icon: EventsIcon,
      count: null,
      route: "",
    },
    {
      id: "pages",
      label: "Pages",
      icon: PagesIcon,
      count: user?.following.map((f) => f.role === "company").length,
      route: "",
    },
    {
      id: "newsletters",
      label: "Newsletters",
      icon: NewslettersIcon,
      count: 2,
      route: "",
    },
  ];
  const router = useRouter();
  return (
    <div className="w-full bg-[#1b1f23] border border-[#38434f] rounded-xl overflow-hidden font-sans text-white">
      {/* Header Title */}
      <div className="px-4 py-3 border-b border-[#283240]">
        <h2 className="text-base font-semibold text-[#e8e6e3]">
          Manage my network
        </h2>
      </div>

      {/* List items */}
      <div className="py-1">
        {networkItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-[#283240] transition-colors cursor-pointer text-left group"
              onClick={() => router.push(item.route)}
            >
              <div className="flex items-center gap-3">
                <IconComponent className="w-5 h-5 text-[#a0a6ac] group-hover:text-white transition-colors" />
                <span className="text-sm font-semibold text-[#a0a6ac] group-hover:text-white transition-colors">
                  {item.label}
                </span>
              </div>

              {item.count !== null && (
                <span className="text-sm font-medium text-[#a0a6ac]">
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
