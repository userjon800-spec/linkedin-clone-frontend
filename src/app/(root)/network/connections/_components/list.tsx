"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import {api} from "@/lib/https";
import {
  MoreHorizontal,
  Trash2,
  Search,
  ChevronDown,
  Loader2,
  MessageSquare,
} from "lucide-react";

interface IUser {
  _id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  avatar?: string;
  job?: string;
  bio?: string;
}

interface IConnectionItem {
  connectionId: string;
  connectedAt: string;
  user: IUser;
}

export default function List() {
  const [connections, setConnections] = useState<IConnectionItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filter & Sort state'lari
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"recently" | "firstName" | "lastName">(
    "recently",
  );

  // Dropdown menyular boshqaruvi
  const [isSortOpen, setIsSortOpen] = useState<boolean>(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const sortRef = useRef<HTMLDivElement>(null);

  // API'dan tasdiqlangan connection'larni yuklab olish
  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchConnections();
  }, []);

  // Tashqariga bosilganda Sort menyusini yopish
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchConnections = async () => {
    try {
      setLoading(true);
      const res = await api.get("/connections/get-connections");

      if (res.data?.success) {
        const data = res.data.friends || res.data.connections || [];
        setConnections(data);
      }
    } catch (err) {
      console.error("Error fetching connections:", err);
    } finally {
      setLoading(false);
    }
  };

  // Connection'ni o'chirish (Remove Connection)
  const handleRemove = async (connectionId: string) => {
    try {
      setActionLoadingId(connectionId);
      setActiveMenuId(null);

      // DELETE so'rovini /api/connections/[id] ga yuboramiz
      const res = await api.delete(`/api/connections/${connectionId}`);

      // UI'dan ham o'chiramiz
      setConnections((prev) =>
        prev.filter((item) => item.connectionId !== connectionId),
      );
    } catch (err) {
      console.error("Error removing connection:", err);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Qidiruv va Sort mantiqlari
  const filteredConnections = connections
    .filter((item) => {
      const fullName =
        `${item.user?.firstName || ""} ${item.user?.lastName || ""}`.toLowerCase();
      const job = (item.user?.job || item.user?.bio || "").toLowerCase();
      const query = searchQuery.toLowerCase();
      return fullName.includes(query) || job.includes(query);
    })
    .sort((a, b) => {
      if (sortBy === "firstName") {
        return (a.user?.firstName || "").localeCompare(b.user?.firstName || "");
      }
      if (sortBy === "lastName") {
        return (a.user?.lastName || "").localeCompare(b.user?.lastName || "");
      }
      // Recently added (default)
      return (
        new Date(b.connectedAt).getTime() - new Date(a.connectedAt).getTime()
      );
    });

  // Sanani LinkedIn uslubida formatlash ("Connected on August 4, 2026")
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `Connected on ${date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })}`;
  };

  if (loading) {
    return (
      <div className="w-full bg-[#1b1f23] border border-[#38434f] rounded-xl p-8 flex justify-center items-center">
        <Loader2 className="w-6 h-6 animate-spin text-[#a0a6ac]" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-110 bg-[#1b1f23] border border-[#38434f] rounded-xl overflow-hidden font-sans text-white mb-6">
      {/* Header: Total Count */}
      <div className="p-4 sm:p-6 border-b border-[#283240]">
        <h1 className="text-xl sm:text-2xl font-semibold text-white">
          {connections.length} connections
        </h1>

        {/* Filter Toolbar: Sort & Search Input */}
        <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left: Sort By Dropdown */}
          <div className="relative" ref={sortRef}>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-[#a0a6ac]">
              <span>Sort by:</span>
              <button
                type="button"
                onClick={() => setIsSortOpen((prev) => !prev)}
                className="flex items-center gap-1 font-semibold text-white hover:text-[#70b5f9] transition-colors cursor-pointer"
              >
                {sortBy === "recently" && "Recently added"}
                {sortBy === "firstName" && "First name"}
                {sortBy === "lastName" && "Last name"}
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Sort Menu Popover (2-rasmdagidek) */}
            {isSortOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-[#1b1f23] border border-[#38434f] rounded-lg shadow-2xl z-20 overflow-hidden py-1">
                <button
                  type="button"
                  onClick={() => {
                    setSortBy("recently");
                    setIsSortOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                    sortBy === "recently"
                      ? "font-semibold text-white bg-[#283240]"
                      : "text-[#a0a6ac] hover:bg-[#283240] hover:text-white"
                  }`}
                >
                  Recently added
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSortBy("firstName");
                    setIsSortOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                    sortBy === "firstName"
                      ? "font-semibold text-white bg-[#283240]"
                      : "text-[#a0a6ac] hover:bg-[#283240] hover:text-white"
                  }`}
                >
                  First name
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSortBy("lastName");
                    setIsSortOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                    sortBy === "lastName"
                      ? "font-semibold text-white bg-[#283240]"
                      : "text-[#a0a6ac] hover:bg-[#283240] hover:text-white"
                  }`}
                >
                  Last name
                </button>
              </div>
            )}
          </div>

          {/* Right: Search Input & Search with filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#a0a6ac]" />
              <input
                type="text"
                placeholder="Search by name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#111417] border border-[#38434f] rounded-md pl-9 pr-3 py-1.5 text-sm text-white placeholder-[#a0a6ac] focus:outline-none focus:border-[#70b5f9] transition-colors"
              />
            </div>
            <button
              type="button"
              className="text-sm font-semibold text-[#70b5f9] hover:underline cursor-pointer whitespace-nowrap text-left sm:text-right"
            >
              Search with filters
            </button>
          </div>
        </div>
      </div>

      {/* Main Connections List */}
      {filteredConnections.length === 0 ? (
        <div className="p-8 text-center text-[#a0a6ac] text-sm">
          No connections found.
        </div>
      ) : (
        <div className="divide-y divide-[#283240]">
          {filteredConnections.map((item) => {
            const user = item.user;
            const fullName =
              `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
              "LinkedIn User";
            const jobTitle = user?.job || user?.bio || "Software Engineer";
            const avatarUrl = user?.avatar || "https://github.com/shadcn.png";
            const isMenuOpen = activeMenuId === item.connectionId;
            const isProcessing = actionLoadingId === item.connectionId;

            return (
              <div
                key={item.connectionId}
                className="p-4 sm:p-5 flex items-start sm:items-center justify-between gap-4 hover:bg-[#22272c] transition-colors relative"
              >
                {/* Left: Avatar & Info */}
                <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                  <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden border border-[#38434f] bg-[#283240] shrink-0">
                    <Image
                      src={avatarUrl}
                      alt={fullName}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex flex-col min-w-0">
                    <h2 className="text-sm sm:text-base font-semibold text-white hover:underline cursor-pointer truncate leading-snug">
                      {fullName}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#a0a6ac] line-clamp-2 mt-0.5 leading-relaxed">
                      {jobTitle}
                    </p>
                    <p className="text-[11px] sm:text-xs text-[#a0a6ac] mt-1">
                      {formatDate(item.connectedAt)}
                    </p>
                  </div>
                </div>

                {/* Right: Message Button & 3-Dots Menu */}
                <div className="flex items-center gap-2 shrink-0 self-center">
                  {/* Message Button */}
                  <button
                    type="button"
                    className="px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold text-[#70b5f9] border border-[#70b5f9] hover:bg-[#70b5f9]/10 rounded-full transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5 sm:hidden" />
                    <span className="hidden sm:inline">Message</span>
                  </button>

                  {/* 3-Dots Action Button */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveMenuId(isMenuOpen ? null : item.connectionId)
                      }
                      className="p-2 text-[#a0a6ac] hover:text-white hover:bg-[#283240] rounded-full transition-colors cursor-pointer"
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </button>

                    {/* Popover Menu: Remove Connection (3-rasmdagidek) */}
                    {isMenuOpen && (
                      <div className="absolute right-0 mt-2 w-52 bg-[#1b1f23] border border-[#38434f] rounded-lg shadow-2xl z-30 overflow-hidden py-1">
                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={() => handleRemove(item.connectionId)}
                          className="w-full text-left px-4 py-2.5 text-sm text-[#a0a6ac] hover:text-red-400 hover:bg-[#283240] transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50"
                        >
                          {isProcessing ? (
                            <Loader2 className="w-4 h-4 animate-spin text-white" />
                          ) : (
                            <Trash2 className="w-4 h-4 text-[#a0a6ac]" />
                          )}
                          <span>Remove connection</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
