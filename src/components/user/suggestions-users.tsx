"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import {api} from "@/lib/https";
import { IUser } from "@/types";
import { X, UserPlus, Clock, Loader2 } from "lucide-react";
import { toast } from "../ui/toast";

const USERS_PER_PAGE = 16;

export default function SuggestionsUsers({
  connections,
}: {
  connections: string[];
}) {
  const [allUsers, setAllUsers] = useState<IUser[]>([]);
  const [displayedUsers, setDisplayedUsers] = useState<IUser[]>([]);
  const [_, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Connect bosilgan foydalanuvchilar ID'lari (Pending holati uchun)
  const [pendingUserIds, setPendingUserIds] = useState<string[]>([]);
  // 'X' bosib olib tashlangan foydalanuvchilar ID'lari
  const [dismissedUserIds, setDismissedUserIds] = useState<string[]>([]);

  const observerTarget = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Backend'dan foydalanuvchilarni olish
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const res = await api.get("/users/all");
        if(!res.data.user){
          return toast.add({description:"So'rov yuborilmagan foydalanuvchilar topilmadi"})
        }
        setAllUsers(res.data.user);
        setDisplayedUsers(res.data.user.slice(0, USERS_PER_PAGE));
      } catch (error) {
        console.error("Fetch users error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [pendingUserIds, connections]);

  // Infinite Scroll funksiyasi
  const loadMoreUsers = useCallback(() => {
    setPage((prevPage) => {
      const nextPage = prevPage + 1;
      const newDisplayed = allUsers.slice(0, nextPage * USERS_PER_PAGE);
      setDisplayedUsers(newDisplayed);
      return nextPage;
    });
  }, [allUsers]);

  const hasMore = displayedUsers.length < allUsers.length;

  useEffect(() => {
    const target = observerTarget.current;
    if (!target || !hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreUsers();
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [hasMore, isLoading, loadMoreUsers]);

  // Connect tugmasi bosilganda
  const handleConnect = async (userId: string) => {
    // 1. UI holatini darhol 'Pending' ga o'tkazamiz
    setPendingUserIds((prev) => [...prev, userId]);

    try {
      const res = await api.post(`/connections/req-connect/${userId}`);
      console.log("Connect response:", res.data);
      toast.add({
        type: "success",
        description: res.data.message,
      })
    } catch (error: any) {
      console.error("Connect error:", error);
      setPendingUserIds((prev) => prev.filter((id) => id !== userId)); // Agar xatolik bo'lsa, Pending holatini bekor qilamiz
      toast.add({
        type: "error",
        description: error.response.data.message,
        priority: "high",
      })
    }
  };

  // 'X' tugmasi bosilganda (User'ni tavsiyadan o'chirish)
  const handleDismiss = (userId: string) => {
    setDismissedUserIds((prev) => [...prev, userId]);
  };

  return (
    <div className="w-full bg-[#1b1f23] border border-[#38434f] rounded-xl p-4 font-sans text-white">
      {/* Sarlavha */}
      <h2 className="text-base font-semibold text-[#e8e6e3] mb-4">
        Suggestions for you
      </h2>

      {isLoading && displayedUsers.length === 0 ? (
        <div className="py-12 flex justify-center items-center gap-2 text-sm text-[#a0a6ac]">
          <Loader2 className="w-5 h-5 animate-spin text-white" />
          <span>Foydalanuvchilar yuklanmoqda...</span>
        </div>
      ) : (
        /* Grid Layout (4 ta ustun rasmdagidek) */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {displayedUsers 
            .filter((user) => !dismissedUserIds.includes(user._id ? user._id : "")) // X bosilganlarni ko'rsatmaymiz
            .map((user) => {
              const fullName =
                `${user.firstName || ""} ${user.lastName || ""}`.trim();
              const title = user.job || user.bio;
              const avatar = user.avatar || "https://github.com/shadcn.png";
              const coverImage =
                user.backgroundImage ||
                "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop";

              const isPending = pendingUserIds.includes(user._id ? user._id : "");

              return (
                <div
                  key={user._id}
                  className="bg-[#1b1f23] border border-[#38434f] rounded-xl overflow-hidden flex flex-col justify-between relative group hover:border-[#4f5d6c] transition-colors"
                >
                  {/* Top Cover Background */}
                  <div className="h-16 w-full relative bg-[#283240]">
                    <Image
                      src={coverImage}
                      alt="Cover"
                      fill
                      className="object-cover opacity-60"
                    />

                    {/* X (Dismiss) Button */}
                    <button
                      type="button"
                      onClick={() => handleDismiss(user._id ? user._id : "")}
                      className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white p-1 rounded-full transition-colors z-10 cursor-pointer"
                      title="Dismiss"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Profile Avatar & Info */}
                  <div className="px-3 pb-3 flex flex-col items-center text-center -mt-10 flex-1 justify-between">
                    <div className="flex flex-col items-center">
                      {/* Avatar */}
                      <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[#1b1f23] bg-[#283240] mb-2 shadow-md">
                        <Image
                          src={avatar}
                          alt={fullName}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Name */}
                      <h3 className="text-sm font-semibold text-white leading-tight line-clamp-1 hover:underline cursor-pointer">
                        {fullName}
                      </h3>

                      {/* Title / Headline */}
                      <p className="text-xs text-[#a0a6ac] mt-1 line-clamp-2 min-h-8 leading-tight">
                        {title}
                      </p>
                    </div>

                    {/* Mutual Connections & Connect Button Section */}
                    <div className="w-full mt-3 space-y-3">
                      {/* Mutual Connections (rasmdagidek) */}
                      <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#a0a6ac]">
                        <div className="w-4 h-4 rounded-full bg-[#283240] overflow-hidden relative shrink-0">
                          <Image
                            src={avatar}
                            alt="Mutual"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="truncate max-w-40">
                          Mutual connection available
                        </span>
                      </div>

                      {/* Connect / Pending Button */}
                      <button
                        type="button"
                        onClick={() => !isPending && handleConnect(user._id ? user._id : "")}
                        disabled={isPending}
                        className={`w-full py-1.5 px-3 rounded-full text-sm font-semibold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          isPending
                            ? "border-[#a0a6ac] text-[#a0a6ac] bg-transparent cursor-not-allowed"
                            : "border-[#70b5f9] text-[#70b5f9] hover:bg-[#70b5f9]/10 hover:border-[#70b5f9]"
                        }`}
                      >
                        {isPending ? (
                          <>
                            <Clock className="w-4 h-4" />
                            <span>Pending</span>
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4" />
                            <span>Connect</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* Infinite Scroll Trigger Indicator */}
      {hasMore && (
        <div
          ref={observerTarget}
          className="py-6 flex justify-center items-center"
        >
          <Loader2 className="w-6 h-6 animate-spin text-[#a0a6ac]" />
        </div>
      )}
    </div>
  );
}
